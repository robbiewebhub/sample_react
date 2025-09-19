
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMessagingPermissions } from './use-messaging-permissions';

export function useConversationCreator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { canMessageUser } = useMessagingPermissions();

  const createConversation = async (targetUserId: string): Promise<string | null> => {
    try {
      if (!user || !targetUserId) {
        console.error('Missing user or target user ID');
        return null;
      }
      
      if (user.id === targetUserId) {
        console.error('Cannot create conversation with self');
        toast({
          title: 'Error',
          description: 'You cannot message yourself',
          variant: 'destructive',
        });
        return null;
      }
      
      // First check if users can message each other
      const canMessage = await canMessageUser(targetUserId);
      if (!canMessage) {
        toast({
          title: 'Cannot Message User',
          description: 'You can only message users who you follow and who follow you back',
          variant: 'destructive',
        });
        return null;
      }
      
      setLoading(true);
      console.log('Creating conversation between', user.id, 'and', targetUserId);
      
      // Call the RPC function with named parameters for clarity
      const { data, error } = await supabase.rpc(
        'create_conversation_between_users',
        { 
          user1_id: user.id,
          user2_id: targetUserId
        }
      );
      
      if (error) {
        console.error('Error creating conversation:', error);
        
        // Check for specific error message about users needing to follow each other
        if (error.message.includes('must follow each other')) {
          toast({
            title: 'Cannot Create Conversation',
            description: 'You can only message users who you follow and who follow you back',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error Creating Conversation',
            description: error.message || 'Unknown error occurred',
            variant: 'destructive',
          });
        }
        return null;
      }
      
      if (!data) {
        throw new Error('Failed to create conversation');
      }
      
      console.log('Conversation created with ID:', data);
      return data;
      
    } catch (error) {
      console.error('Error creating conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error Creating Conversation',
        description: `Failed to create conversation: ${errorMessage}`,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createConversation
  };
}


import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useMessagingPermissions() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const canMessageUser = async (targetUserId: string): Promise<boolean> => {
    if (!user) return false;
    if (user.id === targetUserId) return false; // Can't message yourself
    
    try {
      setLoading(true);
      
      // Use our custom SQL function to check if the users are connected
      const { data, error } = await supabase.rpc(
        'can_message_user',
        { 
          current_user_id: user.id,
          target_user_id: targetUserId
        }
      );
      
      if (error) {
        console.error('Error checking messaging permissions:', error);
        toast({
          title: 'Error',
          description: 'Could not verify messaging permissions',
          variant: 'destructive',
        });
        return false;
      }
      
      if (!data) {
        toast({
          title: 'Cannot message user',
          description: 'You can only message users who you follow and who follow you back',
          variant: 'destructive',
        });
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in canMessageUser:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    canMessageUser
  };
}

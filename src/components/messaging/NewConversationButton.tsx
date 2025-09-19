
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMessaging } from '@/hooks/use-messaging';
import { PlusCircle } from 'lucide-react';

type NewConversationButtonProps = {
  initialUsername?: string;
};

const NewConversationButton = ({ initialUsername }: NewConversationButtonProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { canMessageUser, createConversation } = useMessaging();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Set initial username when provided
  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
      setIsOpen(true);
    }
  }, [initialUsername]);

  // Check if we've been redirected with a userId query param
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const targetUsername = searchParams.get('username');
    
    if (targetUsername) {
      setUsername(targetUsername);
      setIsOpen(true);
      // Clear the query param from the URL
      searchParams.delete('username');
      navigate({
        pathname: location.pathname,
        search: searchParams.toString()
      }, { replace: true });
    }
  }, [location, navigate]);

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    console.log('Searching for user with username:', username);
    
    try {
      // Find the user by username
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', username.trim())
        .maybeSingle();
        
      if (userError || !userData) {
        console.error('Error or no user found:', userError);
        toast({
          title: 'User not found',
          description: 'No user with this username was found',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Found user:', userData);
      
      // Check if the user can be messaged (mutual follows)
      const canMessage = await canMessageUser(userData.id);
      console.log('Can message user:', canMessage);
      
      if (!canMessage) {
        toast({
          title: 'Cannot message user',
          description: 'You can only message users who you follow and who follow you back',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      // Create a new conversation
      const conversationId = await createConversation(userData.id);
      console.log('Created conversation:', conversationId);
      
      if (conversationId) {
        // Close the dialog and navigate to the new conversation
        setIsOpen(false);
        setUsername('');
        // Use a different URL format to indicate a new conversation
        navigate(`/messages/${conversationId}?new=true`);
      } else {
        throw new Error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the conversation',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        className="flex items-center space-x-1"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle size={16} />
        <span>New Message</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Enter the username of the person you want to message. You can only message users who you follow and who follow you back.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setUsername('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                disabled={!username.trim() || isLoading}
              >
                {isLoading ? 'Searching...' : 'Start Conversation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewConversationButton;

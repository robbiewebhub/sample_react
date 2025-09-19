
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConversationHeader from './ConversationHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import { useMessaging } from '@/hooks/use-messaging';
import { MessageFormData } from '@/types/messaging.types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';

type ConversationViewProps = {
  conversationId: string;
};

const ConversationView = ({ conversationId }: ConversationViewProps) => {
  const { getConversation, currentConversation, messages, loading, sendMessage, fetchMessages } = useMessaging();
  const [isSending, setIsSending] = useState(false);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [conversationExists, setConversationExists] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if this is a newly created conversation
  const isNewConversation = new URLSearchParams(location.search).get('new') === 'true';
  
  // Set up real-time subscription
  useEffect(() => {
    if (!conversationId) return;
    
    // Subscribe to new messages in this conversation
    const channel = supabase.channel(`conversation:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        console.log('New message received:', payload);
        // Refresh messages
        fetchMessages(conversationId);
      })
      .subscribe((status) => {
        console.log(`Subscription status for conversation ${conversationId}:`, status);
      });
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);
  
  // Check if conversation exists
  useEffect(() => {
    const checkConversation = async () => {
      if (!conversationId) return;
      
      try {
        console.log('Checking conversation:', conversationId, 'isNew:', isNewConversation);
        
        // If it's a new conversation, we'll trust that it exists
        if (isNewConversation) {
          console.log('New conversation detected, fetching data');
          setConversationExists(true);
          
          // Fetch conversation details and messages
          await getConversation(conversationId);
          await fetchMessages(conversationId);
          
          // Clean up the URL parameter after we've processed it
          navigate(`/messages/${conversationId}`, { replace: true });
        } else {
          // Check if conversation exists
          const { data, error } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', conversationId)
            .maybeSingle();
          
          if (error) {
            console.error('Error checking conversation:', error);
            setConversationExists(false);
            
            // After a short delay, navigate back to the messages list
            setTimeout(() => {
              toast({
                title: 'Error',
                description: 'There was an error checking the conversation.',
                variant: 'destructive'
              });
              navigate('/messages');
            }, 2000);
            return;
          }
          
          if (!data) {
            console.error('Conversation not found:', conversationId);
            setConversationExists(false);
            
            // After a short delay, navigate back to the messages list
            setTimeout(() => {
              toast({
                title: 'Conversation not found',
                description: 'The conversation you\'re looking for doesn\'t exist or has been deleted.',
                variant: 'destructive'
              });
              navigate('/messages');
            }, 2000);
            return;
          }
          
          setConversationExists(true);
          
          // Fetch conversation and messages
          await getConversation(conversationId);
          await fetchMessages(conversationId);
        }
      } catch (error) {
        console.error('Error checking conversation:', error);
        if (!isNewConversation) {
          setConversationExists(false);
        }
      } finally {
        setLoadAttempted(true);
      }
    };
    
    checkConversation();
  }, [conversationId, getConversation, fetchMessages, navigate, toast, isNewConversation]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mark messages as read when viewing them
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!conversationId || messages.length === 0 || !user) return;
      
      try {
        // Update read_at for all messages in this conversation that were not sent by the current user
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .is('read_at', null)
          .neq('sender_id', user.id);
          
        if (updateError) {
          console.error('Error marking messages as read:', updateError);
        }
      } catch (error) {
        console.error('Error in markMessagesAsRead:', error);
      }
    };
    
    markMessagesAsRead();
  }, [conversationId, messages, user]);
  
  const handleSendMessage = async (messageData: MessageFormData) => {
    if (isSending) return;
    
    setIsSending(true);
    
    try {
      const success = await sendMessage(conversationId, messageData);
      
      if (!success) {
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  // If the conversation doesn't exist, show this message
  if (loadAttempted && !conversationExists && !isNewConversation) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Conversation not found</p>
            <p className="text-gray-400 text-sm">Redirecting to messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader conversation={currentConversation} />
      
      {loading && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Loading conversation...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No messages yet. Send a message to start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      <MessageComposer 
        onSendMessage={handleSendMessage} 
        disabled={loading || isSending || (!conversationExists && !isNewConversation)}
      />
    </div>
  );
};

export default ConversationView;

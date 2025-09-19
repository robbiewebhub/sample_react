
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useMessaging } from '@/hooks/use-messaging';
import { Conversation } from '@/types/messaging.types';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useFollowedUsers } from '@/hooks/use-followed-users';

const ConversationList = () => {
  const { loading, conversations, fetchConversations } = useMessaging();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { followedUsers, isLoading: followedLoading } = useFollowedUsers();
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchConversations();
    
    // Check if we need to handle a username query parameter
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    
    if (username) {
      // If there's a username parameter, we'll let the NewConversationButton component handle it
    }
  }, [location.search]);

  // Filter conversations to only show those with users who you follow and who follow you back
  useEffect(() => {
    if (loading || followedLoading) return;
    
    // Only show conversations with users you follow (we already check if they follow you back in the canMessageUser function)
    const validConversations = conversations.filter(conversation => {
      const otherParticipant = getOtherParticipant(conversation);
      return otherParticipant && followedUsers.includes(otherParticipant.id);
    });
    
    setFilteredConversations(validConversations);
  }, [conversations, followedUsers, loading, followedLoading]);

  const getOtherParticipant = (conversation: Conversation) => {
    // Find the participant that is not the current user
    if (!user) return null;
    return conversation.participants.find(
      participant => participant.profile && participant.profile.id !== user.id
    )?.profile;
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };

  const renderConversationPreview = (conversation: Conversation) => {
    const otherParticipant = getOtherParticipant(conversation);
    
    if (!otherParticipant) {
      console.log('No other participant found for conversation:', conversation.id);
      return null; // Skip rendering if no other participant is found
    }

    const isActive = conversation.id === conversationId;
    const lastMessage = conversation.lastMessage;
    
    return (
      <Button
        key={conversation.id}
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start p-3 h-auto"
        onClick={() => handleConversationClick(conversation.id)}
      >
        <div className="flex items-center space-x-3 w-full">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <img 
              src={otherParticipant.avatar_url || "/placeholder.svg"} 
              alt={otherParticipant.username || 'User'} 
              className="object-cover"
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <p className="font-medium truncate">
                {otherParticipant.full_name || otherParticipant.username || 'User'}
              </p>
              {lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                </span>
              )}
            </div>
            {lastMessage && (
              <p className="text-sm text-gray-500 truncate">
                {lastMessage.media_url ? '[Media]' : ''}
                {lastMessage.voice_note_url ? '[Voice Note]' : ''}
                {lastMessage.content}
              </p>
            )}
          </div>
        </div>
      </Button>
    );
  };

  return (
    <div className="w-full">
      <h2 className="sr-only">Messages</h2>
      
      {(loading || followedLoading) && (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
          <p className="ml-2 text-gray-500">Loading conversations...</p>
        </div>
      )}
      
      {!loading && !followedLoading && filteredConversations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No conversations yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Start messaging with users who follow you back
          </p>
        </div>
      )}
      
      <div className="space-y-1">
        {filteredConversations.map(renderConversationPreview)}
      </div>
    </div>
  );
};

export default ConversationList;

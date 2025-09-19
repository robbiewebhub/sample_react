
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Conversation } from '@/types/messaging.types';
import { useAuth } from '@/contexts/AuthContext';

type ConversationHeaderProps = {
  conversation: Conversation | null;
};

const ConversationHeader = ({ conversation }: ConversationHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const getOtherParticipant = () => {
    if (!conversation || !user) return null;
    
    return conversation.participants.find(
      participant => participant.profile && participant.profile.id !== user.id
    )?.profile;
  };
  
  const otherParticipant = getOtherParticipant();
  
  const handleBack = () => {
    navigate('/messages');
  };

  return (
    <div className="flex items-center space-x-3 p-3 border-b">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleBack}
        className="text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={20} />
      </Button>
      
      {otherParticipant ? (
        <>
          <Link to={`/profile/${otherParticipant.username}`}>
            <Avatar className="h-9 w-9">
              <img
                src={otherParticipant.avatar_url || "/placeholder.svg"}
                alt={otherParticipant.username || 'User'}
                className="object-cover"
              />
            </Avatar>
          </Link>
          
          <div>
            <Link to={`/profile/${otherParticipant.username}`} className="font-medium hover:underline">
              {otherParticipant.full_name || otherParticipant.username || 'User'}
            </Link>
            {/* You could add an online status indicator here */}
          </div>
        </>
      ) : (
        <div className="animate-pulse">
          <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ConversationHeader;

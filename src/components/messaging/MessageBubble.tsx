import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types/messaging.types';
import { cn } from '@/lib/utils';
import { getMessageMediaUrl } from '@/integrations/supabase/storage';
import { formatDistanceToNow } from 'date-fns';
import { Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type MessageBubbleProps = {
  message: Message;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCurrentUser = user?.id === message.sender_id;
  
  const renderMedia = () => {
    if (!message.media_url) return null;
    
    const mediaUrl = getMessageMediaUrl(message.media_url);
    
    if (message.media_type?.startsWith('image/')) {
      return (
        <img
          src={mediaUrl}
          alt="Message attachment"
          className="max-w-xs rounded-lg mb-2 object-contain"
          onClick={() => window.open(mediaUrl, '_blank')}
        />
      );
    } else if (message.media_type?.startsWith('video/')) {
      return (
        <video
          src={mediaUrl}
          controls
          className="max-w-xs rounded-lg mb-2"
        />
      );
    } else {
      // Generic file attachment
      return (
        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <a 
            href={mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Attachment
          </a>
        </div>
      );
    }
  };
  
  const renderVoiceNote = () => {
    if (!message.voice_note_url) return null;
    
    const voiceNoteUrl = getMessageMediaUrl(message.voice_note_url);
    
    return (
      <audio
        src={voiceNoteUrl}
        controls
        className="max-w-xs mb-2"
      />
    );
  };

  const renderSharedPost = () => {
    if (!message.shared_post_id) return null;

    return (
      <div 
        className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => navigate(`/post/${message.shared_post_id}`)}
      >
        <Share2 size={16} className="text-gray-600" />
        <div>
          <p className="text-sm font-medium">Shared Post</p>
          <p className="text-xs text-gray-500">Click to view</p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex items-start space-x-2 mb-4",
      isCurrentUser ? "flex-row-reverse space-x-reverse" : "flex-row"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <img 
            src={message.sender?.avatar_url || "/placeholder.svg"} 
            alt={message.sender?.username || 'User'} 
            className="object-cover"
          />
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[75%] space-y-1",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl",
          isCurrentUser 
            ? "bg-fusion-primary text-white rounded-br-none" 
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        )}>
          {renderMedia()}
          {renderVoiceNote()}
          {renderSharedPost()}
          {message.content && <p>{message.content}</p>}
        </div>
        
        <p className={cn(
          "text-xs text-gray-500",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;


import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, UserPlus, Share2, AtSign, Bell, Mail, UserCheck, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types/notification.types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFollowedUsers } from '@/hooks/use-followed-users';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshFollowed } = useFollowedUsers();
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-fusion-accent" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-fusion-secondary" />;
      case 'follow':
        return <UserCheck className="h-4 w-4 text-fusion-primary" />;
      case 'follow_request':
        return <UserPlus className="h-4 w-4 text-orange-500" />;
      case 'follow_accepted':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'share':
        return <Share2 className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <Mail className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleAcceptFollowRequest = async () => {
    if (!notification.relateduserid) return;
    
    try {
      // Extract the request ID from the notification ID if it's a temp ID
      let requestId: string | null = null;
      
      if (notification.id.startsWith('temp-')) {
        requestId = notification.id.replace('temp-', '');
      }
      
      // If we have a request ID from the temp ID, use it directly
      if (requestId) {
        console.log('Using request ID from notification ID:', requestId);
        
        // Update the follow request status
        const { error: updateError } = await supabase
          .from('follow_requests')
          .update({ status: 'accepted' })
          .eq('id', requestId);
          
        if (updateError) {
          console.error('Error updating follow request:', updateError);
          toast({
            title: 'Error',
            description: 'Failed to accept follow request',
            variant: 'destructive',
          });
          return;
        }
        
        // Mark notification as read
        onMarkAsRead(notification.id);
        
        // Refresh followed users list to include the new follower
        refreshFollowed();
        
        toast({
          title: 'Follow request accepted',
          description: `You are now connected with ${notification.relatedUserName}`,
        });
        return;
      }
      
      // Fallback to the old approach if we don't have a request ID from temp ID
      // Find the follow request
      const { data: followRequests, error: findError } = await supabase
        .from('follow_requests')
        .select('*')
        .eq('requester_id', notification.relateduserid)
        .eq('target_id', notification.userid)
        .eq('status', 'pending')
        .single();
        
      if (findError) {
        console.error('Error finding follow request:', findError);
        if (findError.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
          toast({
            title: 'Error',
            description: 'Failed to find follow request',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Follow request not found',
            description: 'This follow request may have been processed already',
            variant: 'destructive',
          });
        }
        return;
      }
      
      if (!followRequests) {
        toast({
          title: 'Follow request not found',
          description: 'This follow request may have been processed already',
          variant: 'destructive',
        });
        return;
      }
      
      // Update the follow request status
      const { error: updateError } = await supabase
        .from('follow_requests')
        .update({ status: 'accepted' })
        .eq('id', followRequests.id);
        
      if (updateError) {
        console.error('Error updating follow request:', updateError);
        toast({
          title: 'Error',
          description: 'Failed to accept follow request',
          variant: 'destructive',
        });
        return;
      }
      
      // Mark notification as read
      onMarkAsRead(notification.id);
      
      // Refresh followed users list
      refreshFollowed();
      
      toast({
        title: 'Follow request accepted',
        description: `You are now connected with ${notification.relatedUserName}`,
      });
    } catch (error) {
      console.error('Error accepting follow request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept follow request',
        variant: 'destructive',
      });
    }
  };
  
  const handleRejectFollowRequest = async () => {
    if (!notification.relateduserid) return;
    
    try {
      // Extract the request ID from the notification ID if it's a temp ID
      let requestId: string | null = null;
      
      if (notification.id.startsWith('temp-')) {
        requestId = notification.id.replace('temp-', '');
      }
      
      // If we have a request ID from the temp ID, use it directly
      if (requestId) {
        console.log('Using request ID from notification ID:', requestId);
        
        // Update the follow request status
        const { error: updateError } = await supabase
          .from('follow_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);
          
        if (updateError) {
          console.error('Error updating follow request:', updateError);
          toast({
            title: 'Error',
            description: 'Failed to reject follow request',
            variant: 'destructive',
          });
          return;
        }
        
        // Mark notification as read
        onMarkAsRead(notification.id);
        
        toast({
          title: 'Follow request rejected',
          description: `You rejected the follow request from ${notification.relatedUserName}`,
        });
        return;
      }
      
      // Fallback to the old approach if we don't have a request ID from temp ID
      // Find the follow request
      const { data: followRequests, error: findError } = await supabase
        .from('follow_requests')
        .select('*')
        .eq('requester_id', notification.relateduserid)
        .eq('target_id', notification.userid)
        .eq('status', 'pending')
        .single();
        
      if (findError) {
        console.error('Error finding follow request:', findError);
        if (findError.code !== 'PGRST116') {
          toast({
            title: 'Error',
            description: 'Failed to find follow request',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Follow request not found',
            description: 'This follow request may have been processed already',
            variant: 'destructive',
          });
        }
        return;
      }
      
      if (!followRequests) {
        toast({
          title: 'Follow request not found',
          description: 'This follow request may have been processed already',
          variant: 'destructive',
        });
        return;
      }
      
      // Update the follow request status
      const { error: updateError } = await supabase
        .from('follow_requests')
        .update({ status: 'rejected' })
        .eq('id', followRequests.id);
        
      if (updateError) {
        console.error('Error updating follow request:', updateError);
        toast({
          title: 'Error',
          description: 'Failed to reject follow request',
          variant: 'destructive',
        });
        return;
      }
      
      // Mark notification as read
      onMarkAsRead(notification.id);
      
      toast({
        title: 'Follow request rejected',
        description: `You rejected the follow request from ${notification.relatedUserName}`,
      });
    } catch (error) {
      console.error('Error rejecting follow request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject follow request',
        variant: 'destructive',
      });
    }
  };
  
  const handleClick = () => {
    console.log('Notification clicked:', notification);
    
    // Only handle click for non-follow-request notifications
    if (notification.type !== 'follow_request') {
      onMarkAsRead(notification.id);
      
      // Navigate based on notification type
      if (notification.relateditemtype === 'post' && notification.relateditemid) {
        // Check if the relateditemid is a valid UUID before navigating
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(notification.relateditemid)) {
          navigate(`/post/${notification.relateditemid}`);
        } else {
          console.error('Invalid post ID:', notification.relateditemid);
          toast({
            title: 'Error',
            description: 'Cannot navigate to this post',
            variant: 'destructive',
          });
        }
      } else if (notification.type === 'follow' || notification.type === 'follow_accepted') {
        if (notification.relateduserid) {
          navigate(`/profile/${notification.relateduserid}`);
        }
      } else if (notification.type === 'message' && notification.relateditemid) {
        navigate(`/messages/${notification.relateditemid}`);
      } else {
        // Fallback to home page if we can't determine where to navigate
        navigate('/');
      }
    }
  };
  
  // For follow request notifications, we show accept/reject buttons
  if (notification.type === 'follow_request') {
    return (
      <div className={cn(
        "p-4 border-b border-gray-100 transition-colors",
        !notification.read && "bg-blue-50/30"
      )}>
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <img 
              src={notification.relatedUserAvatar || '/placeholder.svg'} 
              alt={notification.relatedUserName} 
              className="object-cover"
            />
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-1 rounded-full">
                  {getIcon(notification.type)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    <span className="font-semibold">{notification.relatedUserName}</span>
                    {' '}
                    {notification.content}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="h-8"
                      onClick={handleAcceptFollowRequest}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={handleRejectFollowRequest}
                    >
                      Reject
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdat), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              {!notification.read && (
                <div className="h-2 w-2 bg-fusion-accent rounded-full flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For regular notifications
  return (
    <div 
      className={cn(
        "p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer",
        !notification.read && "bg-blue-50/30"
      )}
      onClick={handleClick}
    >
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <img 
            src={notification.relatedUserAvatar || '/placeholder.svg'} 
            alt={notification.relatedUserName} 
            className="object-cover"
          />
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-1 rounded-full">
                {getIcon(notification.type)}
              </div>
              <div>
                <p className="text-sm font-medium">
                  <span className="font-semibold">{notification.relatedUserName}</span>
                  {' '}
                  {notification.content}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDistanceToNow(new Date(notification.createdat), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {!notification.read && (
              <div className="h-2 w-2 bg-fusion-accent rounded-full flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

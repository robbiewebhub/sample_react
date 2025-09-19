
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Notification, NotificationType } from '@/types/notification.types';
import { useAuth } from '@/contexts/AuthContext';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      console.log('Fetching notifications for user:', user.id);
      
      // Fetch notifications from Supabase
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!notifications_relateduserid_fkey(username, full_name, avatar_url)
        `)
        .eq('userid', user.id)
        .order('createdat', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      console.log('Raw notifications data:', data);
      
      const formattedNotifications = data.map(notification => ({
        ...notification,
        relatedUserName: notification.sender?.username || 'Unknown user',
        relatedUserAvatar: notification.sender?.avatar_url,
        // Ensure the type is correctly cast as NotificationType
        type: notification.type as NotificationType
      }));
      
      console.log('Formatted notifications:', formattedNotifications);
      
      // Wait for the follow request check to complete before setting notifications
      const followRequestData = await checkPendingFollowRequests();
      
      // Combine database notifications with follow request notifications, ensuring no duplicates
      const allNotifications = [...formattedNotifications];
      
      if (followRequestData.length > 0) {
        // Filter out follow requests that are already in the notifications
        const existingRequestIds = formattedNotifications
          .filter(n => n.type === 'follow_request')
          .map(n => n.relateduserid);
          
        const newRequests = followRequestData.filter(
          req => !existingRequestIds.includes(req.requester_id)
        );
        
        if (newRequests.length > 0) {
          console.log('Adding follow request notifications:', newRequests);
          
          const newNotifications = newRequests.map(req => {
            const tempId = `temp-${req.id}`;
            return {
              id: tempId,
              userid: user.id,
              type: 'follow_request' as NotificationType,
              content: 'wants to follow you',
              createdat: req.created_at,
              read: false,
              relateduserid: req.requester_id,
              relatedUserName: req.requesterProfile?.username || 'Unknown user',
              relatedUserAvatar: req.requesterProfile?.avatar_url,
              relateditemid: null,
              relateditemtype: null,
              // Add the sender property with the same structure as in database notifications
              sender: {
                username: req.requesterProfile?.username || 'Unknown user',
                full_name: req.requesterProfile?.full_name || '',
                avatar_url: req.requesterProfile?.avatar_url
              }
            };
          });
          
          allNotifications.unshift(...newNotifications);
        }
      }
      
      // Deduplicate notifications by their ID and relatedUserId for follow requests
      const uniqueNotifications = allNotifications.reduce((acc, current) => {
        // For follow requests, check both ID and relatedUserId
        const isDuplicate = acc.some(item => {
          if (item.type === 'follow_request' && current.type === 'follow_request') {
            return item.relateduserid === current.relateduserid;
          }
          return item.id === current.id;
        });
        
        if (!isDuplicate) {
          return [...acc, current];
        }
        return acc;
      }, [] as Notification[]);
      
      setNotifications(uniqueNotifications);
      
      // Count unread notifications
      const unread = uniqueNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error fetching notifications',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Check for pending follow requests and return them with profile info
  const checkPendingFollowRequests = async () => {
    if (!user) return [];
    
    try {
      // Check if there are any pending follow requests for this user
      const { data: followRequests, error } = await supabase
        .from('follow_requests')
        .select('id, requester_id, created_at, status')
        .eq('target_id', user.id)
        .eq('status', 'pending');
        
      if (error) throw error;
      
      console.log('Pending follow requests:', followRequests);
      
      if (!followRequests || followRequests.length === 0) {
        return [];
      }
      
      // Get the requester profile information in a separate query
      const requesterIds = followRequests.map(req => req.requester_id);
      
      const { data: requesterProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', requesterIds);
        
      if (profilesError) throw profilesError;
      
      // Create a map of requester profiles by ID for easy lookup
      const profilesMap = (requesterProfiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);
      
      // Add profile information to each follow request
      return followRequests.map(req => ({
        ...req,
        requesterProfile: profilesMap[req.requester_id] || null
      }));
    } catch (error) {
      console.error('Error checking follow requests:', error);
      return [];
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Only make the API call if it's not a temporary notification
      if (!notificationId.startsWith('temp-')) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId);
          
        if (error) throw error;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('userid', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
    }
  };

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;
    
    fetchNotifications();
    
    console.log('Setting up real-time subscription for notifications');
    
    const notificationsChannel = supabase.channel('notifications_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `userid=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Notification change received:', payload);
          fetchNotifications();
        }
      )
      .subscribe();
      
    // Also set up subscription for follow_requests
    const followRequestsChannel = supabase.channel('follow_requests_channel')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'follow_requests',
          filter: `target_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Follow request change received:', payload);
          fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(followRequestsChannel);
    };
  }, [user, fetchNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };
}

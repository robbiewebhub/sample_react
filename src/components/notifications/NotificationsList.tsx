
import React from 'react';
import NotificationItem from './NotificationItem';
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from 'lucide-react';
import { Notification } from '@/types/notification.types';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const hasUnread = notifications.some(notification => !notification.read);
  
  // Deduplicate notifications for follow requests based on relateduserid
  const uniqueNotifications = React.useMemo(() => {
    const seen = new Map();
    
    return notifications.filter(notification => {
      // For follow requests, deduplicate based on relateduserid
      if (notification.type === 'follow_request') {
        if (seen.has(`follow_request_${notification.relateduserid}`)) {
          return false;
        }
        seen.set(`follow_request_${notification.relateduserid}`, true);
        return true;
      }
      
      // For other notifications, deduplicate based on id
      // For temp IDs, extract the UUID part after 'temp-'
      const idToCheck = notification.id.startsWith('temp-') 
        ? notification.id.split('temp-')[1] 
        : notification.id;
        
      if (seen.has(idToCheck)) {
        return false;
      }
      seen.set(idToCheck, true);
      return true;
    });
  }, [notifications]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Notifications</h2>
        
        {hasUnread && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 text-sm"
            onClick={onMarkAllAsRead}
          >
            <Check className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        ) : uniqueNotifications.length > 0 ? (
          uniqueNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">
              When someone interacts with your posts or profile, you'll see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;

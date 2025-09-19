
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import NotificationsList from '@/components/notifications/NotificationsList';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead,
    fetchNotifications
  } = useNotifications();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Force a refresh when the page is loaded
  useEffect(() => {
    if (user) {
      console.log('Notifications page loaded, refreshing notifications');
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="pt-16 pb-20 min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {(authLoading || !user) ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="pt-6">
              <NotificationsList
                notifications={notifications}
                loading={loading}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

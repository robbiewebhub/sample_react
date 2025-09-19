
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import ConversationList from '@/components/messaging/ConversationList';
import NewConversationButton from '@/components/messaging/NewConversationButton';
import ConversationView from '@/components/messaging/ConversationView';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/hooks/use-messaging';
import { LoadingSpinner } from '@/components/ui/spinner';

const Messages = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user, loading: authLoading } = useAuth();
  const { fetchConversations, loading: messagingLoading } = useMessaging();
  const navigate = useNavigate();

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  const loading = authLoading || messagingLoading;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-5xl mx-auto pt-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-5xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h2 className="text-xl font-bold mb-2">Sign in to see your messages</h2>
            <p className="text-gray-500">
              Please sign in to view and send messages
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-5xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)]">
            {/* Conversations sidebar */}
            <div className={`border-r border-gray-200 w-full md:w-80 flex-shrink-0 ${conversationId ? 'hidden md:block' : 'block'}`}>
              <div className="px-4 py-3 border-b flex justify-between items-center">
                <h1 className="font-semibold text-lg">Messages</h1>
                <NewConversationButton />
              </div>
              <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
                <ConversationList />
              </div>
            </div>
            
            {/* Conversation view */}
            <div className={`flex-1 ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
              {conversationId ? (
                <ConversationView conversationId={conversationId} />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                    <p className="text-gray-500 mb-6">
                      Choose a conversation from the list or start a new one
                    </p>
                    <div className="inline-block">
                      <NewConversationButton />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

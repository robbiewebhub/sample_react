
import { useConversationUtils } from './messaging/use-conversation-utils';
import { useMessages } from './messaging/use-messages';
import { useConversationCreator } from './messaging/use-conversation-creator';

export function useMessaging() {
  const { 
    loading: conversationsLoading,
    conversations, 
    currentConversation,
    setCurrentConversation,
    canMessageUser,
    fetchConversations,
    getConversation
  } = useConversationUtils();

  const {
    loading: messagesLoading,
    messages,
    fetchMessages,
    sendMessage
  } = useMessages();

  const {
    loading: creatorLoading,
    createConversation
  } = useConversationCreator();

  // Combine loading states
  const loading = conversationsLoading || messagesLoading || creatorLoading;

  return {
    loading,
    conversations,
    currentConversation,
    messages,
    canMessageUser,
    fetchConversations,
    createConversation,
    getConversation,
    fetchMessages,
    sendMessage,
  };
}

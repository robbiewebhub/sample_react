
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePostsRealtime(refreshPosts: () => void) {
  useEffect(() => {
    console.log('Setting up realtime subscription for posts');
    
    // Set up a realtime subscription for posts updates
    const postsChannel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
        console.log('Post change detected:', payload);
        // Refresh on any change (insert, update, delete)
        refreshPosts();
      })
      .subscribe();
      
    // Set up a realtime subscription for poll options updates
    const pollOptionsChannel = supabase
      .channel('public:poll_options')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options' }, payload => {
        console.log('Poll option change detected:', payload);
        // Refresh when poll options change
        refreshPosts();
      })
      .subscribe();
      
    // Set up a realtime subscription for poll votes updates
    const pollVotesChannel = supabase
      .channel('public:poll_votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, payload => {
        console.log('Poll vote change detected:', payload);
        // Refresh when poll votes change
        refreshPosts();
      })
      .subscribe();
      
    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(pollOptionsChannel);
      supabase.removeChannel(pollVotesChannel);
    };
  }, [refreshPosts]);
}

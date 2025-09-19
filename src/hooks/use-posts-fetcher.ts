import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Post, POSTS_PER_PAGE } from './use-posts-types';
import { transformPostData } from '@/utils/post-formatters';
import { useFollowedUsers } from './use-followed-users';
import { User } from '@supabase/supabase-js';

// Helper function to check if a URL is a video
const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check common video extensions
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  const lowerCaseUrl = url.toLowerCase();
  
  return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext)) || 
         lowerCaseUrl.includes('video');
};

export function usePostsFetcher(user: User | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastPostTimeRef = useRef<string | null>(null);
  const { toast } = useToast();
  const { followedUsers } = useFollowedUsers();

  // Fetch posts function
  const fetchPosts = useCallback(async (shouldAppend = false) => {
    try {
      if (!shouldAppend) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      console.log('Fetching posts, user:', user?.id, 'shouldAppend:', shouldAppend);
      console.log('Followed users:', followedUsers);
      
      // Build a single optimized query that fetches all necessary data at once
      let query = supabase
        .from('posts')
        .select(`
          id, 
          content, 
          created_at, 
          user_id, 
          media_url, 
          post_type, 
          is_live, 
          is_public,
          original_post_id,
          shared_by_id,
          poll_ends_at,
          profiles:profiles!posts_user_id_fkey (
            id, 
            username, 
            full_name, 
            avatar_url
          ),
          post_likes (
            id,
            user_id
          ),
          post_comments (
            id,
            user_id,
            content,
            created_at,
            profile:profiles (
              username,
              full_name,
              avatar_url
            )
          ),
          post_shares (
            id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(POSTS_PER_PAGE);
      
      // Add pagination if we're appending
      if (shouldAppend && lastPostTimeRef.current) {
        query = query.lt('created_at', lastPostTimeRef.current);
      }

      // Build filter for posts visibility
      if (!user) {
        // Not logged in: only show public posts
        query = query.eq('is_public', true);
      } else if (followedUsers && followedUsers.length > 0) {
        // Logged in with followed users: show public posts, user's posts, and followed users' posts
        query = query.or(`is_public.eq.true,user_id.eq.${user.id},user_id.in.(${followedUsers.join(',')})`);
      } else {
        // Logged in but no followed users: show public posts and user's posts
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
      }
      
      console.log('Executing optimized query...');
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      console.log('Posts fetched:', data?.length || 0, data);
      
      if (!data || data.length === 0) {
        console.log('No posts fetched, hasMore set to false');
        setHasMore(false);
        if (!shouldAppend) {
          setPosts([]);
        }
        setInitialLoading(false);
        setLoadingMore(false);
        return;
      }
      
      // Update the timestamp for pagination
      if (data.length > 0) {
        lastPostTimeRef.current = data[data.length - 1].created_at;
        console.log('Last post time updated:', lastPostTimeRef.current);
      }
      
      // Check if we've reached the end
      if (data.length < POSTS_PER_PAGE) {
        console.log('Less than POSTS_PER_PAGE fetched, hasMore set to false');
        setHasMore(false);
      }
      
      // Process the posts all at once with preloaded data
      const preparedPosts = data.map(post => transformPostData(post, user, isVideoUrl));
      
      // Update the state
      if (shouldAppend) {
        setPosts(prev => [...prev, ...preparedPosts]);
      } else {
        setPosts(preparedPosts);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching posts:', err);
      toast({
        title: "Error loading posts",
        description: "There was a problem loading posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, [user, toast, followedUsers]);

  // Reset and refresh posts
  const refreshPosts = useCallback(() => {
    lastPostTimeRef.current = null;
    setHasMore(true);
    fetchPosts(false);
  }, [fetchPosts]);

  return {
    posts,
    initialLoading,
    loadingMore,
    hasMore,
    fetchPosts,
    refreshPosts
  };
}


import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabContentProps } from '../types';
import { EndOfFeed } from '../EndOfFeed';
import { FeedSkeleton } from '../FeedSkeleton';
import { PostCard } from '@/components/profile/components/PostCard';
import { transformPollToPostCard } from '../utils/postTransformers';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export const VideosTabContent: React.FC<TabContentProps> = ({ 
  loading, 
  postsByType, 
  hasMore, 
  loadingMore, 
  loadMoreRef 
}) => {
  const posts = postsByType.video;
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users the current user follows
  useEffect(() => {
    const fetchFollowedUsers = async () => {
      setIsLoading(true);
      
      try {
        if (!user) {
          setFilteredPosts(posts.filter(post => post.isPublic));
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', user.id);

        if (error) {
          console.error('Error fetching followed users:', error);
          setIsLoading(false);
          return;
        }

        const followedIds = data.map(item => item.following_id);
        console.log('User follows these users:', followedIds);
        setFollowedUsers(followedIds);
      } catch (err) {
        console.error('Error in follow fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedUsers();
  }, [user]);

  // Filter posts to show only public ones or from followed users
  useEffect(() => {
    if (!posts || posts.length === 0) {
      setFilteredPosts([]);
      return;
    }
    
    console.log('Filtering from total posts:', posts.length);
    console.log('Posts before filtering:', posts);
    
    if (!user) {
      // If not logged in, only show public posts
      const publicPosts = posts.filter(post => post.isPublic);
      console.log('Public posts for non-logged in user:', publicPosts.length);
      setFilteredPosts(publicPosts);
    } else {
      // If logged in, show posts that are either:
      // 1. From the current user
      // 2. Public
      // 3. From users the current user follows
      const userViewablePosts = posts.filter(post => 
        post.userId === user.id || 
        post.isPublic || 
        (post.userId && followedUsers.includes(post.userId))
      );
      console.log('Filtered posts for logged in user:', userViewablePosts.length);
      setFilteredPosts(userViewablePosts);
    }
  }, [posts, user, followedUsers]);

  if (loading || isLoading) {
    return <FeedSkeleton type="video" count={4} />;
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No video posts available. Follow more users or check back later!</p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${isMobile ? 'mx-0' : ''}`}>
        {filteredPosts.map(post => (
          <PostCard 
            key={post.id}
            post={transformPollToPostCard(post)}
            showComments={false}
          />
        ))}
      </div>
      <div ref={loadMoreRef}>
        <EndOfFeed hasMore={hasMore} loading={loadingMore} />
      </div>
    </>
  );
};

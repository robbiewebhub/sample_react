
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabContentProps } from '../types';
import { EndOfFeed } from '../EndOfFeed';
import { FeedSkeleton } from '../FeedSkeleton';
import TextPost from '../../TextPost';
import { PostCard } from '../../profile/components/PostCard';
import { transformPollToPostCard } from '../utils/postTransformers';

export const TextTabContent: React.FC<TabContentProps> = ({ 
  loading, 
  postsByType, 
  hasMore, 
  loadingMore, 
  loadMoreRef 
}) => {
  const textPosts = postsByType.text;
  const pollPosts = postsByType.poll;
  const isMobile = useIsMobile();

  if (loading) {
    return <FeedSkeleton type="text" />;
  }

  // Combine text and poll posts, and sort by created_at
  const allPosts = [...textPosts, ...pollPosts].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-12 border-t border-gray-100">
        <p className="text-gray-500">No posts to display. Follow more users or check back later!</p>
      </div>
    );
  }

  // console.log("allpost ",allPosts)

  return (
    <>
      <div className={`divide-y divide-gray-100 border-t border-gray-100 ${isMobile ? 'mx-0 w-full' : ''}`}>
        {allPosts.map(post => {
          if (post.postType === 'poll') {
            // Render poll posts using PostCard
            const postForCard = transformPollToPostCard(post);
            
            return (
              <div key={post.id} className="py-4">
                <PostCard 
                  post={postForCard}
                  isPostPage={false}
                  showComments={false}
                />
              </div>
            );
          } else {
            // Render text posts using TextPost
            return <TextPost key={post.id} {...post} />;
          }
        })}
      </div>
      <div ref={loadMoreRef}>
        <EndOfFeed hasMore={hasMore} loading={loadingMore} />
      </div>
    </>
  );
};

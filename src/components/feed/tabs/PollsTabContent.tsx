
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabContentProps } from '../types';
import { EndOfFeed } from '../EndOfFeed';
import { FeedSkeleton } from '../FeedSkeleton';
import { PostCard } from '../../profile/components/PostCard';
import { transformPollToPostCard } from '../utils/postTransformers';

export const PollsTabContent: React.FC<TabContentProps> = ({ 
  loading, 
  postsByType, 
  hasMore, 
  loadingMore, 
  loadMoreRef 
}) => {
  const posts = postsByType.poll;
  const isMobile = useIsMobile();

  if (loading) {
    return <FeedSkeleton type="text" count={4} />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No polls available. Follow more users or check back later!</p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${isMobile ? 'px-0 w-full' : 'px-4'}`}>
        {posts.map(post => {
          const postForCard = transformPollToPostCard(post);
          
          return (
            <PostCard 
              key={post.id} 
              post={postForCard}
              isPostPage={false}
              showComments={false}
            />
          );
        })}
      </div>
      <div ref={loadMoreRef}>
        <EndOfFeed hasMore={hasMore} loading={loadingMore} />
      </div>
    </>
  );
};

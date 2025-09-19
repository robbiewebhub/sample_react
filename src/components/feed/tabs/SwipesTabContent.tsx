
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabContentProps } from '../types';
import { EndOfFeed } from '../EndOfFeed';
import { FeedSkeleton } from '../FeedSkeleton';
import SwipesPost from '../../SwipesPost';

export const SwipesTabContent: React.FC<TabContentProps> = ({ 
  loading, 
  postsByType, 
  hasMore, 
  loadingMore, 
  loadMoreRef 
}) => {
  const posts = postsByType.swipe;
  const isMobile = useIsMobile();

  if (loading) {
    return <FeedSkeleton type="swipe" count={2} />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No swipes available. Follow more users or check back later!</p>
      </div>
    );
  }

  return (
    <>
      <div className={`flex flex-col items-center ${isMobile ? 'w-full' : ''}`}>
        {posts.map(post => (
          <SwipesPost 
            key={post.id} 
            {...post} 
            videoSrc={post.mediaUrl || ''} 
            description={post.content || ''}
            shares={post.reposts}
          />
        ))}
      </div>
      <div ref={loadMoreRef}>
        <EndOfFeed hasMore={hasMore} loading={loadingMore} />
      </div>
    </>
  );
};

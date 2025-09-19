
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabContentProps } from '../types';
import { EndOfFeed } from '../EndOfFeed';
import { FeedSkeleton } from '../FeedSkeleton';
import LivePost from '../../LivePost';

export const LiveTabContent: React.FC<TabContentProps> = ({ 
  loading, 
  postsByType, 
  hasMore, 
  loadingMore, 
  loadMoreRef 
}) => {
  const posts = postsByType.live;
  const isMobile = useIsMobile();

  if (loading) {
    return <FeedSkeleton type="video" count={4} />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No live streams available. Follow more users or check back later!</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isMobile ? 'mx-0 gap-0' : ''}`}>
        {posts.map(post => (
          <LivePost 
            key={post.id} 
            {...post} 
            title={post.content || 'Live Stream'}
            thumbnailSrc={post.mediaUrl || ''}
            viewers={Math.floor(Math.random() * 1000) + 50}
            shares={post.reposts}
            isLive={post.isLive || true}
          />
        ))}
      </div>
      <div ref={loadMoreRef}>
        <EndOfFeed hasMore={hasMore} loading={loadingMore} />
      </div>
    </>
  );
};


import React from 'react';
import { TabContentProps } from '../types';
import { LoadingSpinner } from '@/components/ui/spinner';
import PostsList from '@/components/profile/components/PostsList';
import { transformPollToPostCard } from '../utils/postTransformers';

export const ImageTabContent: React.FC<TabContentProps> = ({ 
  loading, 
  postsByType, 
  hasMore,
  loadingMore,
  loadMoreRef
}) => {
  if (loading) {
    return <div className="flex justify-center py-6"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-4">
      <PostsList 
        posts={postsByType.video.map(transformPollToPostCard)} 
        emptyText="No image posts yet. Be the first to post an image!"
      />
      
      {loadingMore && (
        <div className="py-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
      
      {hasMore && !loadingMore && (
        <div ref={loadMoreRef} className="h-10" />
      )}
    </div>
  );
};

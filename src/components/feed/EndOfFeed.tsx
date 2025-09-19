
import React from 'react';
import { LoadingSpinner } from '@/components/ui/spinner';

interface EndOfFeedProps {
  hasMore: boolean;
  loading: boolean;
}

export const EndOfFeed: React.FC<EndOfFeedProps> = ({ hasMore, loading }) => {
  return (
    <div className="text-center py-6">
      {hasMore ? (
        loading ? (
          <LoadingSpinner />
        ) : (
          <p className="text-gray-500 text-sm">Scroll to load more posts</p>
        )
      ) : (
        <p className="text-gray-500 text-sm">No more posts to display</p>
      )}
    </div>
  );
};

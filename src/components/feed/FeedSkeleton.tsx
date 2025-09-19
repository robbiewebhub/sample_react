
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface FeedSkeletonProps {
  type?: 'text' | 'video' | 'swipe';
  count?: number;
}

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ 
  type = 'text', 
  count = 3 
}) => {
  if (type === 'text') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (type === 'swipe') {
    return (
      <div className="flex flex-col items-center space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-[70vh] w-full max-w-md rounded-lg" />
        ))}
      </div>
    );
  }

  return null;
};


import { Post, PostsByType } from '@/hooks/use-posts';
import { PostWithStats } from '../profile/types/post.types';
import React from 'react';

export interface TabContentProps {
  loading: boolean;
  postsByType: PostsByType;
  hasMore: boolean;
  loadingMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

export interface PostTransformer {
  transformToPostCard: (post: Post) => PostWithStats;
}

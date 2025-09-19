
import { Post } from '@/hooks/use-posts';
import { PostWithStats } from '../../profile/types/post.types';

export const transformPollToPostCard = (post: Post): PostWithStats => {
  return {
    id: post.id,
    user_id: post.id || '',
    post_type: post.postType === 'video' ? 'video' : post.postType === 'poll' ? 'poll' : 'text',
    content: post.content || '',
    created_at: post.created_at,
    updated_at: post.created_at,
    likes_count: post.likes,
    comments_count: post.comments,
    shares_count: post.reposts || 0,
    is_liked: post.isLiked || false,
    // Use optional chaining to safely access comments_data if it exists
    comments_data: (post as any).comments_data || [],
    is_public: true,
    media_url: post.mediaUrl || null,
    poll_ends_at: post.poll_ends_at, // Add poll end time
    profile: {
      id: post.id,
      username: post.handle || '',
      full_name: post.username || '',
      avatar_url: post.avatar || ''
    }
  };
};

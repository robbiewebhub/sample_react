
/**
 * Helper functions for formatting post data
 */

// Helper function to format timestamps
export function formatTimestamp(timestamp: string): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString();
}

// Helper function to transform raw post data into Post objects
export function transformPostData(post: any, user: any, isVideoUrl: (url: string) => boolean) {
  // Get counts directly from the nested arrays
  const likesCount = post.post_likes ? post.post_likes.length : 0;
  const commentsCount = post.post_comments ? post.post_comments.length : 0;
  const sharesCount = post.post_shares ? post.post_shares.length : 0;
  
  // Check if current user has liked the post
  let isLiked = false;
  if (user && post.post_likes) {
    isLiked = post.post_likes.some((like: any) => like.user_id === user.id);
  }
  
  // Format comments if available
  const comments = post.post_comments ? post.post_comments.map((comment: any) => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    user_id: comment.user_id,
    post_id: post.id,
    profile: comment.profile,
    likes_count: 0, // We'll need to enhance this in the future if needed
    replies_count: 0,
    is_liked: false,
    replies: [],
    children: []
  })) : [];
  
  // Determine post type for display in tabs
  // Make sure video URLs are properly categorized as video posts
  let postType = post.post_type || 'text';
  if (post.media_url && isVideoUrl(post.media_url) && postType === 'text') {
    postType = 'video';
  }
  
  return {
    id: post.id,
    username: post.profiles?.username || post.profiles?.full_name || 'Unknown User',
    handle: post.profiles?.username || 'unknown',
    content: post.content || '',
    timestamp: formatTimestamp(post.created_at),
    created_at: post.created_at,
    avatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    likes: likesCount,
    comments: commentsCount,
    reposts: sharesCount,
    isLiked,
    mediaUrl: post.media_url,
    postType: postType,
    isLive: post.is_live,
    poll_ends_at: post.poll_ends_at,
    comments_data: comments, // Add the formatted comments
    isPublic: post.is_public, // Add the is_public flag
    userId: post.user_id // Add the user_id
  };
}

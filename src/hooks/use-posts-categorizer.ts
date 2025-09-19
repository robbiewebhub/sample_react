
import { Post, PostsByType } from './use-posts-types';

export function usePostsCategorizer(posts: Post[]) {
  // Group posts by type
  const postsByType = posts.reduce((acc, post) => {
    if (post.postType === 'text') {
      acc.text.push(post);
    } else if (post.postType === 'video') {
      acc.video.push(post);
    } else if (post.postType === 'swipe') {
      acc.swipe.push(post);
    } else if (post.postType === 'live' || post.isLive) {
      acc.live.push(post);
    } else if (post.postType === 'poll') {
      acc.poll.push(post);
    }
    return acc;
  }, { 
    text: [] as Post[], 
    video: [] as Post[], 
    swipe: [] as Post[], 
    live: [] as Post[], 
    poll: [] as Post[] 
  });

  return postsByType;
}

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CreatePost from './CreatePost';
import { FeedTabs } from './feed/FeedTabs';
import { TextTabContent, VideosTabContent, SwipesTabContent, LiveTabContent, PollsTabContent } from './feed/tabs';
import { usePosts } from '@/hooks/use-posts';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { usePostsRealtime } from '@/hooks/use-posts-realtime';
import { useIsMobile } from '@/hooks/use-mobile';

const Feed = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("text");
  const { 
    postsByType,
    initialLoading,
    loadingMore,
    hasMore,
    fetchPosts,
    refreshPosts
  } = usePosts();
  
  const { loadMoreRef } = useInfiniteScroll({
    loadMore: () => fetchPosts(true),
    hasMore,
    loading: loadingMore,
    initialLoading
  });
  
  usePostsRealtime(refreshPosts);

  useEffect(() => {
    console.log('Feed component mounted, fetching posts...');
    fetchPosts(false);
    
    return () => {
      console.log('Feed component unmounting, cleaning up...');
    };
  }, [fetchPosts]);

  return (
    <div className={`w-full max-w-3xl mx-auto ${isMobile ? 'max-w-full p-0' : 'p-4'}`}>
      <Tabs 
        defaultValue="text" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className={`${isMobile ? 'w-full' : ''}`}>
          <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
        
        {activeTab === "text" && (
          <div className={`mt-4 ${isMobile ? 'px-4 w-full' : 'px-4'}`}>
            <CreatePost />
          </div>
        )}
        
        <TabsContent 
          value="text" 
          className={`mt-0 focus-visible:outline-none focus-visible:ring-0 ${isMobile ? 'px-0 w-full' : ''}`}
        >
          <TextTabContent 
            loading={initialLoading}
            postsByType={postsByType}
            hasMore={hasMore}
            loadingMore={loadingMore}
            loadMoreRef={loadMoreRef}
          />
        </TabsContent>

        <TabsContent 
          value="polls" 
          className={`mt-0 focus-visible:outline-none focus-visible:ring-0 ${isMobile ? 'px-0 w-full' : ''}`}
        >
          <PollsTabContent
            loading={initialLoading}
            postsByType={postsByType}
            hasMore={hasMore}
            loadingMore={loadingMore}
            loadMoreRef={loadMoreRef}
          />
        </TabsContent>
        
        <TabsContent 
          value="videos" 
          className={`mt-0 focus-visible:outline-none focus-visible:ring-0 ${isMobile ? 'px-0 w-full' : ''}`}
        >
          <VideosTabContent
            loading={initialLoading}
            postsByType={postsByType}
            hasMore={hasMore}
            loadingMore={loadingMore}
            loadMoreRef={loadMoreRef}
          />
        </TabsContent>
        
        <TabsContent 
          value="swipes" 
          className={`mt-0 focus-visible:outline-none focus-visible:ring-0 ${isMobile ? 'px-0 w-full' : ''}`}
        >
          <SwipesTabContent
            loading={initialLoading}
            postsByType={postsByType}
            hasMore={hasMore}
            loadingMore={loadingMore}
            loadMoreRef={loadMoreRef}
          />
        </TabsContent>
        
        <TabsContent 
          value="live" 
          className={`mt-0 focus-visible:outline-none focus-visible:ring-0 ${isMobile ? 'px-0 w-full' : ''}`}
        >
          <LiveTabContent
            loading={initialLoading}
            postsByType={postsByType}
            hasMore={hasMore}
            loadingMore={loadingMore}
            loadMoreRef={loadMoreRef}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;

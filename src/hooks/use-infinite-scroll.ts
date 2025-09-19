
import { useEffect, useRef } from 'react';

export function useInfiniteScroll({
  loadMore,
  hasMore,
  loading,
  initialLoading
}: {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  initialLoading: boolean;
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && !initialLoading) {
        console.log('Intersection observed, loading more content');
        loadMore();
      }
    };

    const observer = new IntersectionObserver(observerCallback, options);
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading, initialLoading]);

  return { loadMoreRef };
}

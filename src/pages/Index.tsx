
import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';
import Footer from '@/components/Footer';

// Lazy load components to improve initial page load
const Feed = lazy(() => import('@/components/Feed'));
const Trending = lazy(() => import('@/components/Trending'));

const Index = () => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  
  // Log render events for debugging
  useEffect(() => {
    console.log('Index page rendering, auth state:', { user: !!user, loading });
  }, [user, loading]);
  
  // If not loading and no user, redirect to auth page
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="pt-16 pb-20 min-h-screen">
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-0 max-w-none w-full' : 'px-4 sm:px-6 lg:px-8'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className={`flex flex-col md:flex-row md:space-x-6 ${isMobile ? 'w-full' : 'pt-6'}`}>
              {/* Main Feed */}
              <div className={`${isMobile ? 'w-full' : 'w-full md:w-3/4'}`}>
                <Suspense fallback={<div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>}>
                  <Feed />
                </Suspense>
              </div>
              
              {/* Right Sidebar - Hidden on mobile */}
              {!isMobile && (
                <div className="hidden md:block md:w-1/4 sticky top-24 self-start flex flex-col h-[calc(100vh-6rem)] overflow-y-auto">
                  <Suspense fallback={<div className="p-4 border rounded-lg bg-white"><LoadingSpinner /></div>}>
                    <Trending />
                  </Suspense>
                  <Footer className="mt-auto py-4" />
                </div>
              )}
            </div>
          )}
          
          {/* Mobile Footer - Only visible on mobile */}
          {isMobile && (
            <div className="block md:hidden mt-8 px-4">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

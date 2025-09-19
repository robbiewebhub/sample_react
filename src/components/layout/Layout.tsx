
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16 pb-16">
        {children}
      </main>
      {showFooter && isMobile && (
        <div className="mt-6 px-4 pb-6 md:hidden">
          <Footer />
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText, PlayCircle, Layers, Video } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface FeedTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onChange }) => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList 
      className={`grid grid-cols-4 h-auto p-0 bg-gray-50 rounded-none border-b ${isMobile ? 'w-full' : ''}`}
    >
      <TabsTrigger 
        value="text" 
        className={`flex items-center justify-center py-3 px-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-fusion-primary rounded-none data-[state=active]:shadow-none ${isMobile ? 'flex-col space-y-1' : 'space-x-2'}`}
        onClick={() => onChange("text")}
      >
        <MessageSquareText className="h-4 w-4" />
        {!isMobile && <span>Happening</span>}
      </TabsTrigger>
      <TabsTrigger 
        value="videos" 
        className={`flex items-center justify-center py-3 px-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-fusion-primary rounded-none data-[state=active]:shadow-none ${isMobile ? 'flex-col space-y-1' : 'space-x-2'}`}
        onClick={() => onChange("videos")}
      >
        <PlayCircle className="h-4 w-4" />
        {!isMobile && <span>Videos</span>}
      </TabsTrigger>
      <TabsTrigger 
        value="swipes" 
        className={`flex items-center justify-center py-3 px-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-fusion-primary rounded-none data-[state=active]:shadow-none ${isMobile ? 'flex-col space-y-1' : 'space-x-2'}`}
        onClick={() => onChange("swipes")}
      >
        <Layers className="h-4 w-4" />
        {!isMobile && <span>Swipes</span>}
      </TabsTrigger>
      <TabsTrigger 
        value="live" 
        className={`flex items-center justify-center py-3 px-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-fusion-primary rounded-none data-[state=active]:shadow-none ${isMobile ? 'flex-col space-y-1' : 'space-x-2'}`}
        onClick={() => onChange("live")}
      >
        <Video className="h-4 w-4" />
        {!isMobile && <span>Live</span>}
      </TabsTrigger>
    </TabsList>
  );
};

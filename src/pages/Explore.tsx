
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Globe, Video, Music, Film, Coffee, Utensils, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ForYouPage from '@/components/ForYouPage';

const categories = [
  { id: "1", name: "Tendencias", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "2", name: "Noticias", icon: <Globe className="h-4 w-4" /> },
  { id: "3", name: "Videos", icon: <Video className="h-4 w-4" /> },
  { id: "4", name: "Música", icon: <Music className="h-4 w-4" /> },
  { id: "5", name: "Cine", icon: <Film className="h-4 w-4" /> },
  { id: "6", name: "Arte", icon: <Coffee className="h-4 w-4" /> },
  { id: "7", name: "Gastronomía", icon: <Utensils className="h-4 w-4" /> },
  { id: "8", name: "Gaming", icon: <Gamepad2 className="h-4 w-4" /> }
];

// Trending hashtags
const trendingHashtags = [
  { id: "1", tag: "#LatinMusicAwards", posts: "89.3K" },
  { id: "2", tag: "#EmprendedoresLatinos", posts: "45.2K" },
  { id: "3", tag: "#TechLatam", posts: "32.7K" },
  { id: "4", tag: "#GastronomiaLatina", posts: "28.1K" },
  { id: "5", tag: "#FutbolSudamericano", posts: "67.5K" },
  { id: "6", tag: "#CulturaLatina", posts: "21.6K" },
  { id: "7", tag: "#FestivalDeCine", posts: "18.3K" },
  { id: "8", tag: "#ModaLatina", posts: "14.9K" }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="pt-16 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Search */}
            <div className="relative mb-6 max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar en Fusión..."
                className="pl-10 py-6 rounded-full border-gray-300 focus-visible:ring-fusion-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Categories */}
            <div className="mb-8 overflow-x-auto pb-2">
              <div className="flex space-x-2 min-w-max">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="rounded-full border-gray-300 hover:border-fusion-primary hover:text-fusion-primary"
                  >
                    {category.icon}
                    <span className="ml-1">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="foryou" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
                <TabsTrigger value="foryou" className="data-[state=active]:bg-fusion-primary data-[state=active]:text-white">
                  Para ti
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-fusion-primary data-[state=active]:text-white">
                  Tendencias
                </TabsTrigger>
                <TabsTrigger value="hashtags" className="data-[state=active]:bg-fusion-primary data-[state=active]:text-white">
                  Hashtags
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="foryou" className="focus-visible:outline-none focus-visible:ring-0">
                <ForYouPage />
              </TabsContent>
              
              <TabsContent value="trending" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden card-hover border-none shadow-sm animate-fade-in">
                      <div className="aspect-video bg-gray-100 relative">
                        <img 
                          src={`https://images.unsplash.com/photo-15${1500000000 + index * 10000000}`} 
                          alt="Trending" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <Badge className="bg-fusion-primary/90 hover:bg-fusion-primary">Trending #{index + 1}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2 mb-2">
                          {index % 3 === 0 ? "El futuro de la tecnología en Latinoamérica" : 
                           index % 3 === 1 ? "Nuevas tendencias gastronómicas en México" :
                           "La música urbana que está revolucionando la industria"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 100)}K vistas · {Math.floor(Math.random() * 24)}h
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="hashtags" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="max-w-3xl mx-auto">
                  <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Hashtags populares</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trendingHashtags.map(hashtag => (
                          <Button
                            key={hashtag.id}
                            variant="ghost"
                            className="h-auto py-4 px-6 justify-start rounded-lg hover:bg-gray-50 border border-gray-100"
                          >
                            <div className="text-left">
                              <p className="font-semibold text-lg">{hashtag.tag}</p>
                              <p className="text-sm text-gray-500">{hashtag.posts} publicaciones</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

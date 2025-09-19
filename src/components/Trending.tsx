
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Star, UserPlus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { useTrendingHashtags } from '@/hooks/use-trending-hashtags';
import { useUserRecommendations } from '@/hooks/use-user-recommendations';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/use-profile';

const Trending = () => {
  const { trendingHashtags, loading: loadingHashtags } = useTrendingHashtags();
  const { recommendations, loading: loadingRecommendations } = useUserRecommendations();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Create dummy trending hashtags if none are available
  const displayHashtags = trendingHashtags.length > 0 ? trendingHashtags : [
    {
      hashtag: "LatinGrammy",
      count: 45200,
      category: "Trending in Latin America"
    },
    {
      hashtag: "BadBunny",
      count: 67300,
      category: "Entertainment"
    },
    {
      hashtag: "Elecciones2023",
      count: 32100,
      category: "Politics"
    },
    {
      hashtag: "CopaLibertadores",
      count: 28900,
      category: "Sports"
    },
    {
      hashtag: "StartupsLatinas",
      count: 15600,
      category: "Business"
    }
  ];
  
  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Handle follow action
  const handleFollow = async (userId: string, username: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para seguir a usuarios",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('followers')
        .insert([
          { follower_id: user.id, following_id: userId }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "¡Siguiendo!",
        description: `Ahora estás siguiendo a @${username}`,
      });
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Error",
        description: "No se pudo seguir al usuario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Trending Topics */}
      <Card className="border-none shadow-sm bg-gray-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Tendencias para ti</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          {loadingHashtags ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="default" />
            </div>
          ) : (
            <div className="space-y-0.5">
              {displayHashtags.map((topic, index) => (
                <Button 
                  key={index} 
                  variant="ghost"
                  className="w-full justify-start rounded-md p-3 h-auto text-left hover:bg-gray-100"
                >
                  <div className="flex justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-500">{topic.category}</p>
                      <p className="font-semibold">#{topic.hashtag}</p>
                      <p className="text-xs text-gray-500">{formatCount(topic.count)} posts</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-500">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </Button>
              ))}
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-fusion-primary mt-2 hover:bg-fusion-primary/5 rounded-md"
          >
            Mostrar más
          </Button>
        </CardContent>
      </Card>
      
      {/* Who to follow */}
      <Card className="border-none shadow-sm bg-gray-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">A quién seguir</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          {loadingRecommendations ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="default" />
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-1">
              {recommendations.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.avatar} 
                        alt={user.name} 
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="font-semibold text-sm">{user.name}</p>
                        {user.verified && (
                          <Star className="ml-1 h-3 w-3 text-yellow-400 fill-yellow-400" />
                        )}
                        {user.is_active && (
                          <span className="ml-1 text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                            Activo
                          </span>
                        )}
                        {user.followers_count && user.followers_count > 1000 && (
                          <span className="ml-1 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            Trending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">@{user.handle}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFollow(user.id, user.handle)}
                    className="h-8 rounded-full border-gray-300 hover:border-fusion-primary hover:text-fusion-primary text-sm font-medium"
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                    Seguir
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <p>No hay sugerencias disponibles en este momento.</p>
            </div>
          )}
          {recommendations.length > 0 && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-fusion-primary mt-2 hover:bg-fusion-primary/5 rounded-md"
            >
              Mostrar más
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Trending;

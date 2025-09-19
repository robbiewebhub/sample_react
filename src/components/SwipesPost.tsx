import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  VolumeX,
  Volume2,
  Play,
  Pause,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipesPostProps {
  id: string;
  username: string;
  handle: string;
  description: string;
  videoSrc: string;
  avatar: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

const SwipesPost: React.FC<SwipesPostProps> = ({
  id,
  username,
  handle,
  description,
  videoSrc,
  avatar,
  likes,
  comments,
  shares,
  isLiked = false
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const speedUpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      
      const heart = document.getElementById(`swipe-heart-${id}`);
      if (heart) {
        heart.classList.add('scale-150');
        setTimeout(() => {
          heart.classList.remove('scale-150');
        }, 300);
      }
    }
    setLiked(!liked);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTouchStart = () => {
    if (videoRef.current && playing) {
      speedUpTimeoutRef.current = setTimeout(() => {
        videoRef.current!.playbackRate = 1.5;
        setIsSpeedUp(true);
      }, 300);
    }
  };

  const handleTouchEnd = () => {
    if (speedUpTimeoutRef.current) {
      clearTimeout(speedUpTimeoutRef.current);
      speedUpTimeoutRef.current = null;
    }
    
    if (videoRef.current && isSpeedUp) {
      videoRef.current.playbackRate = 1.0;
      setIsSpeedUp(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Play prevented:", e));
            setPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setPlaying(false);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => {
      if (observerRef.current && videoRef.current) {
        observerRef.current.unobserve(videoRef.current);
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnd = () => {
      setPlaying(false);
      video.currentTime = 0;
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnd);
      
      if (speedUpTimeoutRef.current) {
        clearTimeout(speedUpTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md h-[80vh] mb-6 relative rounded-xl overflow-hidden shadow-md">
      <video 
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        onClick={togglePlay}
      />
      
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity",
          playing ? "opacity-0" : "opacity-100"
        )}
        onClick={togglePlay}
      >
        {!playing && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-20 w-20 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
          >
            <Play className="h-10 w-10" />
          </Button>
        )}
      </div>
      
      <div 
        className="absolute bottom-0 right-0 w-20 h-20 cursor-pointer z-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {isSpeedUp && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
            1.5x
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
          onClick={toggleMute}
        >
          {muted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 right-16 flex flex-col text-white">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border-2 border-white">
            <img src={avatar} alt={username} className="object-cover" />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{username}</span>
            <span className="text-xs">@{handle}</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm font-medium drop-shadow-md">{description}</p>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm transition-transform duration-300",
              liked ? "text-red-500" : "text-white hover:bg-black/40"
            )}
            onClick={handleLike}
          >
            <div id={`swipe-heart-${id}`} className="transition-transform duration-300">
              <Heart 
                className="h-6 w-6" 
                fill={liked ? "currentColor" : "none"} 
              />
            </div>
          </Button>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">{likeCount}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">{comments}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
          >
            <Share className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">{shares}</span>
        </div>
      </div>
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm mb-1"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SwipesPost;

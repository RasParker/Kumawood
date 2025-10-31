import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bookmark, List, Send, ChevronRight, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Episode, Series } from '@shared/schema';

interface HookPlayerProps {
  episode: Episode;
  series: Series;
  userId: string;
  onNavigateToPlayer: (seriesId: string, episodeNumber: number, startTime: number) => void;
  onNavigateToSearch: () => void;
}

export default function HookPlayer({
  episode,
  series,
  userId,
  onNavigateToPlayer,
  onNavigateToSearch,
}: HookPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const { data: followingData } = useQuery({
    queryKey: ['/api/user-following', userId, series.id],
    enabled: !!userId && !!series.id,
  });

  useEffect(() => {
    if (followingData) {
      setIsLiked((followingData as { isFollowing: boolean }).isFollowing);
    }
  }, [followingData]);

  const addFollowingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/user-following', {
        userId,
        seriesId: series.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-following', userId, series.id] });
    },
  });

  const removeFollowingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/user-following/${userId}/${series.id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-following', userId, series.id] });
    },
  });

  const handleLike = () => {
    if (isLiked) {
      removeFollowingMutation.mutate();
      setIsLiked(false);
      toast({
        title: 'Removed from favorites',
        duration: 2000,
      });
    } else {
      addFollowingMutation.mutate();
      setIsLiked(true);
      toast({
        title: 'Added to favorites',
        duration: 2000,
      });
    }
  };

  const handleManualInvest = () => {
    const currentTime = videoRef.current?.currentTime || 0;
    onNavigateToPlayer(series.id, 1, currentTime);
  };

  const handleVideoEnded = () => {
    onNavigateToPlayer(series.id, 2, 0);
  };

  const handleShare = () => {
    toast({
      title: 'Share link copied!',
      description: 'Series link has been copied to clipboard',
      duration: 2000,
    });
  };

  const { data: allEpisodes = [] } = useQuery<Episode[]>({
    queryKey: ['/api/series', series.id, 'episodes'],
    enabled: !!series.id,
  });

  const totalEpisodes = allEpisodes.length || 80;

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={episode.videoUrl}
        autoPlay
        loop={false}
        playsInline
        muted
        onEnded={handleVideoEnded}
        data-testid="hook-video-player"
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-4 bottom-56 flex flex-col gap-6 pointer-events-auto items-center">
          <div className="flex flex-col items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              data-testid="button-like-hook"
              className={`rounded-full p-2 ${
                isLiked 
                  ? 'text-primary' 
                  : 'text-white'
              }`}
            >
              <Bookmark className="h-9 w-9" fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </Button>
            <span className="text-white text-xs font-medium">My List</span>
          </div>
          
          <div className="flex flex-col items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleManualInvest}
              data-testid="button-episodes-hook"
              className="text-white rounded-full p-2"
            >
              <List className="h-9 w-9" strokeWidth={1.5} />
            </Button>
            <span className="text-white text-xs font-medium">Episodes</span>
          </div>
          
          <div className="flex flex-col items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShare}
              data-testid="button-share-hook"
              className="text-white rounded-full p-2"
            >
              <Send className="h-9 w-9" strokeWidth={1.5} />
            </Button>
            <span className="text-white text-xs font-medium">Share</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
          <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12 pb-24">
            <div className="px-4 mb-4">
              <h2 className="text-white font-bold text-xl line-clamp-1 mb-2">
                {series.title}
              </h2>
              <p className="text-white/90 text-sm line-clamp-2">
                {series.synopsis}
              </p>
            </div>

            <button
              onClick={handleManualInvest}
              data-testid="button-manual-invest"
              className="w-full bg-black/50 backdrop-blur-sm border-t border-b border-white/20 p-4 flex items-center justify-between hover:bg-black/60 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 pl-4">
                <div className="w-10 h-10 rounded bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Film className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-semibold text-sm">
                  EP.1 / EP.{totalEpisodes}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-white mr-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  Pause, 
  Play, 
  Bookmark, 
  Redo, 
  MoreVertical,
  ListVideo,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import EpisodeSheet from '@/components/EpisodeSheet';
import SpeedSelectionSheet from '@/components/SpeedSelectionSheet';
import PlaybackSettingsSheet from '@/components/PlaybackSettingsSheet';
import { apiRequest } from '@/lib/queryClient';
import type { Episode, Series, User } from '@shared/schema';

interface PlayerScreenProps {
  seriesId: string;
  episodeNumber: number;
  playerStartTime?: number;
  onNavigateHome: () => void;
  onNavigateToPlayer: (seriesId: string, episodeNumber: number, startTime?: number) => void;
}

export default function PlayerScreen({
  seriesId,
  episodeNumber,
  playerStartTime = 0,
  onNavigateHome,
  onNavigateToPlayer,
}: PlayerScreenProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideOverlaysTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  
  const [showEpisodeSheet, setShowEpisodeSheet] = useState(false);
  const [showSpeedSheet, setShowSpeedSheet] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);

  const userId = 'demo-user-id';

  const { data: episode, isLoading: episodeLoading } = useQuery<Episode>({
    queryKey: ['/api/series', seriesId, 'episodes', episodeNumber],
    enabled: !!seriesId && !!episodeNumber,
  });

  const { data: series } = useQuery<Series>({
    queryKey: ['/api/series', seriesId],
    enabled: !!seriesId,
  });

  const { data: episodes = [] } = useQuery<Episode[]>({
    queryKey: ['/api/series', seriesId, 'episodes'],
    enabled: !!seriesId,
  });

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  const saveWatchHistoryMutation = useMutation({
    mutationFn: async (timestamp: number) => {
      if (!episode) return;
      return apiRequest('POST', '/api/watch-history', {
        userId,
        seriesId,
        episodeId: episode.id,
        lastWatchedTimestamp: timestamp,
      });
    },
  });

  useEffect(() => {
    if (user?.autoplayPreference !== undefined) {
      setAutoplayEnabled(user.autoplayPreference);
    }
  }, [user]);

  useEffect(() => {
    if (videoRef.current && episode?.videoUrl) {
      videoRef.current.src = episode.videoUrl;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [episode, playbackSpeed]);

  useEffect(() => {
    resetOverlayTimer();
    return () => {
      if (hideOverlaysTimeoutRef.current) {
        clearTimeout(hideOverlaysTimeoutRef.current);
      }
    };
  }, []);

  const resetOverlayTimer = () => {
    if (hideOverlaysTimeoutRef.current) {
      clearTimeout(hideOverlaysTimeoutRef.current);
    }
    setShowOverlays(true);
    hideOverlaysTimeoutRef.current = setTimeout(() => {
      setShowOverlays(false);
    }, 3000);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.currentTime = playerStartTime;
      setCurrentTime(playerStartTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      if (time - lastSaveTimeRef.current >= 15) {
        saveWatchHistoryMutation.mutate(time);
        lastSaveTimeRef.current = time;
      }
    }
  };

  const handleEnded = () => {
    if (autoplayEnabled && episodes.length > 0) {
      const nextEpisode = episodes.find(ep => ep.episodeNumber === episodeNumber + 1);
      if (nextEpisode) {
        onNavigateToPlayer(seriesId, episodeNumber + 1, 0);
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    resetOverlayTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;
    const newTime = (clickX / bounds.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleAutoplayToggle = (enabled: boolean) => {
    setAutoplayEnabled(enabled);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Removed from favorites' : 'Added to favorites',
      duration: 2000,
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share link copied!',
      description: 'Episode link has been copied to clipboard',
      duration: 2000,
    });
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const saveCount = series ? Math.floor((series.viewCount || 0) * 0.23) : 0;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (episodeLoading || !episode) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading episode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        autoPlay
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={handleVideoClick}
        data-testid="video-player"
      />

      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          showOverlays ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={onNavigateHome}
                data-testid="button-back"
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <p className="text-white text-sm font-semibold">
                EP{episodeNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSpeedSheet(true)}
                data-testid="button-speed"
                className="text-white hover:bg-white/20"
              >
                <Gauge className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSettingsSheet(true)}
                data-testid="button-more"
                className="text-white hover:bg-white/20"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            data-testid="button-play-pause"
            className="h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/40 pointer-events-auto"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" fill="white" />
            ) : (
              <Play className="h-8 w-8 text-white" fill="white" />
            )}
          </Button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              data-testid="button-like"
              className={`rounded-full p-2 ${
                isLiked 
                  ? 'text-primary' 
                  : 'text-white'
              }`}
            >
              <Bookmark className="h-9 w-9" fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </Button>
            <span className="text-white text-xs font-semibold">{formatCount(saveCount)}</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowEpisodeSheet(true)}
              data-testid="button-episodes"
              className="text-white rounded-full p-2"
            >
              <ListVideo className="h-9 w-9" strokeWidth={1.5} />
            </Button>
            <span className="text-white text-xs font-medium">Episodes</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShare}
              data-testid="button-share"
              className="text-white rounded-full p-2"
            >
              <Redo className="h-9 w-9" strokeWidth={1.5} />
            </Button>
            <span className="text-white text-xs font-medium">Share</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div 
            className="h-1 bg-white/30 mx-4 mb-2 rounded-full cursor-pointer group"
            onClick={handleSeek}
            data-testid="seekbar"
          >
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative group-hover:h-1.5 transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div 
            className="bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-8 cursor-pointer"
            onClick={() => setShowEpisodeSheet(true)}
            data-testid="bottom-title"
          >
            <h2 className="text-white font-bold text-lg line-clamp-1">
              {series?.title || 'Loading...'}
            </h2>
            <p className="text-white/80 text-sm line-clamp-2 mt-1">
              {episode.title}
            </p>
          </div>
        </div>
      </div>

      <EpisodeSheet
        open={showEpisodeSheet}
        onOpenChange={setShowEpisodeSheet}
        series={series || null}
        episodes={episodes}
        currentEpisodeNumber={episodeNumber}
        onEpisodeSelect={(ep) => onNavigateToPlayer(seriesId, ep, 0)}
      />

      <SpeedSelectionSheet
        open={showSpeedSheet}
        onOpenChange={setShowSpeedSheet}
        currentSpeed={playbackSpeed}
        onSpeedSelect={handleSpeedSelect}
      />

      <PlaybackSettingsSheet
        open={showSettingsSheet}
        onOpenChange={setShowSettingsSheet}
        autoplayEnabled={autoplayEnabled}
        onAutoplayToggle={handleAutoplayToggle}
      />
    </div>
  );
}

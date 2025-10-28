import { ChevronLeft, ChevronRight, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerScreenProps {
  seriesId: string;
  episodeNumber: number;
  onNavigateHome: () => void;
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
}

export default function PlayerScreen({
  seriesId,
  episodeNumber,
  onNavigateHome,
  onNavigateToPlayer,
}: PlayerScreenProps) {
  const totalEpisodes = 120;
  const canGoPrevious = episodeNumber > 1;
  const canGoNext = episodeNumber < totalEpisodes;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Video Player Area */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground text-sm">Video Player Area</div>
            <div className="text-foreground font-semibold">
              Episode {episodeNumber} of {totalEpisodes}
            </div>
            <Play className="h-16 w-16 text-primary mx-auto" />
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <Button
            size="icon"
            variant="ghost"
            onClick={onNavigateHome}
            data-testid="button-back"
            className="text-foreground hover-elevate active-elevate-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-primary to-accent" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6">
            <Button
              size="icon"
              variant="ghost"
              disabled={!canGoPrevious}
              onClick={() => canGoPrevious && onNavigateToPlayer(seriesId, episodeNumber - 1)}
              data-testid="button-previous-episode"
              className="text-foreground hover-elevate active-elevate-2"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
              data-testid="button-play-pause"
            >
              <Play className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              disabled={!canGoNext}
              onClick={() => canGoNext && onNavigateToPlayer(seriesId, episodeNumber + 1)}
              data-testid="button-next-episode"
              className="text-foreground hover-elevate active-elevate-2"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Episode Navigation */}
      <div className="bg-background border-t border-border p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Episodes</h3>
          <span className="text-xs text-muted-foreground">
            {episodeNumber} / {totalEpisodes}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(10)].map((_, i) => {
            const ep = episodeNumber - 5 + i;
            if (ep < 1 || ep > totalEpisodes) return null;
            const isActive = ep === episodeNumber;
            return (
              <button
                key={ep}
                onClick={() => onNavigateToPlayer(seriesId, ep)}
                data-testid={`button-episode-${ep}`}
                className={`flex-shrink-0 w-12 h-12 rounded-lg font-semibold text-sm transition-all hover-elevate active-elevate-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                    : 'bg-card text-foreground'
                }`}
              >
                {ep}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Play, Calendar, Star } from 'lucide-react';
import { newSeries } from '@/data/mockData';

interface NewTabComponentProps {
  navigateToPlayer: (seriesId: string, episodeNumber: number, startTime: number) => void;
}

export default function NewTabComponent({ navigateToPlayer }: NewTabComponentProps) {
  return (
    <div className="space-y-3 p-4">
      <h3 className="text-lg font-bold text-foreground">New Releases</h3>
      {newSeries.map((series) => (
        <div
          key={series.id}
          onClick={() => navigateToPlayer(series.id, 1, 0)}
          className="flex gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer border border-border"
          data-testid={`series-${series.id}`}
        >
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-32 h-20 bg-muted rounded-md overflow-hidden">
            <img
              src={series.posterUrl}
              alt={series.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary" />
            </div>
            {series.isNew && (
              <div className="absolute top-1 right-1 px-2 py-0.5 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-bold text-primary-foreground">
                NEW
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground line-clamp-1 mb-1">
                {series.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {series.description}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>{series.rating}</span>
              </div>
              <span>•</span>
              <span>{series.episodeCount} Episodes</span>
              <span>•</span>
              <span>{series.genre}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

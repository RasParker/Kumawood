import { Play, TrendingUp, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Series } from '@shared/schema';

interface RankingsTabComponentProps {
  navigateToPlayer: (seriesId: string, episodeNumber: number, startTime: number) => void;
}

export default function RankingsTabComponent({ navigateToPlayer }: RankingsTabComponentProps) {
  const { data: rankingSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ['/api/series/ranking'],
  });

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Top 10 This Week</h3>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="w-20 h-28 bg-muted rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Top 10 This Week</h3>
      </div>
      {rankingSeries.map((series) => (
        <div
          key={series.id}
          onClick={() => navigateToPlayer(series.id, 1, 0)}
          className="flex items-center gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer border border-border"
          data-testid={`series-rank-${series.rank}`}
        >
          {/* Rank Number */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <span className="text-lg font-extrabold text-primary-foreground">
              {series.rank}
            </span>
          </div>

          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-20 h-28 bg-muted rounded-md overflow-hidden">
            <img
              src={series.posterUrl}
              alt={series.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              <Play className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground line-clamp-1 mb-1">
              {series.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {series.synopsis}
            </p>
            <div className="flex items-center gap-3 text-xs">
              {series.rating && (
                <>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-3 w-3 fill-primary" />
                    <span className="font-semibold">{series.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                </>
              )}
              <span className="text-muted-foreground">{series.genre}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Play } from 'lucide-react';
import type { Series } from '@shared/schema';

interface RankingsListProps {
  series: Series[];
  onSeriesClick: (seriesId: string) => void;
}

export default function RankingsList({ series, onSeriesClick }: RankingsListProps) {
  return (
    <div className="space-y-3">
      {series.map((item, index) => (
        <div
          key={item.id}
          onClick={() => onSeriesClick(item.id)}
          className="flex items-center gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer"
          data-testid={`ranking-item-${index}`}
        >
          {/* Rank Number */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              {index + 1}
            </span>
          </div>

          {/* Poster Image */}
          <div className="relative w-12 h-16 flex-shrink-0 bg-muted rounded overflow-hidden">
            {item.posterUrl ? (
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-card" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="h-4 w-4 text-white" fill="white" />
            </div>
          </div>

          {/* Series Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground line-clamp-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {item.genre && (
                <span className="text-xs text-muted-foreground">{item.genre}</span>
              )}
              {item.rating && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-primary">⭐ {item.rating}</span>
                </>
              )}
            </div>
          </div>

          {/* View Count */}
          {item.viewCount !== null && item.viewCount !== undefined && (
            <div className="flex-shrink-0 text-xs text-muted-foreground">
              {item.viewCount >= 1000000
                ? `${(item.viewCount / 1000000).toFixed(1)}M`
                : item.viewCount >= 1000
                ? `${(item.viewCount / 1000).toFixed(1)}K`
                : item.viewCount}{' '}
              views
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

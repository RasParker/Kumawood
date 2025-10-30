import { useState, useMemo } from 'react';
import { Play, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Series } from '@shared/schema';

interface NaijaTabComponentProps {
  navigateToPlayer: (seriesId: string, episodeNumber: number, startTime: number) => void;
}

const naijaTags = ['All', 'Drama', 'Romance', 'Comedy', 'Thriller', 'Urban', 'Cultural'];

function formatViewCount(count?: number | null): string {
  if (!count) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
}

export default function NaijaTabComponent({ navigateToPlayer }: NaijaTabComponentProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  const { data: naijaSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ['/api/series/naija'],
  });

  const filteredSeries = useMemo(() => {
    if (selectedTag === 'All') return naijaSeries;
    return naijaSeries.filter((series) => series.tags?.includes(selectedTag));
  }, [naijaSeries, selectedTag]);

  return (
    <div className="space-y-4 p-4">
      {/* Filter Tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {naijaTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            data-testid={`filter-${tag.toLowerCase()}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all hover-elevate active-elevate-2 ${
              selectedTag === tag
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                : 'bg-card text-foreground border border-border'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Series Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[9/16] bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredSeries.map((series) => (
            <div
              key={series.id}
              onClick={() => navigateToPlayer(series.id, 1, 0)}
              className="cursor-pointer group"
              data-testid={`series-${series.id}`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[2/3] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2 mb-2">
                <img
                  src={series.posterUrl}
                  alt={series.title}
                  className="w-full h-full object-cover"
                />

                {/* Rating */}
                {series.rating && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-xs font-semibold text-foreground">{series.rating}</span>
                  </div>
                )}

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
                  </div>
                </div>

                {/* View Count Overlay */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                  <Play className="h-3 w-3 fill-white" />
                  <span className="text-xs font-semibold">{formatViewCount(series.viewCount)}</span>
                </div>
              </div>

              {/* Title & Genre Below Thumbnail */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground line-clamp-2">
                  {series.title}
                </h4>
                <p className="text-xs text-muted-foreground">{series.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredSeries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No series found for this category</p>
        </div>
      )}
    </div>
  );
}
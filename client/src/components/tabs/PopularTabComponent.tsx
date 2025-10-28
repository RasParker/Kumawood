import { Play, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Series } from '@shared/schema';
import ComingSoonCarousel from '../ComingSoonCarousel';

interface PopularTabComponentProps {
  navigateToPlayer: (seriesId: string, episodeNumber: number, startTime: number) => void;
}

export default function PopularTabComponent({ navigateToPlayer }: PopularTabComponentProps) {
  const { data: popularSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ['/api/series/popular'],
  });

  return (
    <div className="space-y-6 p-4">
      {/* Coming Soon Carousel */}
      <ComingSoonCarousel />

      {/* Popular Series Grid */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Most Popular</h3>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[9/16] bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {popularSeries.map((series) => (
              <div
                key={series.id}
                onClick={() => navigateToPlayer(series.id, 1, 0)}
                className="cursor-pointer group"
                data-testid={`series-${series.id}`}
              >
                <div className="relative aspect-[9/16] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2">
                  <img
                    src={series.posterUrl}
                    alt={series.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  
                  {/* Rating Badge */}
                  {series.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs font-semibold text-foreground">{series.rating}</span>
                    </div>
                  )}

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-sm font-bold text-foreground line-clamp-2 mb-1">
                      {series.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{series.genre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

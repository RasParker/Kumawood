import { Calendar, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import type { Series } from '@shared/schema';

export default function ComingSoonCarousel() {
  const { data: comingSoonSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ['/api/series/coming-soon'],
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-36 bg-card rounded-lg overflow-hidden border border-border animate-pulse">
              <div className="aspect-[9/16] bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {comingSoonSeries.map((series) => (
          <div
            key={series.id}
            className="flex-shrink-0 w-36 bg-card rounded-lg overflow-hidden border border-border"
            data-testid={`coming-soon-${series.id}`}
          >
            <div className="relative aspect-[9/16] bg-muted">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 right-2">
                <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-primary to-accent rounded-full text-[10px] font-semibold text-primary-foreground">
                  {series.genre}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1.5">
                <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                  {series.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Calendar className="h-2.5 w-2.5" />
                  <span className="line-clamp-1">{series.releaseDate}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid={`button-remind-${series.id}`}
                  className="w-full h-7 text-[10px] rounded-full hover-elevate active-elevate-2"
                >
                  <Bell className="h-2.5 w-2.5 mr-1" />
                  Remind Me
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

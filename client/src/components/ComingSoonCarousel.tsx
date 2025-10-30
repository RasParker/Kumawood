import { Bell } from 'lucide-react';
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
            <div key={i} className="flex-shrink-0 w-32 animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-lg mb-2" />
              <div className="h-8 bg-muted rounded" />
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
            className="flex-shrink-0 w-32"
            data-testid={`coming-soon-${series.id}`}
          >
            {/* Thumbnail Panel */}
            <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-2">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info Panel */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                {series.title}
              </h4>
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
        ))}
      </div>
    </div>
  );
}

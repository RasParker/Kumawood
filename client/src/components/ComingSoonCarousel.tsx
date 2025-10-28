import { Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { comingSoonSeries } from '@/data/mockData';

export default function ComingSoonCarousel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {comingSoonSeries.map((series) => (
          <div
            key={series.id}
            className="flex-shrink-0 w-72 bg-card rounded-lg overflow-hidden border border-border"
            data-testid={`coming-soon-${series.id}`}
          >
            <div className="relative aspect-video bg-muted">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="inline-block px-2 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-primary-foreground">
                  {series.genre}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {series.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {series.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{series.releaseDate}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-remind-${series.id}`}
                className="w-full rounded-full hover-elevate active-elevate-2"
              >
                <Bell className="h-3 w-3 mr-2" />
                Remind Me
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Play, Search as SearchIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
  onNavigateToSearch: () => void;
}

export default function HomeScreen({ onNavigateToPlayer, onNavigateToSearch }: HomeScreenProps) {
  const featuredSeries = [
    { id: '1', title: 'Love in Lagos', episodes: 120, thumbnail: '/placeholder.jpg' },
    { id: '2', title: 'The Kingdom', episodes: 85, thumbnail: '/placeholder.jpg' },
    { id: '3', title: 'Modern Marriage', episodes: 95, thumbnail: '/placeholder.jpg' },
    { id: '4', title: 'Street Tales', episodes: 110, thumbnail: '/placeholder.jpg' },
    { id: '5', title: 'African Queen', episodes: 78, thumbnail: '/placeholder.jpg' },
    { id: '6', title: 'City Lights', episodes: 92, thumbnail: '/placeholder.jpg' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/95 backdrop-blur-md border-b border-border">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AfriShorts
        </h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={onNavigateToSearch}
          data-testid="button-search"
          className="hover-elevate active-elevate-2"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-b from-card to-background">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Trending Now</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Love in Lagos</h2>
          <p className="text-sm text-muted-foreground">120 Episodes • Drama • Romance</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full px-8"
            onClick={() => onNavigateToPlayer('1', 1)}
            data-testid="button-play-featured"
          >
            <Play className="h-5 w-5 mr-2" />
            Watch Now
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-4 py-6 space-y-6">
        <h3 className="text-lg font-bold text-foreground">Popular Series</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {featuredSeries.map((series) => (
            <div
              key={series.id}
              onClick={() => onNavigateToPlayer(series.id, 1)}
              className="cursor-pointer group"
              data-testid={`card-series-${series.id}`}
            >
              <div className="relative aspect-[9/16] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-primary-foreground">
                  EP {series.episodes}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-sm font-bold text-foreground line-clamp-2">
                    {series.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {series.episodes} Episodes
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

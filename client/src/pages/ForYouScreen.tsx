import { Sparkles } from 'lucide-react';

interface ForYouScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
}

export default function ForYouScreen({ onNavigateToPlayer }: ForYouScreenProps) {
  const recommendations = [
    { id: '7', title: 'Hidden Secrets', genre: 'Mystery', episodes: 45 },
    { id: '8', title: 'Desert Rose', genre: 'Romance', episodes: 67 },
    { id: '9', title: 'Night Tales', genre: 'Thriller', episodes: 52 },
    { id: '10', title: 'Family Ties', genre: 'Drama', episodes: 88 },
    { id: '11', title: 'Street Dreams', genre: 'Action', episodes: 73 },
    { id: '12', title: 'Love & War', genre: 'Romance', episodes: 91 },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 p-4 bg-background/95 backdrop-blur-md border-b border-border">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">For You</h1>
      </div>

      {/* Personalized Content */}
      <div className="px-4 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Recommended for You</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {recommendations.map((series) => (
              <div
                key={series.id}
                onClick={() => onNavigateToPlayer(series.id, 1)}
                className="cursor-pointer"
                data-testid={`card-recommendation-${series.id}`}
              >
                <div className="relative aspect-[9/16] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-xs font-semibold text-primary mb-1">{series.genre}</div>
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

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Trending This Week</h2>
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((series, index) => (
              <div
                key={series.id}
                onClick={() => onNavigateToPlayer(series.id, 1)}
                className="flex items-center gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`item-trending-${series.id}`}
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-primary to-accent rounded-full text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {series.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {series.genre} • {series.episodes} Episodes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

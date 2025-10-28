import { Bookmark } from 'lucide-react';

interface MyListScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
}

export default function MyListScreen({ onNavigateToPlayer }: MyListScreenProps) {
  const myList = [
    { id: '1', title: 'Love in Lagos', progress: 45, episodes: 120 },
    { id: '2', title: 'The Kingdom', progress: 12, episodes: 85 },
    { id: '3', title: 'Modern Marriage', progress: 67, episodes: 95 },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-background border-b border-border">
        <h1 className="text-xl font-bold text-foreground">My List</h1>
      </div>

      {/* List Content */}
      {myList.length > 0 ? (
        <div className="p-4 space-y-3">
          {myList.map((series) => (
            <div
              key={series.id}
              onClick={() => onNavigateToPlayer(series.id, series.progress)}
              className="flex gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer"
              data-testid={`item-mylist-${series.id}`}
            >
              <div className="flex-shrink-0 w-20 h-28 bg-muted rounded-md" />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                    {series.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Episode {series.progress} of {series.episodes}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${(series.progress / series.episodes) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((series.progress / series.episodes) * 100)}% complete
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Your list is empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Add series to your list to watch them later
          </p>
        </div>
      )}
    </div>
  );
}

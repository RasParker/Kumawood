import { ChevronLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryScreenProps {
  onNavigateBack: () => void;
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
}

export default function HistoryScreen({ onNavigateBack, onNavigateToPlayer }: HistoryScreenProps) {
  const watchHistory = [
    { id: '1', title: 'Love in Lagos', episode: 45, timestamp: '2 hours ago', progress: 80 },
    { id: '2', title: 'The Kingdom', episode: 12, timestamp: 'Yesterday', progress: 100 },
    { id: '3', title: 'Modern Marriage', episode: 67, timestamp: '2 days ago', progress: 45 },
    { id: '4', title: 'Street Tales', episode: 23, timestamp: '3 days ago', progress: 100 },
  ];

  return (
    <div className="flex flex-col h-full bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 p-4 bg-background border-b border-border">
        <Button
          size="icon"
          variant="ghost"
          onClick={onNavigateBack}
          data-testid="button-back"
          className="hover-elevate active-elevate-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Watch History</h1>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4">
        {watchHistory.length > 0 ? (
          <div className="space-y-3">
            {watchHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateToPlayer(item.id, item.episode)}
                className="flex gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`history-item-${item.id}`}
              >
                <div className="flex-shrink-0 w-20 h-28 bg-muted rounded-md" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">Episode {item.episode}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No watch history</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your recently watched episodes will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

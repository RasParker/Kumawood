import { ChevronLeft, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadsScreenProps {
  cacheSizeMB: number;
  onNavigateBack: () => void;
}

export default function DownloadsScreen({ cacheSizeMB, onNavigateBack }: DownloadsScreenProps) {
  const downloads = [
    { id: '1', title: 'Love in Lagos', episodes: [1, 2, 3], size: 45.2 },
    { id: '2', title: 'The Kingdom', episodes: [1], size: 15.8 },
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
        <h1 className="text-xl font-bold text-foreground">Downloads</h1>
      </div>

      {/* Storage Info */}
      <div className="p-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Storage Used</span>
            <span className="text-sm font-semibold text-foreground">
              {cacheSizeMB.toFixed(1)} MB
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${Math.min((cacheSizeMB / 500) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">of 500 MB available</p>
        </div>
      </div>

      {/* Downloads List */}
      <div className="flex-1 overflow-y-auto p-4">
        {downloads.length > 0 ? (
          <div className="space-y-3">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="p-4 bg-card rounded-lg border border-border"
                data-testid={`download-${download.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {download.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {download.episodes.length} episode{download.episodes.length > 1 ? 's' : ''} • {download.size.toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-delete-${download.id}`}
                    className="flex-shrink-0 text-destructive hover-elevate active-elevate-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {download.episodes.map((ep) => (
                    <div
                      key={ep}
                      className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground"
                    >
                      EP {ep}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Download className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No downloads yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Download episodes to watch offline
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

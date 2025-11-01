import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play } from 'lucide-react';
import type { Series, Episode } from '@shared/schema';

interface EpisodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  series: Series | null;
  episodes: Episode[];
  currentEpisodeNumber: number;
  onEpisodeSelect: (episodeNumber: number) => void;
}

export default function EpisodeSheet({
  open,
  onOpenChange,
  series,
  episodes,
  currentEpisodeNumber,
  onEpisodeSelect,
}: EpisodeSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="bg-[#1A1A1A] border-t border-border text-foreground h-[80vh] rounded-t-xl"
        data-testid="sheet-episodes"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground text-lg">
            {series?.title || 'Episodes'}
          </SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="episodes" className="w-full h-full flex flex-col">
          <TabsList className="bg-card border border-border mb-4 w-full">
            <TabsTrigger 
              value="synopsis" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
              data-testid="tab-synopsis"
            >
              Synopsis
            </TabsTrigger>
            <TabsTrigger 
              value="episodes" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
              data-testid="tab-episodes"
            >
              Episodes ({episodes.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="synopsis" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">About</h3>
                  <p className="text-foreground leading-relaxed">
                    {series?.synopsis || 'No synopsis available.'}
                  </p>
                </div>
                
                {series?.genre && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Genre</h3>
                    <p className="text-foreground">{series.genre}</p>
                  </div>
                )}
                
                {series?.year && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Year</h3>
                    <p className="text-foreground">{series.year}</p>
                  </div>
                )}
                
                {series?.rating && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Rating</h3>
                    <p className="text-foreground">{series.rating.toFixed(1)} / 5.0</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="episodes" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-6 gap-3 pb-4">
                {episodes.map((episode) => {
                  const isActive = episode.episodeNumber === currentEpisodeNumber;
                  return (
                    <button
                      key={episode.id}
                      onClick={() => {
                        onEpisodeSelect(episode.episodeNumber);
                        onOpenChange(false);
                      }}
                      data-testid={`button-episode-${episode.episodeNumber}`}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all hover-elevate active-elevate-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-card text-foreground hover:bg-card/80'
                      }`}
                    >
                      {isActive ? (
                        <Play className="h-5 w-5" fill="currentColor" />
                      ) : (
                        <span className="font-semibold text-sm">{episode.episodeNumber}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

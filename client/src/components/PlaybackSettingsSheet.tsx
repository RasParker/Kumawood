import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PlaybackSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autoplayEnabled: boolean;
  onAutoplayToggle: (enabled: boolean) => void;
}

export default function PlaybackSettingsSheet({
  open,
  onOpenChange,
  autoplayEnabled,
  onAutoplayToggle,
}: PlaybackSettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="bg-[#1A1A1A] border-t border-border text-foreground h-auto rounded-t-xl"
        data-testid="sheet-settings"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground text-lg">
            Playback Settings
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-card">
            <div className="flex-1">
              <Label htmlFor="autoplay" className="text-foreground font-semibold text-base cursor-pointer">
                Autoplay Next Episode
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically play the next episode when current one ends
              </p>
            </div>
            <Switch
              id="autoplay"
              checked={autoplayEnabled}
              onCheckedChange={onAutoplayToggle}
              data-testid="switch-autoplay"
              className="ml-4"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-card opacity-50">
            <div className="flex-1">
              <Label className="text-foreground font-semibold text-base">
                Video Quality
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Auto (Best available quality)
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-card opacity-50">
            <div className="flex-1">
              <Label className="text-foreground font-semibold text-base">
                Skip Intro
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

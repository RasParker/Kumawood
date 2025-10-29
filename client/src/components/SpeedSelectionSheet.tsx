import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Check } from 'lucide-react';

interface SpeedSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSpeed: number;
  onSpeedSelect: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function SpeedSelectionSheet({
  open,
  onOpenChange,
  currentSpeed,
  onSpeedSelect,
}: SpeedSelectionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="bg-[#1A1A1A] border-t border-border text-foreground h-auto rounded-t-xl"
        data-testid="sheet-speed"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground text-lg">
            Playback Speed
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-2 pb-6">
          {SPEED_OPTIONS.map((speed) => {
            const isActive = speed === currentSpeed;
            return (
              <button
                key={speed}
                onClick={() => {
                  onSpeedSelect(speed);
                  onOpenChange(false);
                }}
                data-testid={`button-speed-${speed}`}
                className={`w-full p-4 rounded-lg flex items-center justify-between transition-all hover-elevate active-elevate-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-card/80'
                }`}
              >
                <span className="font-semibold">
                  {speed === 1 ? 'Normal' : `${speed}x`}
                </span>
                {isActive && <Check className="h-5 w-5" />}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

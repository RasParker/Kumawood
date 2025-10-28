import { ChevronLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardCoinsHistoryScreenProps {
  onNavigateBack: () => void;
}

export default function RewardCoinsHistoryScreen({ onNavigateBack }: RewardCoinsHistoryScreenProps) {
  const rewards = [
    { id: 1, amount: 10, source: 'Daily Sign-in', date: '2025-10-28', time: '09:00 AM' },
    { id: 2, amount: 50, source: 'Achievement Unlocked', date: '2025-10-26', time: '04:30 PM' },
    { id: 3, amount: 15, source: 'Completed Daily Task', date: '2025-10-25', time: '07:15 PM' },
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
        <h1 className="text-xl font-bold text-foreground">Reward Coins</h1>
      </div>

      {/* Rewards List */}
      <div className="flex-1 overflow-y-auto p-4">
        {rewards.length > 0 ? (
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                data-testid={`reward-${reward.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Gift className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{reward.source}</h3>
                    <p className="text-xs text-muted-foreground">
                      {reward.date} • {reward.time}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">+{reward.amount}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Gift className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No rewards yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Earn coins by completing tasks and achievements
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

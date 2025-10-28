import { ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailedPointsHistoryScreenProps {
  onNavigateBack: () => void;
}

export default function DetailedPointsHistoryScreen({ onNavigateBack }: DetailedPointsHistoryScreenProps) {
  const history = [
    { id: 1, type: 'earned', amount: 10, description: 'Daily sign-in', date: '2025-10-28', time: '09:30 AM' },
    { id: 2, type: 'spent', amount: -50, description: 'Unlocked Episode 45', date: '2025-10-27', time: '08:15 PM' },
    { id: 3, type: 'earned', amount: 15, description: 'Watched 3 episodes', date: '2025-10-27', time: '06:00 PM' },
    { id: 4, type: 'earned', amount: 50, description: 'Achievement unlocked', date: '2025-10-26', time: '03:45 PM' },
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
        <h1 className="text-xl font-bold text-foreground">Points History</h1>
      </div>

      {/* Summary */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Earned</span>
            </div>
            <div className="text-2xl font-bold text-foreground">75</div>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Spent</span>
            </div>
            <div className="text-2xl font-bold text-foreground">50</div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
              data-testid={`history-item-${item.id}`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {item.description}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.date} • {item.time}
                </p>
              </div>
              <div className={`text-lg font-bold ${
                item.type === 'earned' ? 'text-primary' : 'text-destructive'
              }`}>
                {item.amount > 0 ? '+' : ''}{item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

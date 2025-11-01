import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsumptionRecordsScreenProps {
  onNavigateBack: () => void;
}

export default function ConsumptionRecordsScreen({ onNavigateBack }: ConsumptionRecordsScreenProps) {
  const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Fixed demo user UUID from seed script
  const records = [
    { id: 1, title: 'Love in Lagos - Episode 45', amount: 5, date: '2025-10-27', time: '08:15 PM' },
    { id: 2, title: 'The Kingdom - Episode 12', amount: 5, date: '2025-10-26', time: '06:30 PM' },
    { id: 3, title: 'Modern Marriage - Episode 67', amount: 5, date: '2025-10-25', time: '09:45 PM' },
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
        <h1 className="text-xl font-bold text-foreground">Consumption Records</h1>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-y-auto p-4">
        {records.length > 0 ? (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                data-testid={`record-${record.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {record.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {record.date} • {record.time}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-destructive flex-shrink-0 ml-2">
                  -{record.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <ArrowUpRight className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No consumption records</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your spending history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
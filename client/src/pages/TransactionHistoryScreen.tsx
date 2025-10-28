import { ChevronLeft, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionHistoryScreenProps {
  onNavigateBack: () => void;
}

export default function TransactionHistoryScreen({ onNavigateBack }: TransactionHistoryScreenProps) {
  const transactions = [
    { id: 1, type: 'purchase', amount: 500, method: 'Credit Card', date: '2025-10-27', time: '08:30 PM' },
    { id: 2, type: 'purchase', amount: 100, method: 'PayPal', date: '2025-10-20', time: '03:15 PM' },
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
        <h1 className="text-xl font-bold text-foreground">Transaction History</h1>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto p-4">
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowDownRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Purchased {transaction.amount} Coins
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {transaction.method} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">+{transaction.amount}</div>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <ArrowDownRight className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your purchase history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

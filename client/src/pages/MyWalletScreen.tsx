import { ChevronLeft, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MyWalletScreenProps {
  onNavigateBack: () => void;
  onNavigateToTransactionHistory: () => void;
  onNavigateToRewardCoinsHistory: () => void;
  onNavigateToConsumptionRecords: () => void;
  onNavigateToStore: () => void;
}

export default function MyWalletScreen({
  onNavigateBack,
  onNavigateToTransactionHistory,
  onNavigateToRewardCoinsHistory,
  onNavigateToConsumptionRecords,
  onNavigateToStore,
}: MyWalletScreenProps) {
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
        <h1 className="text-xl font-bold text-foreground">My Wallet</h1>
      </div>

      {/* Wallet Balance */}
      <div className="p-4">
        <div className="p-6 bg-gradient-to-r from-primary to-accent rounded-lg text-center space-y-4">
          <div>
            <p className="text-sm text-primary-foreground/90 mb-2">Total Balance</p>
            <div className="flex items-center justify-center gap-2">
              <Wallet className="h-6 w-6 text-primary-foreground" />
              <span className="text-4xl font-bold text-primary-foreground">0</span>
            </div>
            <p className="text-xs text-primary-foreground/80 mt-1">Coins</p>
          </div>
          <Button
            onClick={onNavigateToStore}
            data-testid="button-add-coins"
            className="bg-primary-foreground text-primary hover-elevate active-elevate-2 rounded-full px-6"
          >
            Add Coins
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-destructive mb-1">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-xs text-muted-foreground">Spent</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pb-6 space-y-3">
        <button
          onClick={onNavigateToTransactionHistory}
          data-testid="link-transaction-history"
          className="w-full flex items-center justify-between p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
        >
          <span className="text-sm font-medium text-foreground">Transaction History</span>
          <span className="text-xs text-muted-foreground">View all</span>
        </button>

        <button
          onClick={onNavigateToRewardCoinsHistory}
          data-testid="link-reward-coins-history"
          className="w-full flex items-center justify-between p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
        >
          <span className="text-sm font-medium text-foreground">Reward Coins History</span>
          <span className="text-xs text-muted-foreground">View all</span>
        </button>

        <button
          onClick={onNavigateToConsumptionRecords}
          data-testid="link-consumption-records"
          className="w-full flex items-center justify-between p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
        >
          <span className="text-sm font-medium text-foreground">Consumption Records</span>
          <span className="text-xs text-muted-foreground">View all</span>
        </button>
      </div>
    </div>
  );
}

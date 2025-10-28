import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountDeletionScreenProps {
  onNavigateBack: () => void;
}

export default function AccountDeletionScreen({ onNavigateBack }: AccountDeletionScreenProps) {
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
        <h1 className="text-xl font-bold text-foreground">Delete Account</h1>
      </div>

      {/* Warning */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Delete Your Account?
          </h2>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone
          </p>
        </div>

        {/* Consequences */}
        <div className="p-4 bg-card rounded-lg border border-border space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            This will permanently delete:
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Your profile and account information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Watch history and preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Saved series and watchlist</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Coins, points, and rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Active subscriptions and memberships</span>
            </li>
          </ul>
        </div>

        {/* Confirmation */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Are you sure you want to delete your account? This action is permanent and cannot be reversed.
          </p>

          <Button
            variant="outline"
            onClick={onNavigateBack}
            data-testid="button-cancel"
            className="w-full rounded-full hover-elevate active-elevate-2"
          >
            Cancel
          </Button>

          <Button
            data-testid="button-confirm-delete"
            className="w-full bg-destructive text-destructive-foreground hover-elevate active-elevate-2 rounded-full"
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </div>
  );
}

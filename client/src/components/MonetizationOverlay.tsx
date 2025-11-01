import { Lock, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Episode, User } from '@shared/schema';

interface MonetizationOverlayProps {
  episode: Episode;
  onUnlockSuccess: () => void;
}

export default function MonetizationOverlay({ episode, onUnlockSuccess }: MonetizationOverlayProps) {
  const { toast } = useToast();
  const userId = 'demo-user-id';

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users', userId],
  });

  const unlockMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/episodes/${episode.id}/unlock`, { userId });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
        queryClient.invalidateQueries({ queryKey: ['/api/episodes', episode.id, 'unlock-status', userId] });
        toast({
          title: 'Episode unlocked!',
          description: 'You can now watch this episode.',
        });
        onUnlockSuccess();
      }
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to unlock episode';
      toast({
        title: 'Unable to unlock',
        description: message.includes('Not enough coins') 
          ? 'You don\'t have enough coins. Please purchase more coins to continue.'
          : message,
        variant: 'destructive',
      });
    },
  });

  const totalCoins = (user?.coins || 0) + (user?.rewardCoins || 0);
  const canAfford = totalCoins >= episode.costInCoins;

  return (
    <div 
      className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
      data-testid="overlay-monetization"
    >
      <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
            <Lock className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Episode Locked
          </h2>
          <p className="text-muted-foreground">
            Unlock this episode to continue watching
          </p>
        </div>

        <div className="bg-background rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              {episode.costInCoins} Coins
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            You have: {totalCoins} coins
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => unlockMutation.mutate()}
            disabled={!canAfford || unlockMutation.isPending}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
            data-testid="button-unlock-episode"
          >
            {unlockMutation.isPending ? 'Unlocking...' : 'Unlock Now'}
          </Button>

          {!canAfford && (
            <Button
              variant="outline"
              className="w-full"
              data-testid="button-buy-coins"
            >
              Buy More Coins
            </Button>
          )}
        </div>

        {!canAfford && (
          <p className="text-sm text-destructive mt-4">
            Not enough coins to unlock this episode
          </p>
        )}
      </div>
    </div>
  );
}

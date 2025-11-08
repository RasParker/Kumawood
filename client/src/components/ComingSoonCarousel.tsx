import { Bell, BellOff } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import type { Series } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function ComingSoonCarousel() {
  const userId = '57566876-ea2c-48ff-bf38-8c5d4f535ea3';
  const { toast } = useToast();

  const { data: comingSoonSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ['/api/series/coming-soon'],
  });

  const { data: userReminders = [] } = useQuery<Series[]>({
    queryKey: ['/api/user-reminders', userId],
    enabled: !!userId,
  });

  const reminderSeriesIds = new Set(userReminders.map(s => s.id));

  const addReminderMutation = useMutation({
    mutationFn: async (seriesId: string) => {
      await apiRequest('POST', '/api/user-reminders', {
        userId,
        seriesId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-reminders', userId] });
      toast({
        title: 'Reminder Set',
        description: "You'll be notified when this series is released.",
      });
    },
    onError: () => {
      toast({
        title: 'Failed to set reminder',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const removeReminderMutation = useMutation({
    mutationFn: async (seriesId: string) => {
      await apiRequest('DELETE', `/api/user-reminders/${userId}/${seriesId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-reminders', userId] });
      toast({
        title: 'Reminder Removed',
        description: 'You will no longer be notified about this series.',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to remove reminder',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleToggleReminder = (seriesId: string, hasReminder: boolean) => {
    if (hasReminder) {
      removeReminderMutation.mutate(seriesId);
    } else {
      addReminderMutation.mutate(seriesId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-lg mb-2" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {comingSoonSeries.map((series) => (
          <div
            key={series.id}
            className="flex-shrink-0 w-32"
            data-testid={`coming-soon-${series.id}`}
          >
            {/* Thumbnail Panel */}
            <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-2">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info Panel */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                {series.title}
              </h4>
              {(() => {
                const hasReminder = reminderSeriesIds.has(series.id);
                return (
                  <Button
                    variant={hasReminder ? "default" : "outline"}
                    size="sm"
                    data-testid={`button-remind-${series.id}`}
                    className="w-full h-7 text-[10px] rounded-full hover-elevate active-elevate-2"
                    onClick={() => handleToggleReminder(series.id, hasReminder)}
                    disabled={addReminderMutation.isPending || removeReminderMutation.isPending}
                  >
                    {hasReminder ? (
                      <>
                        <BellOff className="h-2.5 w-2.5 mr-1" />
                        Reminded
                      </>
                    ) : (
                      <>
                        <Bell className="h-2.5 w-2.5 mr-1" />
                        Remind Me
                      </>
                    )}
                  </Button>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

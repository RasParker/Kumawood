import { ChevronLeft, Bell, BellOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface NotificationsScreenProps {
  onNavigateBack: () => void;
}

export default function NotificationsScreen({ onNavigateBack }: NotificationsScreenProps) {
  const notificationSettings = [
    {
      id: 'new-episodes',
      title: 'New Episodes',
      description: 'Get notified when new episodes are released',
      enabled: true,
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      description: 'Personalized series recommendations',
      enabled: true,
    },
    {
      id: 'rewards',
      title: 'Rewards & Points',
      description: 'Updates about your points and rewards',
      enabled: true,
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Special offers and discounts',
      enabled: false,
    },
    {
      id: 'reminders',
      title: 'Watch Reminders',
      description: 'Reminders to continue watching your series',
      enabled: true,
    },
  ];

  const recentNotifications = [
    { id: 1, title: 'New episode available', message: 'Love in Lagos Episode 46 is now available', time: '2 hours ago', read: false },
    { id: 2, title: 'Daily reward claimed', message: 'You earned 10 points for signing in', time: '5 hours ago', read: true },
    { id: 3, title: 'New series added', message: 'Check out our latest African dramas', time: '1 day ago', read: true },
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
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Notifications */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Recent</h2>
          <div className="space-y-2">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read
                    ? 'bg-card border-border'
                    : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30'
                }`}
                data-testid={`notification-${notification.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.read ? 'bg-muted' : 'bg-gradient-to-r from-primary to-accent'
                  }`}>
                    <Bell className={`h-5 w-5 ${
                      notification.read ? 'text-muted-foreground' : 'text-primary-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-4 border-t border-border">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Preferences</h2>
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-start justify-between p-4 bg-card rounded-lg border border-border"
                data-testid={`setting-${setting.id}`}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {setting.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <button
                  className={`flex-shrink-0 w-12 h-6 rounded-full transition-all ${
                    setting.enabled
                      ? 'bg-gradient-to-r from-primary to-accent'
                      : 'bg-muted'
                  }`}
                  data-testid={`toggle-${setting.id}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-background shadow-md transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            data-testid="button-mark-all-read"
            className="w-full rounded-full hover-elevate active-elevate-2"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
          <Button
            variant="ghost"
            data-testid="button-clear-all"
            className="w-full rounded-full hover-elevate active-elevate-2 text-destructive"
          >
            <BellOff className="h-4 w-4 mr-2" />
            Clear All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
}

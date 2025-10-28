import { ChevronLeft, Bell, Lock, Eye, Smartphone, Wifi, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsScreenProps {
  onNavigateBack: () => void;
  onNavigateToAccountDeletion: () => void;
}

export default function SettingsScreen({ onNavigateBack, onNavigateToAccountDeletion }: SettingsScreenProps) {
  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Push Notifications', value: 'Enabled', testId: 'setting-notifications' },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { icon: Lock, label: 'Privacy Settings', value: '', testId: 'setting-privacy' },
        { icon: Eye, label: 'Watch History', value: 'Visible', testId: 'setting-watch-history' },
      ],
    },
    {
      title: 'Playback',
      items: [
        { icon: Smartphone, label: 'Video Quality', value: 'Auto', testId: 'setting-video-quality' },
        { icon: Wifi, label: 'Download Quality', value: 'High', testId: 'setting-download-quality' },
      ],
    },
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
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    data-testid={item.testId}
                    className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    {item.value && (
                      <span className="text-xs text-muted-foreground">{item.value}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Danger Zone
          </h2>
          <button
            onClick={onNavigateToAccountDeletion}
            data-testid="button-delete-account"
            className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left text-destructive border border-destructive/30"
          >
            <Trash2 className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">Delete Account</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Trash2 } from 'lucide-react';

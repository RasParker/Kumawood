import {
  User,
  Settings,
  Wallet,
  Gift,
  History,
  Download,
  Globe,
  CreditCard,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToSettings: () => void;
  onNavigateToMyWallet: () => void;
  onNavigateToRewards: () => void;
  onNavigateToHistory: () => void;
  onNavigateToDownloads: () => void;
  onNavigateToLanguage: () => void;
  onNavigateToManageMembership: () => void;
  onNavigateToHelpFeedback: () => void;
  onNavigateToAbout: () => void;
  onNavigateToNotifications: () => void;
}

export default function ProfileScreen({
  onNavigateToLogin,
  onNavigateToSettings,
  onNavigateToMyWallet,
  onNavigateToRewards,
  onNavigateToHistory,
  onNavigateToDownloads,
  onNavigateToLanguage,
  onNavigateToManageMembership,
  onNavigateToHelpFeedback,
  onNavigateToAbout,
  onNavigateToNotifications,
}: ProfileScreenProps) {
  const menuItems = [
    { icon: Bell, label: 'Notifications', onClick: onNavigateToNotifications, testId: 'link-notifications' },
    { icon: Wallet, label: 'My Wallet', onClick: onNavigateToMyWallet, testId: 'link-wallet' },
    { icon: Gift, label: 'Rewards', onClick: onNavigateToRewards, testId: 'link-rewards' },
    { icon: History, label: 'Watch History', onClick: onNavigateToHistory, testId: 'link-history' },
    { icon: Download, label: 'Downloads', onClick: onNavigateToDownloads, testId: 'link-downloads' },
    { icon: Globe, label: 'Language', onClick: onNavigateToLanguage, testId: 'link-language' },
    { icon: CreditCard, label: 'Manage Membership', onClick: onNavigateToManageMembership, testId: 'link-membership' },
    { icon: Settings, label: 'Settings', onClick: onNavigateToSettings, testId: 'link-settings' },
    { icon: HelpCircle, label: 'Help & Feedback', onClick: onNavigateToHelpFeedback, testId: 'link-help' },
    { icon: Info, label: 'About', onClick: onNavigateToAbout, testId: 'link-about' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Profile Header */}
      <div className="p-6 bg-gradient-to-b from-card to-background">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent p-0.5">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Guest User</h2>
            <p className="text-sm text-muted-foreground">Free Member</p>
          </div>
          <Button
            onClick={onNavigateToLogin}
            data-testid="button-login"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full px-6"
          >
            Sign In
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              0
            </div>
            <div className="text-xs text-muted-foreground mt-1">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              0
            </div>
            <div className="text-xs text-muted-foreground mt-1">Coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              0
            </div>
            <div className="text-xs text-muted-foreground mt-1">Watched</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              data-testid={item.testId}
              className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
            >
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}

        <button
          onClick={onNavigateToLogin}
          data-testid="button-logout"
          className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left text-destructive"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

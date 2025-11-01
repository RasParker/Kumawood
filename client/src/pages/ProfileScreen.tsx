import {
  User as UserIcon,
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
  Copy,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
  onNavigateToStore: () => void;
  onCopyId: (id: string) => void;
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
  onNavigateToStore,
  onCopyId,
}: ProfileScreenProps) {
  const { user, supabaseUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigateToLogin();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { icon: Bell, label: 'Notifications', onClick: onNavigateToNotifications, testId: 'link-notifications' },
    { icon: CreditCard, label: 'Top Up', onClick: onNavigateToStore, testId: 'link-topup' },
    { icon: Wallet, label: 'My Wallet', onClick: onNavigateToMyWallet, testId: 'link-wallet', badge: user ? `${user.coins + user.rewardCoins} coins` : undefined },
    { icon: Gift, label: 'Earn Rewards', onClick: onNavigateToRewards, testId: 'link-rewards' },
    { icon: History, label: 'Watch History', onClick: onNavigateToHistory, testId: 'link-history' },
    { icon: Download, label: 'Downloads', onClick: onNavigateToDownloads, testId: 'link-downloads' },
    { icon: Globe, label: 'Language', onClick: onNavigateToLanguage, testId: 'link-language', badge: user?.languagePreference?.toUpperCase() },
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
                <UserIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {user && supabaseUser ? (
            <div className="w-full">
              <h2 className="text-xl font-bold text-foreground">{supabaseUser.email}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-sm text-muted-foreground">ID: {supabaseUser.id.substring(0, 8)}...</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onCopyId(supabaseUser.id)}
                  data-testid="button-copy-id"
                  className="h-6 w-6 hover-elevate active-elevate-2"
                >
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {user.hasMembership ? 'Premium Member' : 'Free Member'}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-xl font-bold text-foreground">Guest User</h2>
              <p className="text-sm text-muted-foreground">Free Member</p>
              <Button
                onClick={onNavigateToLogin}
                data-testid="button-login"
                className="mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full px-6"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {user?.points || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {user ? user.coins + user.rewardCoins : 0}
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

      {/* Membership Banner */}
      {user && !user.hasMembership && (
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-foreground">Join Membership</h3>
                  <p className="text-xs text-muted-foreground">Unlock unlimited access</p>
                </div>
              </div>
              <Button
                onClick={onNavigateToStore}
                data-testid="button-join-membership"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full px-4"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2 mt-2">
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
              {item.badge && (
                <span className="text-xs text-muted-foreground">{item.badge}</span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}

        {user && supabaseUser && (
          <button
            onClick={handleSignOut}
            data-testid="button-logout"
            className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left text-destructive"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}

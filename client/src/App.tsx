import { useState, useEffect } from 'react';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import i18n from '@/i18n/config';
import type { User } from '@shared/schema';

// Import all screen components
import HomeScreen from '@/pages/HomeScreen';
import ForYouScreen from '@/pages/ForYouScreen';
import PlayerScreen from '@/pages/PlayerScreen';
import SearchScreen from '@/pages/SearchScreen';
import MyListScreen from '@/pages/MyListScreen';
import ProfileScreen from '@/pages/ProfileScreen';
import LoginScreen from '@/pages/LoginScreen';
import StoreScreen from '@/pages/StoreScreen';
import RewardsScreen from '@/pages/RewardsScreen';
import TermsOfUseScreen from '@/pages/TermsOfUseScreen';
import DetailedPointsHistoryScreen from '@/pages/DetailedPointsHistoryScreen';
import HistoryScreen from '@/pages/HistoryScreen';
import MyWalletScreen from '@/pages/MyWalletScreen';
import TransactionHistoryScreen from '@/pages/TransactionHistoryScreen';
import RewardCoinsHistoryScreen from '@/pages/RewardCoinsHistoryScreen';
import ConsumptionRecordsScreen from '@/pages/ConsumptionRecordsScreen';
import LanguageScreen from '@/pages/LanguageScreen';
import DownloadsScreen from '@/pages/DownloadsScreen';
import SettingsScreen from '@/pages/SettingsScreen';
import ManageMembershipScreen from '@/pages/ManageMembershipScreen';
import AccountDeletionScreen from '@/pages/AccountDeletionScreen';
import AboutScreen from '@/pages/AboutScreen';
import HelpFeedbackScreen from '@/pages/HelpFeedbackScreen';
import NotificationsScreen from '@/pages/NotificationsScreen';
import BottomNavBar from '@/components/BottomNavBar';

function AppContent() {
  // State management
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<number>(1);
  const [playerStartTime, setPlayerStartTime] = useState<number>(0);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);
  const [showToastMessage, setShowToastMessage] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [cacheSizeMB, setCacheSizeMB] = useState<number>(61.2);

  const userId = 'demo-user-id';
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  // Navigation functions
  const navigateToHome = () => {
    setCurrentView('home');
  };

  const navigateToForYou = () => {
    setCurrentView('forYou');
  };

  const navigateToMyList = () => {
    setCurrentView('myList');
  };

  const navigateToProfile = () => {
    setCurrentView('profile');
  };

  const navigateToPlayer = (seriesId: string, episodeNumber: number, startTime: number = 0) => {
    setSelectedSeriesId(seriesId);
    setSelectedEpisodeNumber(episodeNumber);
    setPlayerStartTime(startTime);
    setCurrentView('player');
  };

  const navigateToSearch = () => {
    setCurrentView('search');
  };

  const navigateToLogin = () => {
    setCurrentView('login');
  };

  const navigateToStore = () => {
    setCurrentView('store');
  };

  const navigateToRewards = () => {
    setCurrentView('rewards');
  };

  const navigateToPointsHistory = () => {
    setCurrentView('pointsHistory');
  };

  const navigateToHistory = () => {
    setCurrentView('history');
  };

  const navigateToMyWallet = () => {
    setCurrentView('myWallet');
  };

  const navigateToTransactionHistory = () => {
    setCurrentView('transactionHistory');
  };

  const navigateToRewardCoinsHistory = () => {
    setCurrentView('rewardCoinsHistory');
  };

  const navigateToConsumptionRecords = () => {
    setCurrentView('consumptionRecords');
  };

  const navigateToLanguage = () => {
    setCurrentView('language');
  };

  const navigateToDownloads = () => {
    setCurrentView('downloads');
  };

  const navigateToSettings = () => {
    setCurrentView('settings');
  };

  const navigateToManageMembership = () => {
    setCurrentView('manageMembership');
  };

  const navigateToAccountDeletion = () => {
    setCurrentView('accountDeletion');
  };

  const navigateToAbout = () => {
    setCurrentView('about');
  };

  const navigateToHelpFeedback = () => {
    setCurrentView('helpFeedback');
  };

  const navigateToTerms = () => {
    setCurrentView('termsOfUse');
  };

  const navigateToNotifications = () => {
    setCurrentView('notifications');
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
  };

  const openMembershipUpsell = () => {
    navigateToManageMembership();
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    }).catch((err) => {
      console.error('Failed to copy ID:', err);
    });
  };

  // Render current screen based on state
  const renderScreen = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToPlayer={navigateToPlayer}
            onNavigateToSearch={navigateToSearch}
          />
        );
      case 'forYou':
        return (
          <ForYouScreen 
            onNavigateToPlayer={navigateToPlayer} 
            onNavigateToSearch={navigateToSearch}
          />
        );
      case 'player':
        return (
          <PlayerScreen
            seriesId={selectedSeriesId}
            episodeNumber={selectedEpisodeNumber}
            playerStartTime={playerStartTime}
            onNavigateHome={navigateToHome}
            onNavigateToPlayer={navigateToPlayer}
            openMembershipUpsell={openMembershipUpsell}
            has_membership={user?.hasMembership || false}
          />
        );
      case 'search':
        return <SearchScreen onNavigateToPlayer={navigateToPlayer} onNavigateToForYou={navigateToForYou} />;
      case 'myList':
        return <MyListScreen onNavigateToPlayer={navigateToPlayer} />;
      case 'profile':
        return (
          <ProfileScreen
            onNavigateToLogin={navigateToLogin}
            onNavigateToSettings={navigateToSettings}
            onNavigateToMyWallet={navigateToMyWallet}
            onNavigateToRewards={navigateToRewards}
            onNavigateToHistory={navigateToHistory}
            onNavigateToDownloads={navigateToDownloads}
            onNavigateToLanguage={navigateToLanguage}
            onNavigateToManageMembership={navigateToManageMembership}
            onNavigateToHelpFeedback={navigateToHelpFeedback}
            onNavigateToAbout={navigateToAbout}
            onNavigateToNotifications={navigateToNotifications}
            onNavigateToStore={navigateToStore}
            onCopyId={handleCopyId}
          />
        );
      case 'login':
        return <LoginScreen onNavigateHome={navigateToHome} />;
      case 'store':
        return <StoreScreen onNavigateBack={navigateToProfile} onNavigateToTerms={navigateToTerms} />;
      case 'rewards':
        return <RewardsScreen onNavigateToPointsHistory={navigateToPointsHistory} />;
      case 'termsOfUse':
        return <TermsOfUseScreen onNavigateBack={navigateToProfile} />;
      case 'pointsHistory':
        return <DetailedPointsHistoryScreen onNavigateBack={navigateToRewards} />;
      case 'history':
        return (
          <HistoryScreen
            onNavigateBack={navigateToProfile}
            onNavigateToPlayer={navigateToPlayer}
          />
        );
      case 'myWallet':
        return (
          <MyWalletScreen
            onNavigateBack={navigateToProfile}
            onNavigateToTransactionHistory={navigateToTransactionHistory}
            onNavigateToRewardCoinsHistory={navigateToRewardCoinsHistory}
            onNavigateToConsumptionRecords={navigateToConsumptionRecords}
            onNavigateToStore={navigateToStore}
          />
        );
      case 'transactionHistory':
        return <TransactionHistoryScreen onNavigateBack={navigateToMyWallet} />;
      case 'rewardCoinsHistory':
        return <RewardCoinsHistoryScreen onNavigateBack={navigateToMyWallet} />;
      case 'consumptionRecords':
        return <ConsumptionRecordsScreen onNavigateBack={navigateToMyWallet} />;
      case 'language':
        return (
          <LanguageScreen
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onNavigateBack={navigateToProfile}
          />
        );
      case 'downloads':
        return <DownloadsScreen cacheSizeMB={cacheSizeMB} onNavigateBack={navigateToProfile} />;
      case 'settings':
        return (
          <SettingsScreen
            onNavigateBack={navigateToProfile}
            onNavigateToAccountDeletion={navigateToAccountDeletion}
          />
        );
      case 'manageMembership':
        return <ManageMembershipScreen onNavigateBack={navigateToProfile} />;
      case 'accountDeletion':
        return <AccountDeletionScreen onNavigateBack={navigateToSettings} />;
      case 'about':
        return <AboutScreen onNavigateBack={navigateToProfile} onNavigateToTerms={navigateToTerms} />;
      case 'helpFeedback':
        return <HelpFeedbackScreen onNavigateBack={navigateToProfile} />;
      case 'notifications':
        return <NotificationsScreen onNavigateBack={navigateToProfile} />;
      default:
        return (
          <HomeScreen
            onNavigateToPlayer={navigateToPlayer}
            onNavigateToSearch={navigateToSearch}
          />
        );
    }
  };

  // Hide bottom nav on certain screens
  const shouldShowBottomNav = ![
    'player',
    'login',
    'termsOfUse',
    'pointsHistory',
    'transactionHistory',
    'rewardCoinsHistory',
    'consumptionRecords',
    'settings',
    'accountDeletion',
    'about',
    'helpFeedback',
    'notifications',
  ].includes(currentView);

  return (
    <I18nextProvider i18n={i18n}>
      <TooltipProvider>
        <div className="h-screen overflow-hidden bg-background">
          {renderScreen()}
          {shouldShowBottomNav && (
            <BottomNavBar
              currentView={currentView}
              onNavigateHome={navigateToHome}
              onNavigateForYou={navigateToForYou}
              onNavigateMyList={navigateToMyList}
              onNavigateProfile={navigateToProfile}
            />
          )}
          
          {/* Copied Toast */}
          {showCopiedToast && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-card border border-border rounded-lg px-6 py-3 shadow-lg">
                <p className="text-sm font-medium text-foreground">Copied</p>
              </div>
            </div>
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </I18nextProvider>
  );
}

function App() {
  // Apply dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  Trophy, 
  ChevronRight, 
  Info,
  Sparkles,
  Calendar,
  Play,
  Youtube,
  ShoppingCart,
  CheckCircle2,
  Circle,
  Lock
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface RewardsScreenProps {
  onNavigateToPointsHistory: () => void;
  onNavigateToStore: () => void;
  setShowToastMessage: (message: string) => void;
  userId: string;
}

interface User {
  id: string;
  email: string;
  coins: number;
  rewardCoins: number;
  points: number;
  hasMembership: boolean;
  checkInStreak: number;
  lastCheckInDate: string | null;
  adsWatchedToday: number;
}

interface RedeemableItem {
  id: string;
  title: string;
  pointsCost: number;
  rewardType: string;
  rewardValue: number;
}

interface UserTask {
  id: string;
  userId: string;
  taskIdString: string;
}

export default function RewardsScreen({ 
  onNavigateToPointsHistory, 
  onNavigateToStore,
  setShowToastMessage,
  userId 
}: RewardsScreenProps) {
  const [activeTab, setActiveTab] = useState<'coins' | 'points'>('coins');
  const [showPointsRulesModal, setShowPointsRulesModal] = useState(false);
  const [showCoinsRulesModal, setShowCoinsRulesModal] = useState(false);
  const [showMembershipSheet, setShowMembershipSheet] = useState(false);
  const [hasFollowedYoutube, setHasFollowedYoutube] = useState(false);
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  const { data: redeemableItems = [], isLoading: itemsLoading } = useQuery<RedeemableItem[]>({
    queryKey: ['/api/redeemable-items'],
  });

  const { data: userTasks = [] } = useQuery<UserTask[]>({
    queryKey: ['/api/user-tasks', userId],
    enabled: !!userId,
  });

  const isTaskCompleted = (taskId: string) => {
    return userTasks.some(task => task.taskIdString === taskId);
  };

  const handleClaimDailyPoints = async () => {
    if (!user?.hasMembership) {
      setShowToastMessage('Only members can claim this reward');
      return;
    }

    try {
      await apiRequest('POST', '/api/rewards/claim-daily-points', { userId });
      await queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: 'Success!',
        description: 'Daily points claimed successfully',
      });
    } catch (error: any) {
      setShowToastMessage(error.message || 'Failed to claim daily points');
    }
  };

  const handleRedeemItem = async (itemId: string, pointsCost: number) => {
    if (!user?.hasMembership) {
      setShowToastMessage('Only members can claim this reward');
      return;
    }

    if ((user?.points || 0) < pointsCost) {
      setShowToastMessage('Not enough points to redeem this item');
      return;
    }

    try {
      await apiRequest('POST', '/api/rewards/redeem-item', { userId, itemId });
      await queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: 'Success!',
        description: 'Item redeemed successfully',
      });
    } catch (error: any) {
      setShowToastMessage(error.message || 'Failed to redeem item');
    }
  };

  const handleDailyCheckIn = async () => {
    try {
      await apiRequest('POST', '/api/rewards/daily-check-in', { userId });
      await queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: 'Success!',
        description: 'Daily check-in completed!',
      });
    } catch (error: any) {
      setShowToastMessage(error.message || 'Failed to check in');
    }
  };

  const handleTaskComplete = async (taskId: string, reward: number) => {
    try {
      await apiRequest('POST', '/api/rewards/complete-task', { userId, taskId, reward });
      await queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      await queryClient.invalidateQueries({ queryKey: ['/api/user-tasks', userId] });
      toast({
        title: 'Success!',
        description: `You earned ${reward} reward coins!`,
      });
    } catch (error: any) {
      setShowToastMessage(error.message || 'Failed to complete task');
    }
  };

  const handleWatchAd = async () => {
    // Simulate ad watch (in production, integrate actual ad SDK)
    if ((user?.adsWatchedToday || 0) >= 15) {
      setShowToastMessage('Daily ad limit reached. Come back tomorrow!');
      return;
    }

    try {
      await apiRequest('POST', '/api/rewards/watch-ad', { userId });
      await queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: 'Success!',
        description: 'You earned 10 reward coins!',
      });
    } catch (error: any) {
      setShowToastMessage(error.message || 'Failed to watch ad');
    }
  };

  const handleFollowYoutube = () => {
    window.open('https://www.youtube.com/@afrishorts', '_blank');
    setHasFollowedYoutube(true);
  };

  const canClaimDailyPoints = () => {
    if (!user?.lastCheckInDate) return true;
    const lastClaim = new Date(user.lastCheckInDate);
    const today = new Date();
    return lastClaim.toDateString() !== today.toDateString();
  };

  const canCheckIn = () => {
    if (!user?.lastCheckInDate) return true;
    const lastCheckIn = new Date(user.lastCheckInDate);
    const today = new Date();
    return lastCheckIn.toDateString() !== today.toDateString();
  };

  const getCheckInDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      days.push({
        day: i,
        completed: i <= (user?.checkInStreak || 0),
        reward: i === 7 ? 50 : 10,
      });
    }
    return days;
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#111111]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111111] overflow-y-auto pb-20">
      {/* Tab Bar */}
      <div className="sticky top-0 z-10 bg-[#1A1A1A] border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'coins'
                ? 'text-white border-b-2 border-gradient-to-r from-[#FF4E50] to-[#F9D423]'
                : 'text-gray-400'
            }`}
            data-testid="tab-reward-coins"
          >
            <span className={activeTab === 'coins' ? 'bg-gradient-to-r from-[#FF4E50] to-[#F9D423] bg-clip-text text-transparent' : ''}>
              Reward coins
            </span>
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'points'
                ? 'text-white border-b-2 border-gradient-to-r from-[#FF4E50] to-[#F9D423]'
                : 'text-gray-400'
            }`}
            data-testid="tab-member-points"
          >
            <span className={activeTab === 'points' ? 'bg-gradient-to-r from-[#FF4E50] to-[#F9D423] bg-clip-text text-transparent' : ''}>
              Member Points
            </span>
          </button>
        </div>
      </div>

      {/* Member Points Tab */}
      {activeTab === 'points' && (
        <div className="flex-1">
          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <button
              onClick={onNavigateToPointsHistory}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              data-testid="button-points-history"
            >
              <span className="text-sm">[Points]</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowPointsRulesModal(true)}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              data-testid="button-points-rules"
            >
              <Info className="h-4 w-4" />
              <span className="text-sm">Rules</span>
            </button>
          </div>

          {/* Points Balance */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-[#FF4E50] to-[#F9D423] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-8 w-8 text-white" />
                <span className="text-4xl font-bold text-white">{user?.points || 0}</span>
              </div>
              <p className="text-sm text-white/90">Your Points Balance</p>
            </div>
          </div>

          {/* Daily Points */}
          <div className="px-4 pb-6">
            <h3 className="text-lg font-bold text-white mb-4">Daily points</h3>
            <div className="bg-[#1A1A1A] rounded-lg p-6 text-center border border-gray-800">
              <div className="mb-4">
                <Gift className="h-16 w-16 mx-auto text-[#F9D423]" />
              </div>
              <p className="text-white mb-4">Claim your daily points reward!</p>
              <Button
                onClick={handleClaimDailyPoints}
                disabled={!canClaimDailyPoints() || !user?.hasMembership}
                className={`w-full ${
                  !canClaimDailyPoints() || !user?.hasMembership
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90'
                }`}
                data-testid="button-claim-daily-points"
              >
                {!canClaimDailyPoints() ? 'Already Claimed Today' : 'Claim Points'}
              </Button>
            </div>
          </div>

          {/* Redeem Points */}
          <div className="px-4 pb-6">
            <h3 className="text-lg font-bold text-white mb-4">Redeem Points</h3>
            {itemsLoading ? (
              <div className="text-gray-400 text-center">Loading items...</div>
            ) : (
              <div className="space-y-3">
                {redeemableItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800"
                    data-testid={`item-${item.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-sm text-[#F9D423]">{item.pointsCost} points</p>
                      </div>
                      <Sparkles className="h-6 w-6 text-[#F9D423]" />
                    </div>
                    <Button
                      onClick={() => handleRedeemItem(item.id, item.pointsCost)}
                      disabled={(user?.points || 0) < item.pointsCost || !user?.hasMembership}
                      className={`w-full ${
                        (user?.points || 0) < item.pointsCost || !user?.hasMembership
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90'
                      }`}
                      data-testid={`button-redeem-${item.id}`}
                    >
                      Redeem
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upsell Section */}
          <div className="px-4 pb-6">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg p-6 border border-yellow-400">
              <h3 className="text-white font-bold text-lg mb-2">Become a member</h3>
              <p className="text-white/90 text-sm mb-4">
                Unlock exclusive rewards and benefits
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onNavigateToStore}
                  className="text-white text-sm flex items-center gap-1 hover:opacity-80"
                  data-testid="link-store-detail"
                >
                  Detail
                  <ChevronRight className="h-4 w-4" />
                </button>
                <Button
                  onClick={() => setShowMembershipSheet(true)}
                  className="flex-1 bg-white text-yellow-600 hover:bg-gray-100"
                  data-testid="button-join-now"
                >
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Coins Tab */}
      {activeTab === 'coins' && (
        <div className="flex-1">
          {/* Header with Rules */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#F9D423]" />
              <span className="text-lg font-bold text-white">{user?.rewardCoins || 0}</span>
              <span className="text-sm text-gray-400">Reward Coins</span>
            </div>
            <button
              onClick={() => setShowCoinsRulesModal(true)}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              data-testid="button-coins-rules"
            >
              <Info className="h-4 w-4" />
              <span className="text-sm">Rules</span>
            </button>
          </div>

          {/* Daily Check-in */}
          <div className="px-4 py-6">
            <h3 className="text-lg font-bold text-white mb-4">Daily Check-in</h3>
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {getCheckInDays().map((day) => (
                  <div
                    key={day.day}
                    className={`flex flex-col items-center p-2 rounded ${
                      day.completed
                        ? 'bg-gradient-to-r from-[#FF4E50] to-[#F9D423]'
                        : 'bg-gray-800'
                    }`}
                    data-testid={`checkin-day-${day.day}`}
                  >
                    <span className="text-xs text-white mb-1">Day {day.day}</span>
                    {day.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-600" />
                    )}
                    <span className="text-xs text-white mt-1">+{day.reward}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleDailyCheckIn}
                disabled={!canCheckIn()}
                className={`w-full ${
                  !canCheckIn()
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90'
                }`}
                data-testid="button-check-in"
              >
                {!canCheckIn() ? 'Already Checked In Today' : 'Check-in'}
              </Button>
            </div>
          </div>

          {/* Earn Rewards Tasks */}
          <div className="px-4 pb-6">
            <h3 className="text-lg font-bold text-white mb-4">Earn Rewards</h3>
            <div className="space-y-3">
              {/* Login Task */}
              <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800" data-testid="task-login">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isTaskCompleted('login') ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-600" />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">Login with any account</h4>
                      <p className="text-sm text-[#F9D423]">+20 coins</p>
                    </div>
                  </div>
                  {!isTaskCompleted('login') && (
                    <Button
                      onClick={() => handleTaskComplete('login', 20)}
                      size="sm"
                      className="bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90"
                      data-testid="button-claim-login"
                    >
                      Claim
                    </Button>
                  )}
                </div>
              </div>

              {/* Push Notification Task */}
              <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800" data-testid="task-notifications">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isTaskCompleted('push_notification') ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-600" />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">Turn push notification</h4>
                      <p className="text-sm text-[#F9D423]">+30 coins</p>
                    </div>
                  </div>
                  {!isTaskCompleted('push_notification') && (
                    <Button
                      onClick={() => handleTaskComplete('push_notification', 30)}
                      size="sm"
                      className="bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90"
                      data-testid="button-claim-notifications"
                    >
                      Claim
                    </Button>
                  )}
                </div>
              </div>

              {/* Watch Video Task */}
              <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800" data-testid="task-watch-video">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-[#F9D423]" />
                    <div>
                      <h4 className="text-white font-semibold">
                        Watch a video to earn coins ({user?.adsWatchedToday || 0}/15)
                      </h4>
                      <p className="text-sm text-[#F9D423]">+10 coins per video</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleWatchAd}
                    disabled={(user?.adsWatchedToday || 0) >= 15}
                    size="sm"
                    className="bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90"
                    data-testid="button-watch-video"
                  >
                    Watch
                  </Button>
                </div>
              </div>

              {/* YouTube Task */}
              <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800" data-testid="task-youtube">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isTaskCompleted('follow_youtube') || hasFollowedYoutube ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Youtube className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">Follow on YouTube</h4>
                      <p className="text-sm text-[#F9D423]">+50 coins</p>
                    </div>
                  </div>
                  {!isTaskCompleted('follow_youtube') && (
                    <div className="flex gap-2">
                      {hasFollowedYoutube && (
                        <Button
                          onClick={() => handleTaskComplete('follow_youtube', 50)}
                          size="sm"
                          className="bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90"
                          data-testid="button-claim-youtube"
                        >
                          Claim
                        </Button>
                      )}
                      <Button
                        onClick={handleFollowYoutube}
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-white hover:bg-gray-800"
                        data-testid="button-follow-youtube"
                      >
                        Follow
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Get More Coins */}
              <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800" data-testid="task-get-more">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-[#F9D423]" />
                    <div>
                      <h4 className="text-white font-semibold">Get more coins</h4>
                      <p className="text-sm text-gray-400">Purchase coins from the store</p>
                    </div>
                  </div>
                  <Button
                    onClick={onNavigateToStore}
                    size="sm"
                    className="bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90"
                    data-testid="button-go-store"
                  >
                    Go
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Points Rules Modal */}
      <Dialog open={showPointsRulesModal} onOpenChange={setShowPointsRulesModal}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Member Points Rules</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-300">
            <p>• Member Points can be earned by completing daily tasks and watching content</p>
            <p>• Points can be redeemed for exclusive rewards and membership extensions</p>
            <p>• Only active members can claim daily points and redeem rewards</p>
            <p>• Points do not expire as long as your membership is active</p>
            <p>• Daily point claims reset every 24 hours</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reward Coins Rules Modal */}
      <Dialog open={showCoinsRulesModal} onOpenChange={setShowCoinsRulesModal}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Reward Coins Rules</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-300">
            <p>• Reward Coins are earned through daily check-ins, watching ads, and completing tasks</p>
            <p>• Check in daily to build your streak and earn bonus coins on day 7</p>
            <p>• Watch up to 15 rewarded videos per day to earn coins</p>
            <p>• Reward Coins can be used to unlock episodes before using paid coins</p>
            <p>• Coins do not expire and accumulate over time</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Membership Bottom Sheet */}
      <Sheet open={showMembershipSheet} onOpenChange={setShowMembershipSheet}>
        <SheetContent 
          side="bottom" 
          className="bg-[#1A1A1A] border-t border-gray-800 rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle className="text-white text-center">Join Membership</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {/* Weekly Plan */}
            <div className="bg-[#111111] rounded-lg p-4 border-2 border-[#F9D423]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold">Weekly Plan</h3>
                <span className="text-[#F9D423] font-bold">₵15/week</span>
              </div>
              <p className="text-sm text-gray-400">Full access to all content</p>
            </div>

            {/* Yearly Plan */}
            <div className="bg-[#111111] rounded-lg p-4 border-2 border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold">Yearly Plan</h3>
                <span className="text-white font-bold">₵150/year</span>
              </div>
              <p className="text-sm text-gray-400">Save 17% with annual billing</p>
            </div>

            {/* Benefits */}
            <div className="bg-[#111111] rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Membership Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Unlimited access to all episodes</li>
                <li>✓ Claim daily points rewards</li>
                <li>✓ Redeem exclusive items</li>
                <li>✓ Ad-free viewing experience</li>
                <li>✓ Early access to new releases</li>
              </ul>
            </div>

            <Button
              onClick={onNavigateToStore}
              className="w-full bg-gradient-to-r from-[#FF4E50] to-[#F9D423] hover:opacity-90 text-white py-6"
              data-testid="button-membership-purchase"
            >
              Continue to Payment
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

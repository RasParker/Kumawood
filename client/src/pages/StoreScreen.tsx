import { useState } from 'react';
import { Coins, CreditCard, Gift, Sparkles, Crown, Check, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoreScreenProps {
  onNavigateBack: () => void;
  onNavigateToTerms: () => void;
}

export default function StoreScreen({ onNavigateBack, onNavigateToTerms }: StoreScreenProps) {
  const [selectedMembershipPlan, setSelectedMembershipPlan] = useState<'weekly' | 'yearly'>('weekly');

  const coinPackages = [
    { coins: 100, price: 20, bonus: 100, popular: false },
    { coins: 300, price: 50, bonus: 0, popular: false },
    { coins: 500, price: 90, bonus: 50, popular: true },
    { coins: 1000, price: 170, bonus: 150, popular: false },
  ];

  const membershipPlans = {
    weekly: {
      price: 15,
      period: 'Week',
    },
    yearly: {
      price: 150,
      period: 'Year',
      savings: '₵30',
    },
  };

  const membershipBenefits = [
    { icon: Crown, text: 'Unlimited access to all episodes' },
    { icon: Sparkles, text: 'Ad-free viewing experience' },
    { icon: Gift, text: 'Exclusive member-only content' },
    { icon: Coins, text: 'Weekly bonus coins' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-background border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            data-testid="button-back"
            className="hover-elevate active-elevate-2"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Store</h1>
        </div>
        <button
          data-testid="button-restore"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Restore
        </button>
      </div>

      {/* Current Balance */}
      <div className="p-4">
        <div className="p-6 bg-gradient-to-r from-primary to-accent rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-6 w-6 text-primary-foreground" />
            <span className="text-3xl font-bold text-primary-foreground">0</span>
          </div>
          <p className="text-sm text-primary-foreground/90">Your Coin Balance</p>
        </div>
      </div>

      {/* Coin Packages Section */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Coins className="h-5 w-5" />
          COINS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {coinPackages.map((pkg, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg ${
                pkg.popular
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary'
                  : 'bg-card border border-border'
              }`}
              data-testid={`card-coin-package-${index}`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-primary-foreground">
                  Popular
                </div>
              )}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{pkg.coins}</span>
                </div>
                {pkg.bonus > 0 && (
                  <div className="flex items-center justify-center gap-1 text-xs text-primary">
                    <Gift className="h-3 w-3" />
                    <span>+{pkg.bonus} bonus</span>
                  </div>
                )}
                <div className="text-xl font-bold text-foreground">₵{pkg.price}</div>
                <Button
                  data-testid={`button-buy-coins-${index}`}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
                  size="sm"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Section */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          MEMBERSHIP
        </h2>

        {/* Weekly/Yearly Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedMembershipPlan('weekly')}
            data-testid="button-plan-weekly"
            className={`flex-1 p-3 rounded-lg font-semibold transition-all ${
              selectedMembershipPlan === 'weekly'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setSelectedMembershipPlan('yearly')}
            data-testid="button-plan-yearly"
            className={`flex-1 p-3 rounded-lg font-semibold transition-all relative ${
              selectedMembershipPlan === 'yearly'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            Yearly
            {membershipPlans.yearly.savings && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                Save {membershipPlans.yearly.savings}
              </span>
            )}
          </button>
        </div>

        {/* Selected Plan Info */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Premium Membership
              </h3>
              <p className="text-sm text-muted-foreground">
                {membershipPlans[selectedMembershipPlan].period}ly Access
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ₵{membershipPlans[selectedMembershipPlan].price}
              </div>
              <div className="text-xs text-muted-foreground">
                per {membershipPlans[selectedMembershipPlan].period.toLowerCase()}
              </div>
            </div>
          </div>

          <Button
            data-testid="button-buy-membership"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
          >
            Subscribe Now
          </Button>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 mb-4">
          <p className="text-sm font-semibold text-foreground">Benefits:</p>
          {membershipBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-sm text-foreground"
                data-testid={`text-benefit-${index}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span>{benefit.text}</span>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">
            <strong>Tips:</strong>
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Subscriptions auto-renew unless cancelled</li>
            <li>• Cancel anytime from Account Settings</li>
            <li>
              • By subscribing, you agree to our{' '}
              <button
                onClick={onNavigateToTerms}
                data-testid="link-terms"
                className="text-primary hover:underline"
              >
                Terms of Use
              </button>
              {' '}and{' '}
              <button
                onClick={onNavigateToTerms}
                data-testid="link-privacy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Special Offers */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Special Offers</h2>
        <div className="p-4 bg-gradient-to-r from-card to-muted rounded-lg border border-primary/30">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                First Purchase Bonus
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Get 100% extra coins on your first purchase!
              </p>
              <Button
                data-testid="button-special-offer"
                variant="outline"
                size="sm"
                className="rounded-full hover-elevate active-elevate-2"
              >
                Claim Offer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

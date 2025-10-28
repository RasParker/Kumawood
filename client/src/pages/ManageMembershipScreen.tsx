import { ChevronLeft, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ManageMembershipScreenProps {
  onNavigateBack: () => void;
}

export default function ManageMembershipScreen({ onNavigateBack }: ManageMembershipScreenProps) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'Forever',
      features: ['Limited episodes', 'Ads supported', 'Standard quality'],
      current: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: 'month',
      features: ['Unlimited episodes', 'Ad-free experience', 'HD quality', 'Download episodes', 'Early access'],
      current: false,
      popular: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 19.99,
      period: 'month',
      features: ['All Premium features', '4K quality', 'Priority support', 'Exclusive content', 'Family sharing'],
      current: false,
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
        <h1 className="text-xl font-bold text-foreground">Manage Membership</h1>
      </div>

      {/* Current Plan */}
      <div className="p-4">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Current Plan</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Free</h2>
          <p className="text-xs text-muted-foreground mt-1">Enjoying AfriShorts</p>
        </div>
      </div>

      {/* Available Plans */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">Available Plans</h2>
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-5 rounded-lg ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary'
                  : 'bg-card border border-border'
              }`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
                {plan.current && (
                  <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary">
                    Current
                  </div>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {!plan.current && (
                <Button
                  data-testid={`button-subscribe-${plan.id}`}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
                >
                  Upgrade to {plan.name}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Coins, CreditCard, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StoreScreen() {
  const coinPackages = [
    { coins: 100, price: 0.99, bonus: 0, popular: false },
    { coins: 500, price: 4.99, bonus: 50, popular: true },
    { coins: 1000, price: 9.99, bonus: 150, popular: false },
    { coins: 2500, price: 19.99, bonus: 500, popular: false },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-background border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Store</h1>
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

      {/* Coin Packages */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Buy Coins</h2>
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
                <div className="text-xl font-bold text-foreground">${pkg.price}</div>
                <Button
                  data-testid={`button-buy-${index}`}
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

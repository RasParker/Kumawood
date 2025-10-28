import { ChevronLeft, Heart, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutScreenProps {
  onNavigateBack: () => void;
  onNavigateToTerms: () => void;
}

export default function AboutScreen({ onNavigateBack, onNavigateToTerms }: AboutScreenProps) {
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
        <h1 className="text-xl font-bold text-foreground">About</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Logo/Brand */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AfriShorts
          </h2>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
        </div>

        {/* Mission */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Our Mission</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            AfriShorts brings you the best African micro-dramas, celebrating the rich diversity of
            African storytelling. We're committed to showcasing authentic stories from across the
            continent.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Global Access
              </h4>
              <p className="text-xs text-muted-foreground">
                Watch African stories from anywhere in the world
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Safe & Secure
              </h4>
              <p className="text-xs text-muted-foreground">
                Your privacy and security are our top priorities
              </p>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="space-y-2">
          <button
            onClick={onNavigateToTerms}
            data-testid="link-terms"
            className="w-full p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
          >
            <span className="text-sm font-medium text-foreground">Terms of Use</span>
          </button>
          <button
            data-testid="link-privacy"
            className="w-full p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
          >
            <span className="text-sm font-medium text-foreground">Privacy Policy</span>
          </button>
          <button
            data-testid="link-licenses"
            className="w-full p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
          >
            <span className="text-sm font-medium text-foreground">Open Source Licenses</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 AfriShorts. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for Africa</p>
        </div>
      </div>
    </div>
  );
}

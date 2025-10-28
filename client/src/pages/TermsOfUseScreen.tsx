import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsOfUseScreenProps {
  onNavigateBack: () => void;
}

export default function TermsOfUseScreen({ onNavigateBack }: TermsOfUseScreenProps) {
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
        <h1 className="text-xl font-bold text-foreground">Terms of Use</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-sm text-muted-foreground space-y-4">
          <p className="text-foreground font-semibold">Last updated: October 2025</p>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AfriShorts, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Use License</h2>
            <p>
              Permission is granted to temporarily stream materials on AfriShorts for personal,
              non-commercial transitory viewing only.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. User Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password.
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Content</h2>
            <p>
              All content provided on AfriShorts is for informational and entertainment purposes only.
              We make no representations or warranties of any kind about the completeness or accuracy.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">5. Prohibited Uses</h2>
            <p>
              You may not use AfriShorts to violate any applicable laws, regulations, or third-party
              rights, including intellectual property rights.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">6. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to AfriShorts immediately,
              without prior notice, under our sole discretion, for any reason.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any
              changes by posting the new Terms of Use on this page.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@afrishorts.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

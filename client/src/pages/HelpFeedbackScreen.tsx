import { ChevronLeft, MessageSquare, Mail, HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface HelpFeedbackScreenProps {
  onNavigateBack: () => void;
}

export default function HelpFeedbackScreen({ onNavigateBack }: HelpFeedbackScreenProps) {
  const faqs = [
    { id: 1, question: 'How do I earn coins?', answer: 'Complete daily tasks, achievements, and watch episodes.' },
    { id: 2, question: 'Can I download episodes?', answer: 'Yes, Premium and VIP members can download episodes for offline viewing.' },
    { id: 3, question: 'How do I change my language?', answer: 'Go to Profile > Language to select your preferred language.' },
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
        <h1 className="text-xl font-bold text-foreground">Help & Feedback</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Contact Options */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Contact Us</h2>
          <button
            data-testid="button-email"
            className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
          >
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Email Support</div>
              <div className="text-xs text-muted-foreground">support@afrishorts.com</div>
            </div>
          </button>

          <button
            data-testid="button-chat"
            className="w-full flex items-center gap-3 p-4 bg-card rounded-lg hover-elevate active-elevate-2 text-left"
          >
            <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Live Chat</div>
              <div className="text-xs text-muted-foreground">Available 24/7</div>
            </div>
          </button>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="p-4 bg-card rounded-lg border border-border"
                data-testid={`faq-${faq.id}`}
              >
                <summary className="text-sm font-medium text-foreground cursor-pointer">
                  {faq.question}
                </summary>
                <p className="text-xs text-muted-foreground mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Send Feedback</h2>
          <div className="p-4 bg-card rounded-lg border border-border space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-foreground">
                Your Feedback
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think..."
                data-testid="input-feedback"
                className="min-h-[120px] bg-background border-border"
              />
            </div>
            <Button
              data-testid="button-send-feedback"
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

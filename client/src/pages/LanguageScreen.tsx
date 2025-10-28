import { ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LanguageScreenProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
}

export default function LanguageScreen({
  currentLanguage,
  onLanguageChange,
  onNavigateBack,
}: LanguageScreenProps) {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
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
        <h1 className="text-xl font-bold text-foreground">Language</h1>
      </div>

      {/* Language List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {languages.map((language) => {
          const isSelected = currentLanguage === language.code;
          return (
            <button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              data-testid={`button-language-${language.code}`}
              className={`w-full flex items-center justify-between p-4 rounded-lg hover-elevate active-elevate-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary'
                  : 'bg-card border border-border'
              }`}
            >
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">{language.name}</div>
                <div className="text-xs text-muted-foreground">{language.nativeName}</div>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

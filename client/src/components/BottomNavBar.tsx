import { Home, Sparkles, Bookmark, User } from 'lucide-react';

interface BottomNavBarProps {
  currentView: string;
  onNavigateHome: () => void;
  onNavigateForYou: () => void;
  onNavigateMyList: () => void;
  onNavigateProfile: () => void;
}

export default function BottomNavBar({
  currentView,
  onNavigateHome,
  onNavigateForYou,
  onNavigateMyList,
  onNavigateProfile,
}: BottomNavBarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, onClick: onNavigateHome, testId: 'nav-home' },
    { id: 'forYou', label: 'For You', icon: Sparkles, onClick: onNavigateForYou, testId: 'nav-for-you' },
    { id: 'myList', label: 'My List', icon: Bookmark, onClick: onNavigateMyList, testId: 'nav-my-list' },
    { id: 'profile', label: 'Profile', icon: User, onClick: onNavigateProfile, testId: 'nav-profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              data-testid={item.testId}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 hover-elevate active-elevate-2 transition-all"
            >
              <div className={`relative ${isActive ? 'scale-110' : ''}`}>
                <Icon
                  className={`h-6 w-6 transition-all ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

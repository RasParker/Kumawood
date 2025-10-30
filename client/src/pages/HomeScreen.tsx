import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PopularTabComponent from '@/components/tabs/PopularTabComponent';
import NewTabComponent from '@/components/tabs/NewTabComponent';
import RankingsTabComponent from '@/components/tabs/RankingsTabComponent';
import KumawoodTabComponent from '@/components/tabs/KumawoodTabComponent';
import NaijaTabComponent from '@/components/tabs/NaijaTabComponent';

interface HomeScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number, startTime?: number) => void;
  onNavigateToSearch: () => void;
}

type TabType = 'Popular' | 'New' | 'Rankings' | 'Kumawood' | 'Naija';

export default function HomeScreen({ onNavigateToPlayer, onNavigateToSearch }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Popular');

  const tabs: TabType[] = ['Popular', 'New', 'Rankings', 'Kumawood', 'Naija'];

  const handleNavigateToPlayer = (seriesId: string, episodeNumber: number, startTime: number) => {
    onNavigateToPlayer(seriesId, episodeNumber, startTime);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Popular':
        return <PopularTabComponent navigateToPlayer={handleNavigateToPlayer} />;
      case 'New':
        return <NewTabComponent navigateToPlayer={handleNavigateToPlayer} />;
      case 'Rankings':
        return <RankingsTabComponent navigateToPlayer={handleNavigateToPlayer} />;
      case 'Kumawood':
        return <KumawoodTabComponent navigateToPlayer={handleNavigateToPlayer} />;
      case 'Naija':
        return <NaijaTabComponent navigateToPlayer={handleNavigateToPlayer} />;
      default:
        return <PopularTabComponent navigateToPlayer={handleNavigateToPlayer} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center p-4">
          <div 
            onClick={onNavigateToSearch}
            className="flex-1 flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2 cursor-pointer hover-elevate active-elevate-2"
            data-testid="button-search"
          >
            <SearchIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Search series, genres...</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-6 px-4 pb-3 overflow-x-auto scrollbar-hide border-b border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab.toLowerCase()}`}
              className={`flex-shrink-0 pb-2 text-base font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}

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
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AfriShorts
          </h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={onNavigateToSearch}
            data-testid="button-search"
            className="hover-elevate active-elevate-2"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab.toLowerCase()}`}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all hover-elevate active-elevate-2 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-105'
                  : 'bg-card text-foreground border border-border'
              }`}
            >
              {tab}
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

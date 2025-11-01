import { Search as SearchIcon, X, ArrowLeft, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RankingsList from '@/components/RankingsList';
import type { Series } from '@shared/schema';

interface SearchScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
  onNavigateToForYou?: () => void;
}

export default function SearchScreen({ onNavigateToPlayer, onNavigateToForYou }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: trendingSeries = [], isLoading: isLoadingTrending } = useQuery<Series[]>({
    queryKey: ['/api/series/trending?limit=10'],
    enabled: !searchQuery,
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<Series[]>({
    queryKey: [`/api/series/search?q=${encodeURIComponent(searchQuery)}`],
    enabled: !!searchQuery && searchQuery.length >= 2,
  });

  const handleSeriesClick = (seriesId: string) => {
    onNavigateToPlayer(seriesId, 1);
  };

  const displayResults = searchQuery ? searchResults : [];
  const showTrending = !searchQuery;

  return (
    <div className="flex flex-col h-full bg-background pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center p-4 gap-3">
          {onNavigateToForYou && (
            <button
              onClick={onNavigateToForYou}
              data-testid="button-back"
              className="flex-shrink-0 hover-elevate active-elevate-2"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
          )}
          
          <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              type="search"
              placeholder="Search series, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
              className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSearchQuery('')}
                data-testid="button-clear-search"
                className="h-7 w-7 hover-elevate active-elevate-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showTrending ? (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Trending Searches</h2>
            </div>
            
            {isLoadingTrending ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="w-12 h-16 rounded bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trendingSeries.length > 0 ? (
              <RankingsList series={trendingSeries} onSeriesClick={handleSeriesClick} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No trending series available
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {isSearching
                ? 'Searching...'
                : `${displayResults.length} result${displayResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
            </h2>
            
            {isSearching ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : displayResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {displayResults.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => handleSeriesClick(series.id)}
                    className="cursor-pointer"
                    data-testid={`card-search-result-${series.id}`}
                  >
                    <div className="relative aspect-[9/16] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2">
                      {series.posterUrl ? (
                        <img
                          src={series.posterUrl}
                          alt={series.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-card" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {series.genre && (
                          <div className="text-xs font-semibold text-primary mb-1">
                            {series.genre}
                          </div>
                        )}
                        <h4 className="text-sm font-bold text-foreground line-clamp-2">
                          {series.title}
                        </h4>
                        {series.rating && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ⭐ {series.rating}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <SearchIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try searching with different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

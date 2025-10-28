import { Search as SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
}

export default function SearchScreen({ onNavigateToPlayer }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery
    ? [
        { id: '13', title: 'Lagos Love Story', genre: 'Romance', episodes: 67 },
        { id: '14', title: 'Love in the City', genre: 'Drama', episodes: 45 },
        { id: '15', title: 'Lover\'s Paradise', genre: 'Romance', episodes: 82 },
      ]
    : [];

  return (
    <div className="flex flex-col h-full bg-background pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-10 p-4 bg-background border-b border-border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search series, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
            className="pl-10 pr-10 bg-card border-border"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              data-testid="button-clear-search"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover-elevate active-elevate-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {searchResults.length} results for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((series) => (
                <div
                  key={series.id}
                  onClick={() => onNavigateToPlayer(series.id, 1)}
                  className="cursor-pointer"
                  data-testid={`card-search-result-${series.id}`}
                >
                  <div className="relative aspect-[9/16] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-xs font-semibold text-primary mb-1">
                        {series.genre}
                      </div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-2">
                        {series.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {series.episodes} Episodes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Search AfriShorts
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover amazing African micro-dramas. Search by title, genre, or theme.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

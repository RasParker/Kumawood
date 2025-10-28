import { useState } from 'react';
import { Play, Star } from 'lucide-react';
import { naijaSeries, naijaTags } from '@/data/mockData';

interface NaijaTabComponentProps {
  navigateToPlayer: (seriesId: string, episodeNumber: number, startTime: number) => void;
}

export default function NaijaTabComponent({ navigateToPlayer }: NaijaTabComponentProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredSeries = selectedTag === 'All'
    ? naijaSeries
    : naijaSeries.filter((series) => series.tags?.includes(selectedTag));

  return (
    <div className="space-y-4 p-4">
      {/* Filter Tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {naijaTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            data-testid={`filter-${tag.toLowerCase()}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all hover-elevate active-elevate-2 ${
              selectedTag === tag
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                : 'bg-card text-foreground border border-border'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredSeries.map((series) => (
          <div
            key={series.id}
            onClick={() => navigateToPlayer(series.id, 1, 0)}
            className="cursor-pointer group"
            data-testid={`series-${series.id}`}
          >
            <div className="relative aspect-[9/16] bg-card rounded-lg overflow-hidden hover-elevate active-elevate-2">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              
              {/* Rating */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs font-semibold text-foreground">{series.rating}</span>
              </div>

              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>

              {/* Episode Count */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-primary-foreground">
                {series.episodeCount} EP
              </div>

              {/* Title & Genre */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-sm font-bold text-foreground line-clamp-2 mb-1">
                  {series.title}
                </h4>
                <p className="text-xs text-muted-foreground">{series.genre}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSeries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No series found for this category</p>
        </div>
      )}
    </div>
  );
}

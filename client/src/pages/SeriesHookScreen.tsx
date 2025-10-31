import { useQuery } from '@tanstack/react-query';
import HookPlayer from '@/components/HookPlayer';
import type { Episode, Series } from '@shared/schema';
import { ChevronLeft } from 'lucide-react';

interface EpisodeWithSeries extends Episode {
  series: Series;
}

interface SeriesHookScreenProps {
  seriesId: string;
  onNavigateToPlayer: (seriesId: string, episodeNumber: number, startTime?: number) => void;
  onNavigateBack: () => void;
}

export default function SeriesHookScreen({ 
  seriesId, 
  onNavigateToPlayer,
  onNavigateBack 
}: SeriesHookScreenProps) {
  const userId = 'demo-user-id';

  const { data: episodeWithSeries, isLoading } = useQuery<EpisodeWithSeries>({
    queryKey: ['/api/series', seriesId, 'hook-episode'],
    enabled: !!seriesId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!episodeWithSeries) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-foreground">
        <div className="text-center">
          <p>Series not found</p>
          <button
            onClick={onNavigateBack}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            data-testid="button-back"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black relative">
      <button
        onClick={onNavigateBack}
        className="fixed top-4 left-4 z-50 text-white hover:bg-white/10 rounded-full p-2 transition-colors"
        data-testid="button-back-hook"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <HookPlayer
        episode={episodeWithSeries}
        series={episodeWithSeries.series}
        userId={userId}
        onNavigateToPlayer={onNavigateToPlayer}
        onNavigateToSearch={onNavigateBack}
      />
    </div>
  );
}

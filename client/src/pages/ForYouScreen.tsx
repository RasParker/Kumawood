import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import HookPlayer from '@/components/HookPlayer';
import type { EpisodeWithSeries } from '@shared/schema';

import 'swiper/css';

interface ForYouScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number, startTime?: number) => void;
  onNavigateToSearch: () => void;
}

export default function ForYouScreen({ onNavigateToPlayer, onNavigateToSearch }: ForYouScreenProps) {
  const userId = 'demo-user-id';

  const { data: episodesWithSeries = [], isLoading } = useQuery<EpisodeWithSeries[]>({
    queryKey: ['/api/episodes/random-first?limit=20'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Mousewheel, Keyboard]}
        className="h-full w-full"
        data-testid="for-you-swiper"
      >
        {episodesWithSeries.map((episode, index) => (
          <SwiperSlide key={episode.id} data-testid={`swiper-slide-${index}`}>
            <HookPlayer
              episode={episode}
              series={episode.series}
              userId={userId}
              onNavigateToPlayer={onNavigateToPlayer}
              onNavigateToSearch={onNavigateToSearch}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

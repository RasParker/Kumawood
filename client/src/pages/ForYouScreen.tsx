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
  const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

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
    <div className="h-full w-full bg-black relative">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onNavigateToSearch}
          data-testid="button-search"
          className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
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

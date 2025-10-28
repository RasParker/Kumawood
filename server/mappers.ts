import type { Series as DbSeries, Episode as DbEpisode, RedeemableItem as DbRedeemableItem } from '@shared/schema';

interface SupabaseSeries {
  id: string;
  title: string;
  synopsis: string;
  poster_url: string;
  is_coming_soon: boolean;
  release_date: string | null;
  genre: string | null;
  rating: number | null;
  year: number | null;
  tags: string[] | null;
  rank: number | null;
  is_new: boolean | null;
}

interface SupabaseEpisode {
  id: string;
  series_id: string;
  episode_number: number;
  title: string;
  video_url: string;
}

interface SupabaseRedeemableItem {
  id: string;
  title: string;
  points_cost: number;
  reward_type: string;
  reward_value: number;
}

export function mapSeriesToCamelCase(dbSeries: SupabaseSeries): DbSeries {
  return {
    id: dbSeries.id,
    title: dbSeries.title,
    synopsis: dbSeries.synopsis,
    posterUrl: dbSeries.poster_url,
    isComingSoon: dbSeries.is_coming_soon,
    releaseDate: dbSeries.release_date,
    genre: dbSeries.genre,
    rating: dbSeries.rating,
    year: dbSeries.year,
    tags: dbSeries.tags,
    rank: dbSeries.rank,
    isNew: dbSeries.is_new,
  };
}

export function mapEpisodeToCamelCase(dbEpisode: SupabaseEpisode): DbEpisode {
  return {
    id: dbEpisode.id,
    seriesId: dbEpisode.series_id,
    episodeNumber: dbEpisode.episode_number,
    title: dbEpisode.title,
    videoUrl: dbEpisode.video_url,
  };
}

export function mapRedeemableItemToCamelCase(dbItem: SupabaseRedeemableItem): DbRedeemableItem {
  return {
    id: dbItem.id,
    title: dbItem.title,
    pointsCost: dbItem.points_cost,
    rewardType: dbItem.reward_type,
    rewardValue: dbItem.reward_value,
  };
}

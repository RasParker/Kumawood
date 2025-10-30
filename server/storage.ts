import {
  type User,
  type InsertUser,
  type Series,
  type InsertSeries,
  type Episode,
  type InsertEpisode,
  type RedeemableItem,
  type InsertRedeemableItem,
  type WatchHistory,
  type InsertWatchHistory,
  type UserFollowing,
  type InsertUserFollowing,
  type EpisodeWithSeries,
} from "@shared/schema";
import { supabase } from "./supabase";
import { mapSeriesToCamelCase, mapEpisodeToCamelCase, mapRedeemableItemToCamelCase, mapSeries } from "./mappers";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllSeries(): Promise<Series[]>;
  getSeriesByCategory(category: string): Promise<Series[]>;
  getSeriesById(id: string): Promise<Series | undefined>;
  getPopularSeries(): Promise<Series[]>;
  getNewSeries(): Promise<Series[]>;
  getRankingSeries(): Promise<Series[]>;
  getKumawoodSeries(): Promise<Series[]>;
  getNaijaSeries(): Promise<Series[]>;
  getComingSoonSeries(): Promise<Series[]>;

  getEpisodesBySeriesId(seriesId: string): Promise<Episode[]>;
  getEpisodeBySeriesAndNumber(seriesId: string, episodeNumber: number): Promise<Episode | undefined>;
  getRandomFirstEpisodes(limit: number): Promise<EpisodeWithSeries[]>;

  getAllRedeemableItems(): Promise<RedeemableItem[]>;

  upsertWatchHistory(watchHistory: InsertWatchHistory): Promise<WatchHistory>;
  addUserFollowing(userFollowing: InsertUserFollowing): Promise<UserFollowing>;
  removeUserFollowing(userId: string, seriesId: string): Promise<void>;
  isUserFollowingSeries(userId: string, seriesId: string): Promise<boolean>;
  updateSeries(id: string, updates: Partial<Series>): Promise<Series>;
  deleteSeries(id: string): Promise<void>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create user: ${error?.message}`);
    }

    return data as User;
  }

  async getAllSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .order('title', { ascending: true });

    if (error) throw new Error(`Failed to fetch series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getSeriesByCategory(category: string): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .contains('tags', [category])
      .order('rating', { ascending: false });

    if (error) throw new Error(`Failed to fetch series by category: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getSeriesById(id: string): Promise<Series | undefined> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return mapSeriesToCamelCase(data);
  }

  async getPopularSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .is('rank', null)
      .eq('is_new', false)
      .order('rating', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to fetch popular series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getNewSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .eq('is_new', true)
      .order('year', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to fetch new series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getRankingSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .not('rank', 'is', null)
      .order('rank', { ascending: true })
      .limit(10);

    if (error) throw new Error(`Failed to fetch ranking series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getKumawoodSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .or('tags.cs.{Historical,Cultural}')
      .order('rating', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to fetch Kumawood series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getNaijaSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .or('tags.cs.{Urban,Business,Political}')
      .order('rating', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to fetch Naija series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getComingSoonSeries(): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', true)
      .order('release_date', { ascending: true });

    if (error) throw new Error(`Failed to fetch coming soon series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async getEpisodesBySeriesId(seriesId: string): Promise<Episode[]> {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('series_id', seriesId)
      .order('episode_number', { ascending: true });

    if (error) throw new Error(`Failed to fetch episodes: ${error.message}`);
    return (data || []).map(mapEpisodeToCamelCase);
  }

  async getAllRedeemableItems(): Promise<RedeemableItem[]> {
    const { data, error } = await supabase
      .from('redeemable_items')
      .select('*')
      .order('points_cost', { ascending: true });

    if (error) throw new Error(`Failed to fetch redeemable items: ${error.message}`);
    return (data || []).map(mapRedeemableItemToCamelCase);
  }

  async getEpisodeBySeriesAndNumber(seriesId: string, episodeNumber: number): Promise<Episode | undefined> {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('series_id', seriesId)
      .eq('episode_number', episodeNumber)
      .single();

    if (error || !data) return undefined;
    return mapEpisodeToCamelCase(data);
  }

  async upsertWatchHistory(watchHistory: InsertWatchHistory): Promise<WatchHistory> {
    const { data, error } = await supabase
      .from('watch_history')
      .upsert({
        user_id: watchHistory.userId,
        series_id: watchHistory.seriesId,
        episode_id: watchHistory.episodeId,
        last_watched_timestamp: watchHistory.lastWatchedTimestamp,
      }, {
        onConflict: 'user_id,series_id,episode_id'
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to upsert watch history: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      seriesId: data.series_id,
      episodeId: data.episode_id,
      lastWatchedTimestamp: data.last_watched_timestamp,
    } as WatchHistory;
  }

  async getRandomFirstEpisodes(limit: number): Promise<EpisodeWithSeries[]> {
    const { data, error } = await supabase
      .from('episodes')
      .select(`
        *,
        series:series_id (*)
      `)
      .eq('episode_number', 1)
      .limit(limit);

    if (error) throw new Error(`Failed to fetch random first episodes: ${error.message}`);

    return (data || [])
      .filter((item: any) => item.series)
      .map((item: any) => {
        const episode = mapEpisodeToCamelCase({
          id: item.id,
          series_id: item.series_id,
          episode_number: item.episode_number,
          title: item.title,
          video_url: item.video_url,
        });

        const series = mapSeriesToCamelCase(item.series);

        return {
          ...episode,
          series,
        } as EpisodeWithSeries;
      });
  }

  async addUserFollowing(userFollowing: InsertUserFollowing): Promise<UserFollowing> {
    const { data, error } = await supabase
      .from('user_following')
      .upsert({
        user_id: userFollowing.userId,
        series_id: userFollowing.seriesId,
      }, {
        onConflict: 'user_id,series_id'
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to add user following: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      seriesId: data.series_id,
    } as UserFollowing;
  }

  async removeUserFollowing(userId: string, seriesId: string): Promise<void> {
    const { error } = await supabase
      .from('user_following')
      .delete()
      .eq('user_id', userId)
      .eq('series_id', seriesId);

    if (error) {
      throw new Error(`Failed to remove user following: ${error.message}`);
    }
  }

  async isUserFollowingSeries(userId: string, seriesId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_following')
      .select('id')
      .eq('user_id', userId)
      .eq('series_id', seriesId)
      .single();

    return !!data && !error;
  }

  async deleteSeries(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('series')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete series: ${error.message}`);
    }
  }

  async updateSeries(id: string, updates: Partial<Series>): Promise<Series> {
    const { data, error } = await this.supabase
      .from('series')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update series: ${error.message}`);
    }

    return mapSeries(data);
  }
}

export const storage = new SupabaseStorage();
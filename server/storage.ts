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
  type UnlockedEpisode,
  type InsertUnlockedEpisode,
  type ConsumptionHistory,
  type InsertConsumptionHistory,
  type RewardCoinHistory,
  type InsertRewardCoinHistory,
  type UserReminder,
  type InsertUserReminder,
} from "@shared/schema";
import { supabase } from "./supabase";
import { mapSeriesToCamelCase, mapEpisodeToCamelCase, mapRedeemableItemToCamelCase } from "./mappers";

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
  getTrendingSeries(limit: number): Promise<Series[]>;
  searchSeriesByTitle(query: string): Promise<Series[]>;
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
  
  isEpisodeUnlocked(userId: string, episodeId: string): Promise<boolean>;
  unlockEpisode(userId: string, episodeId: string): Promise<{ success: boolean; message: string }>;
  updateUserCoins(userId: string, coins: number, rewardCoins: number): Promise<User>;
  addConsumptionHistory(history: InsertConsumptionHistory): Promise<ConsumptionHistory>;
  addRewardCoinHistory(history: InsertRewardCoinHistory): Promise<RewardCoinHistory>;
  
  addUserReminder(userReminder: InsertUserReminder): Promise<UserReminder>;
  removeUserReminder(userId: string, seriesId: string): Promise<void>;
  getUserReminders(userId: string): Promise<Series[]>;
  getUserFollowingSeries(userId: string): Promise<Series[]>;
  getUserWatchHistory(userId: string): Promise<Array<{ series: Series; episode: Episode; lastWatchedTimestamp: number }>>;
  bulkDeleteUserFollowing(userId: string, seriesIds: string[]): Promise<void>;
  bulkDeleteUserReminders(userId: string, seriesIds: string[]): Promise<void>;
  bulkDeleteWatchHistory(userId: string, seriesIds: string[]): Promise<void>;
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

  async getTrendingSeries(limit: number = 10): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch trending series: ${error.message}`);
    return (data || []).map(mapSeriesToCamelCase);
  }

  async searchSeriesByTitle(query: string): Promise<Series[]> {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_coming_soon', false)
      .ilike('title', `%${query}%`)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to search series: ${error.message}`);
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
    const { error } = await supabase
      .from('series')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete series: ${error.message}`);
    }
  }

  async updateSeries(id: string, updates: Partial<Series>): Promise<Series> {
    const { data, error } = await supabase
      .from('series')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update series: ${error.message}`);
    }

    return mapSeriesToCamelCase(data);
  }

  async isEpisodeUnlocked(userId: string, episodeId: string): Promise<boolean> {
    const episodeResult = await supabase
      .from('episodes')
      .select('is_free')
      .eq('id', episodeId)
      .single();

    if (episodeResult.data?.is_free) {
      return true;
    }

    const { data, error } = await supabase
      .from('unlocked_episodes')
      .select('id')
      .eq('user_id', userId)
      .eq('episode_id', episodeId)
      .single();

    return !!data && !error;
  }

  async unlockEpisode(userId: string, episodeId: string): Promise<{ success: boolean; message: string }> {
    const episode = await supabase
      .from('episodes')
      .select('id, cost_in_coins, is_free')
      .eq('id', episodeId)
      .single();

    if (!episode.data) {
      return { success: false, message: 'Episode not found' };
    }

    if (episode.data.is_free) {
      return { success: true, message: 'Episode is free' };
    }

    const alreadyUnlocked = await this.isEpisodeUnlocked(userId, episodeId);
    if (alreadyUnlocked) {
      return { success: true, message: 'Episode already unlocked' };
    }

    const user = await this.getUser(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const cost = episode.data.cost_in_coins;
    let rewardCoinsUsed = 0;
    let paidCoinsUsed = 0;

    if (user.rewardCoins >= cost) {
      rewardCoinsUsed = cost;
    } else {
      rewardCoinsUsed = user.rewardCoins;
      paidCoinsUsed = cost - user.rewardCoins;
    }

    if (user.coins < paidCoinsUsed) {
      return { success: false, message: 'Not enough coins' };
    }

    const newRewardCoins = user.rewardCoins - rewardCoinsUsed;
    const newPaidCoins = user.coins - paidCoinsUsed;

    await this.updateUserCoins(userId, newPaidCoins, newRewardCoins);

    if (rewardCoinsUsed > 0) {
      await this.addConsumptionHistory({
        userId,
        episodeId,
        coinType: 'reward',
        coinsSpent: rewardCoinsUsed,
      });
      
      await this.addRewardCoinHistory({
        userId,
        coinsChange: -rewardCoinsUsed,
        reason: `Unlocked episode ${episodeId}`,
      });
    }

    if (paidCoinsUsed > 0) {
      await this.addConsumptionHistory({
        userId,
        episodeId,
        coinType: 'paid',
        coinsSpent: paidCoinsUsed,
      });
    }

    const { error: unlockError } = await supabase
      .from('unlocked_episodes')
      .insert({
        user_id: userId,
        episode_id: episodeId,
      });

    if (unlockError) {
      throw new Error(`Failed to unlock episode: ${unlockError.message}`);
    }

    return { success: true, message: 'Episode unlocked successfully' };
  }

  async updateUserCoins(userId: string, coins: number, rewardCoins: number): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        coins,
        reward_coins: rewardCoins,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update user coins: ${error?.message}`);
    }

    return data as User;
  }

  async addConsumptionHistory(history: InsertConsumptionHistory): Promise<ConsumptionHistory> {
    const { data, error } = await supabase
      .from('consumption_history')
      .insert({
        user_id: history.userId,
        episode_id: history.episodeId,
        coin_type: history.coinType,
        coins_spent: history.coinsSpent,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to add consumption history: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      episodeId: data.episode_id,
      coinType: data.coin_type,
      coinsSpent: data.coins_spent,
      createdAt: data.created_at,
    } as ConsumptionHistory;
  }

  async addRewardCoinHistory(history: InsertRewardCoinHistory): Promise<RewardCoinHistory> {
    const { data, error } = await supabase
      .from('reward_coin_history')
      .insert({
        user_id: history.userId,
        coins_change: history.coinsChange,
        reason: history.reason,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to add reward coin history: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      coinsChange: data.coins_change,
      reason: data.reason,
      createdAt: data.created_at,
    } as RewardCoinHistory;
  }

  async addUserReminder(userReminder: InsertUserReminder): Promise<UserReminder> {
    const { data, error } = await supabase
      .from('user_reminders')
      .upsert({
        user_id: userReminder.userId,
        series_id: userReminder.seriesId,
      }, {
        onConflict: 'user_id,series_id'
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to add user reminder: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      seriesId: data.series_id,
      createdAt: data.created_at,
    } as UserReminder;
  }

  async removeUserReminder(userId: string, seriesId: string): Promise<void> {
    const { error } = await supabase
      .from('user_reminders')
      .delete()
      .eq('user_id', userId)
      .eq('series_id', seriesId);

    if (error) {
      throw new Error(`Failed to remove user reminder: ${error.message}`);
    }
  }

  async getUserReminders(userId: string): Promise<Series[]> {
    const { data, error } = await supabase
      .from('user_reminders')
      .select('series:series_id (*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user reminders: ${error.message}`);
    
    return (data || [])
      .filter((item: any) => item.series)
      .map((item: any) => mapSeriesToCamelCase(item.series));
  }

  async getUserFollowingSeries(userId: string): Promise<Series[]> {
    const { data, error } = await supabase
      .from('user_following')
      .select('series:series_id (*)')
      .eq('user_id', userId)
      .order('id', { ascending: false });

    if (error) throw new Error(`Failed to fetch user following: ${error.message}`);
    
    return (data || [])
      .filter((item: any) => item.series)
      .map((item: any) => mapSeriesToCamelCase(item.series));
  }

  async getUserWatchHistory(userId: string): Promise<Array<{ series: Series; episode: Episode; lastWatchedTimestamp: number }>> {
    const { data, error } = await supabase
      .from('watch_history')
      .select(`
        last_watched_timestamp,
        episode:episode_id (*),
        series:series_id (*)
      `)
      .eq('user_id', userId)
      .order('last_watched_timestamp', { ascending: false });

    if (error) throw new Error(`Failed to fetch watch history: ${error.message}`);
    
    return (data || [])
      .filter((item: any) => item.series && item.episode)
      .map((item: any) => ({
        series: mapSeriesToCamelCase(item.series),
        episode: mapEpisodeToCamelCase(item.episode),
        lastWatchedTimestamp: item.last_watched_timestamp,
      }));
  }

  async bulkDeleteUserFollowing(userId: string, seriesIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_following')
      .delete()
      .eq('user_id', userId)
      .in('series_id', seriesIds);

    if (error) {
      throw new Error(`Failed to bulk delete user following: ${error.message}`);
    }
  }

  async bulkDeleteUserReminders(userId: string, seriesIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_reminders')
      .delete()
      .eq('user_id', userId)
      .in('series_id', seriesIds);

    if (error) {
      throw new Error(`Failed to bulk delete user reminders: ${error.message}`);
    }
  }

  async bulkDeleteWatchHistory(userId: string, seriesIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', userId)
      .in('series_id', seriesIds);

    if (error) {
      throw new Error(`Failed to bulk delete watch history: ${error.message}`);
    }
  }
}

export const storage = new SupabaseStorage();
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, uuid, real, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  coins: integer("coins").notNull().default(0),
  rewardCoins: integer("reward_coins").notNull().default(0),
  points: integer("points").notNull().default(0),
  hasMembership: boolean("has_membership").notNull().default(false),
  membershipExpiresAt: timestamp("membership_expires_at"),
  checkInStreak: integer("check_in_streak").notNull().default(0),
  lastCheckInDate: timestamp("last_check_in_date"),
  adsWatchedToday: integer("ads_watched_today").notNull().default(0),
  autoplayPreference: boolean("autoplay_preference").notNull().default(true),
  languagePreference: text("language_preference").notNull().default('en'),
  allowMobileDownload: boolean("allow_mobile_download").notNull().default(false),
});

export const series = pgTable("series", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull(),
  posterUrl: text("poster_url").notNull(),
  isComingSoon: boolean("is_coming_soon").notNull().default(false),
  releaseDate: text("release_date"),
  genre: text("genre"),
  rating: real("rating"),
  year: integer("year"),
  tags: text("tags").array(),
  rank: integer("rank"),
  isNew: boolean("is_new").default(false),
});

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  seriesId: uuid("series_id").notNull().references(() => series.id, { onDelete: 'cascade' }),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
});

export const redeemableItems = pgTable("redeemable_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  pointsCost: integer("points_cost").notNull(),
  rewardType: text("reward_type").notNull(),
  rewardValue: integer("reward_value").notNull(),
});

export const dailyRewardClaims = pgTable("daily_reward_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lastClaimDate: timestamp("last_claim_date").notNull(),
});

export const userPointsHistory = pgTable("user_points_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  pointsChange: integer("points_change").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userTasksCompleted = pgTable("user_tasks_completed", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskIdString: text("task_id_string").notNull(),
});

export const purchaseHistory = pgTable("purchase_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemType: text("item_type").notNull(),
  itemDetails: text("item_details").notNull(),
  amountGhs: real("amount_ghs").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const rewardCoinHistory = pgTable("reward_coin_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  coinsChange: integer("coins_change").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const consumptionHistory = pgTable("consumption_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: 'cascade' }),
  coinType: text("coin_type").notNull(),
  coinsSpent: integer("coins_spent").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const watchHistory = pgTable("watch_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  seriesId: uuid("series_id").notNull().references(() => series.id, { onDelete: 'cascade' }),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: 'cascade' }),
  lastWatchedTimestamp: real("last_watched_timestamp").notNull(),
}, (table) => ({
  uniqueUserSeriesEpisode: uniqueIndex("watch_history_user_series_episode_unique").on(table.userId, table.seriesId, table.episodeId),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  coins: true,
  rewardCoins: true,
  points: true,
  hasMembership: true,
  membershipExpiresAt: true,
  checkInStreak: true,
  lastCheckInDate: true,
  adsWatchedToday: true,
  autoplayPreference: true,
  languagePreference: true,
  allowMobileDownload: true,
});

export const insertSeriesSchema = createInsertSchema(series).omit({ id: true });
export const insertEpisodeSchema = createInsertSchema(episodes).omit({ id: true });
export const insertRedeemableItemSchema = createInsertSchema(redeemableItems).omit({ id: true });
export const insertDailyRewardClaimSchema = createInsertSchema(dailyRewardClaims).omit({ id: true });
export const insertUserPointsHistorySchema = createInsertSchema(userPointsHistory).omit({ id: true, createdAt: true });
export const insertUserTasksCompletedSchema = createInsertSchema(userTasksCompleted).omit({ id: true });
export const insertPurchaseHistorySchema = createInsertSchema(purchaseHistory).omit({ id: true, createdAt: true });
export const insertRewardCoinHistorySchema = createInsertSchema(rewardCoinHistory).omit({ id: true, createdAt: true });
export const insertConsumptionHistorySchema = createInsertSchema(consumptionHistory).omit({ id: true, createdAt: true });
export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({ id: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Series = typeof series.$inferSelect;

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodes.$inferSelect;

export type InsertRedeemableItem = z.infer<typeof insertRedeemableItemSchema>;
export type RedeemableItem = typeof redeemableItems.$inferSelect;

export type InsertDailyRewardClaim = z.infer<typeof insertDailyRewardClaimSchema>;
export type DailyRewardClaim = typeof dailyRewardClaims.$inferSelect;

export type InsertUserPointsHistory = z.infer<typeof insertUserPointsHistorySchema>;
export type UserPointsHistory = typeof userPointsHistory.$inferSelect;

export type InsertUserTasksCompleted = z.infer<typeof insertUserTasksCompletedSchema>;
export type UserTasksCompleted = typeof userTasksCompleted.$inferSelect;

export type InsertPurchaseHistory = z.infer<typeof insertPurchaseHistorySchema>;
export type PurchaseHistory = typeof purchaseHistory.$inferSelect;

export type InsertRewardCoinHistory = z.infer<typeof insertRewardCoinHistorySchema>;
export type RewardCoinHistory = typeof rewardCoinHistory.$inferSelect;

export type InsertConsumptionHistory = z.infer<typeof insertConsumptionHistorySchema>;
export type ConsumptionHistory = typeof consumptionHistory.$inferSelect;

export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;

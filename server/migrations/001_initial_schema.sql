-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  coins INTEGER NOT NULL DEFAULT 0,
  reward_coins INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  has_membership BOOLEAN NOT NULL DEFAULT FALSE,
  membership_expires_at TIMESTAMP,
  check_in_streak INTEGER NOT NULL DEFAULT 0,
  last_check_in_date TIMESTAMP,
  ads_watched_today INTEGER NOT NULL DEFAULT 0,
  autoplay_preference BOOLEAN NOT NULL DEFAULT TRUE,
  language_preference TEXT NOT NULL DEFAULT 'en',
  allow_mobile_download BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create series table
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  is_coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
  release_date TEXT,
  genre TEXT,
  rating REAL,
  year INTEGER,
  tags TEXT[],
  rank INTEGER,
  is_new BOOLEAN DEFAULT FALSE
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL
);

-- Create redeemable_items table
CREATE TABLE IF NOT EXISTS redeemable_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_value INTEGER NOT NULL
);

-- Create daily_reward_claims table
CREATE TABLE IF NOT EXISTS daily_reward_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_claim_date TIMESTAMP NOT NULL
);

-- Create user_points_history table
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create user_tasks_completed table
CREATE TABLE IF NOT EXISTS user_tasks_completed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id_string TEXT NOT NULL
);

-- Create purchase_history table
CREATE TABLE IF NOT EXISTS purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_details TEXT NOT NULL,
  amount_ghs REAL NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create reward_coin_history table
CREATE TABLE IF NOT EXISTS reward_coin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create consumption_history table
CREATE TABLE IF NOT EXISTS consumption_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  coin_type TEXT NOT NULL,
  coins_spent INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_episodes_series_id ON episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_daily_reward_claims_user_id ON daily_reward_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON user_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_completed_user_id ON user_tasks_completed(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_history_user_id ON purchase_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_coin_history_user_id ON reward_coin_history(user_id);
CREATE INDEX IF NOT EXISTS idx_consumption_history_user_id ON consumption_history(user_id);
CREATE INDEX IF NOT EXISTS idx_consumption_history_episode_id ON consumption_history(episode_id);

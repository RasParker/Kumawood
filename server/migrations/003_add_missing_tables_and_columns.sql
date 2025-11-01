-- Add missing view_count column to series table
ALTER TABLE IF EXISTS series
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create watch_history table
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  last_watched_at TIMESTAMP NOT NULL DEFAULT NOW(),
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, series_id, episode_id)
);

-- Create user_following table
CREATE TABLE IF NOT EXISTS user_following (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  followed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, series_id)
);

-- Create unlocked_episodes table
CREATE TABLE IF NOT EXISTS unlocked_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_series_id ON watch_history(series_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_episode_id ON watch_history(episode_id);
CREATE INDEX IF NOT EXISTS idx_user_following_user_id ON user_following(user_id);
CREATE INDEX IF NOT EXISTS idx_user_following_series_id ON user_following(series_id);
CREATE INDEX IF NOT EXISTS idx_unlocked_episodes_user_id ON unlocked_episodes(user_id);
CREATE INDEX IF NOT EXISTS idx_unlocked_episodes_episode_id ON unlocked_episodes(episode_id);

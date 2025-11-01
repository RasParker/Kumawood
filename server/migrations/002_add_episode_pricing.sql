-- Add monetization columns to episodes table
ALTER TABLE IF EXISTS episodes
  ADD COLUMN IF NOT EXISTS is_free BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cost_in_coins INTEGER NOT NULL DEFAULT 50;

-- Update episodes 1-10 to be free
UPDATE episodes
SET is_free = TRUE, cost_in_coins = 0
WHERE episode_number >= 1 AND episode_number <= 10;

-- Update episodes 11+ to cost 50 coins
UPDATE episodes
SET is_free = FALSE, cost_in_coins = 50
WHERE episode_number > 10;

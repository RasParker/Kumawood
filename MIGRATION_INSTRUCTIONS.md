# Database Migration Instructions

## Adding Episode Pricing Columns (Migration 002)

This migration adds the monetization columns to your episodes table and updates the pricing logic to make episodes 1-10 free.

### Steps to Apply:

1. **Open your Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to the SQL Editor

2. **Run the Migration SQL**
   - Copy the contents of `server/migrations/002_add_episode_pricing.sql`
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute

3. **Verify the Changes**
   - Go to the Table Editor
   - Select the `episodes` table
   - You should now see two new columns:
     - `is_free` (boolean)
     - `cost_in_coins` (integer)
   - Episodes 1-10 should have `is_free = true` and `cost_in_coins = 0`
   - Episodes 11+ should have `is_free = false` and `cost_in_coins = 50`

### What This Migration Does:

1. Adds `is_free` column (defaults to FALSE)
2. Adds `cost_in_coins` column (defaults to 50)
3. Updates episodes 1-10 to be free with 0 cost
4. Updates episodes 11+ to cost 50 coins

### No Data Loss:

This migration is safe and will NOT delete any existing data:
- User accounts remain unchanged
- Watch history is preserved
- Unlocked episodes are preserved
- All series and episodes stay intact

---

## Future Episode Creation

The seed script (`server/seed.ts`) has been updated so that any future episodes created will automatically follow the new pricing:
- Episodes 1-10: Free (0 coins)
- Episodes 11+: 50 coins

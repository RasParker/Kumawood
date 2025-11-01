# Database Migration Instructions

## ⚠️ CRITICAL: Schema Mismatch Identified

The database migrations were incomplete and did not match the application schema 100%. You need to run **ALL THREE** migrations below to ensure your database is fully set up.

---

## Required Migrations (Run in Order)

### Migration 001: Initial Schema ✅
**File:** `server/migrations/001_initial_schema.sql`

This should have already been run during initial setup. It creates:
- `users` table
- `series` table (incomplete - missing `view_count`)
- `episodes` table (incomplete - missing `is_free` and `cost_in_coins`)
- `redeemable_items` table
- `daily_reward_claims` table
- `user_points_history` table
- `user_tasks_completed` table
- `purchase_history` table
- `reward_coin_history` table
- `consumption_history` table

**Status:** If you've already run this, skip to Migration 002.

---

### Migration 002: Episode Pricing 🆕
**File:** `server/migrations/002_add_episode_pricing.sql`

**What it does:**
1. Adds `is_free` column to episodes (boolean, defaults to FALSE)
2. Adds `cost_in_coins` column to episodes (integer, defaults to 50)
3. Updates episodes 1-10 to be free with 0 cost
4. Updates episodes 11+ to cost 50 coins

**Steps to Apply:**
1. Open your **Supabase Dashboard** → SQL Editor
2. Copy the contents of `server/migrations/002_add_episode_pricing.sql`
3. Paste it into the SQL Editor
4. Click "Run"

---

### Migration 003: Missing Tables & Columns 🆕 CRITICAL
**File:** `server/migrations/003_add_missing_tables_and_columns.sql`

**What it does:**
1. Adds missing `view_count` column to `series` table
2. Creates `watch_history` table (tracks user viewing progress)
3. Creates `user_following` table (tracks liked/followed series)
4. Creates `unlocked_episodes` table (tracks episodes unlocked with coins)
5. Creates performance indexes for all new tables

**Steps to Apply:**
1. Open your **Supabase Dashboard** → SQL Editor
2. Copy the contents of `server/migrations/003_add_missing_tables_and_columns.sql`
3. Paste it into the SQL Editor
4. Click "Run"

**⚠️ WARNING:** Without this migration, the following features will NOT work:
- Watch history tracking
- Following/liking series
- Episode unlocking with coins (the core monetization feature!)

---

## Verification Steps

After running all migrations, verify your database has these tables:

### Core Tables:
- ✅ `users`
- ✅ `series` (with `view_count` column)
- ✅ `episodes` (with `is_free` and `cost_in_coins` columns)

### Feature Tables:
- ✅ `watch_history`
- ✅ `user_following`
- ✅ `unlocked_episodes`

### Gamification Tables:
- ✅ `redeemable_items`
- ✅ `daily_reward_claims`
- ✅ `user_tasks_completed`
- ✅ `user_points_history`

### Transaction Tables:
- ✅ `purchase_history`
- ✅ `reward_coin_history`
- ✅ `consumption_history`

---

## No Data Loss

All migrations are safe and will NOT delete any existing data:
- Existing user accounts, series, and episodes remain unchanged
- Any existing watch history or unlocked episodes are preserved
- All migrations use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` to be idempotent

---

## Summary

**Before these migrations:**
- Episode pricing not working (missing columns)
- Watch history not working (missing table)
- Following series not working (missing table)  
- Episode unlocking not working (missing table)

**After these migrations:**
- ✅ Full schema parity with application code
- ✅ All features fully functional
- ✅ Episodes 1-10 free, episodes 11+ cost 50 coins

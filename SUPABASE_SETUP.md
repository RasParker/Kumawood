# AfriShorts Supabase Setup Guide

This guide will help you set up the Supabase database for AfriShorts with all required tables and sample data.

## Prerequisites

1. A Supabase account and project
2. Your Supabase credentials set in environment variables:
   - `SUPABASE_PROJECT_URL`
   - `SUPABASE_ANON_KEY`

## Step 1: Run Database Migrations

You need to run all migration SQL files in your Supabase SQL Editor in order:

### Migration 001: Initial Schema
Location: `server/migrations/001_initial_schema.sql`

This creates the core tables:
- users
- series
- episodes
- redeemable_items
- daily_reward_claims
- user_tasks_completed
- user_points_history
- purchase_history
- reward_coin_history
- consumption_history

**How to run:**
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the contents of `server/migrations/001_initial_schema.sql`
4. Paste and run in SQL Editor

### Migration 002: Episode Pricing
Location: `server/migrations/002_add_episode_pricing.sql`

This adds the episode pricing system (episodes 1-10 free, 11+ cost 50 coins):
- Adds `is_free` column to episodes
- Adds `cost_in_coins` column to episodes
- Updates existing episodes with the free/paid logic

**How to run:**
1. Copy the contents of `server/migrations/002_add_episode_pricing.sql`
2. Paste and run in Supabase SQL Editor

### Migration 003: User Following & Watch History
Location: `server/migrations/003_add_missing_tables_and_columns.sql`

This adds:
- `watch_history` table (tracks user viewing progress)
- `user_following` table (tracks series users have liked/followed)
- `unlocked_episodes` table (tracks episodes users have purchased)

**How to run:**
1. Copy the contents of `server/migrations/003_add_missing_tables_and_columns.sql`
2. Paste and run in Supabase SQL Editor

### Migration 004: User Reminders
Location: `server/migrations/004_add_user_reminders.sql`

This adds:
- `user_reminders` table (tracks coming-soon series users want to be notified about)

**How to run:**
1. Copy the contents of `server/migrations/004_add_user_reminders.sql`
2. Paste and run in Supabase SQL Editor

## Step 2: Seed Sample Data

After running all migrations, populate your database with sample data:

```bash
npx tsx server/seed.ts
```

This will create:
- 35+ series across different categories (Popular, New, Rankings, Kumawood, Naija)
- Episodes for each series (with proper free/paid pricing)
- 4 coming-soon series
- 3 redeemable reward items
- **Demo user** with ID `demo-user-id` (500 coins, 200 reward coins, 1500 points)
- **5 series** in the user's Following list
- **3 series** in the user's Watch History
- **2 series** in the user's Reminder Set

### Demo User Credentials
- **Email:** demo@afrishorts.com
- **User ID:** demo-user-id
- **Coins:** 500
- **Reward Coins:** 200
- **Points:** 1500
- **Membership:** Active

## Step 3: Verify Setup

Check that all tables exist in your Supabase dashboard:

### Core Tables
- ✓ users
- ✓ series
- ✓ episodes
- ✓ redeemable_items

### Gamification Tables
- ✓ daily_reward_claims
- ✓ user_tasks_completed
- ✓ user_points_history

### Transaction Tables
- ✓ purchase_history
- ✓ reward_coin_history
- ✓ consumption_history

### User Interaction Tables
- ✓ watch_history
- ✓ user_following
- ✓ unlocked_episodes
- ✓ user_reminders

## Troubleshooting

### "Table already exists" Error
If you see this error, the table was already created. Skip that migration or drop the table first.

### "Could not find table" Error
Make sure you've run all migrations in order (001 → 002 → 003 → 004).

### Seed Script Fails
- Verify all migrations have been run successfully
- Check that your environment variables are set correctly
- Make sure your Supabase project is accessible

## Next Steps

Once setup is complete:
1. Start the application: `npm run dev`
2. The app will use the demo user ID (`demo-user-id`) by default
3. Explore the MyListScreen to see:
   - Following tab (5 series)
   - History tab (3 series)
   - Reminder Set tab (2 coming-soon series)
4. Test the "Remind Me" button on coming-soon series

## Database Schema Overview

```
users
├─ series
│  ├─ episodes
│  ├─ user_following (many-to-many)
│  ├─ user_reminders (many-to-many for coming-soon)
│  └─ watch_history (tracks progress per episode)
│
├─ unlocked_episodes (purchased episodes)
├─ consumption_history (coin spending records)
├─ reward_coin_history (reward coin transactions)
└─ purchase_history (coin purchases)
```

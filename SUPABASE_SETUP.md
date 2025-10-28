# Supabase Setup Instructions

This guide will help you set up your Supabase database for the AfriShorts application.

## Prerequisites

- Supabase account with a project created
- SUPABASE_PROJECT_URL and SUPABASE_ANON_KEY secrets already configured in Replit

## Step 1: Run the Migration SQL

1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor** (from the left sidebar)
3. Click **New Query**
4. Copy the entire contents of `server/migrations/001_initial_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

This will create all the necessary tables:
- `users` - User accounts with coins, points, memberships
- `series` - TV series/shows data
- `episodes` - Individual episodes for each series
- `redeemable_items` - Items users can redeem with points
- `daily_reward_claims` - Track daily reward claims
- `user_points_history` - Points transaction history
- `user_tasks_completed` - Completed tasks tracking
- `purchase_history` - Purchase transaction records
- `reward_coin_history` - Reward coin transaction history
- `consumption_history` - Content consumption tracking

## Step 2: Seed the Database

After running the migration, seed your database with initial data:

1. In the Replit Shell, run:
   ```bash
   npm run seed
   ```

This will populate your database with:
- Popular series
- New releases
- Top 10 ranked series
- Kumawood series
- Naija series
- Coming soon series
- Redeemable items (including the 5-Day Membership Extension for 1000 points)

## Step 3: Verify the Setup

After seeding, you can verify the data in Supabase:

1. Go to **Table Editor** in your Supabase dashboard
2. Check that all tables have been created
3. Verify that the `series`, `episodes`, and `redeemable_items` tables contain data

## Troubleshooting

### "Table not found" errors

If you see errors about tables not being found:
1. Make sure you ran the migration SQL in Step 1
2. Check that you're using the correct Supabase project
3. Verify your SUPABASE_PROJECT_URL is correct

### Seed script errors

If the seed script fails:
1. Make sure the migration was run successfully first
2. Check that your SUPABASE_ANON_KEY has the correct permissions
3. You can run the seed script multiple times - it will clear existing data first

## Running the Seed Script

In the Replit Shell, run:

```bash
npx tsx server/seed.ts
```

This will seed your database with all the mock data from the previous version of the app.

## What's Next?

After completing these steps, your app will be fully connected to Supabase! The HomeScreen tabs will now fetch data from your Supabase database instead of using mock data.

You can:
- Add more series, episodes, and content through the Supabase dashboard
- Manage user accounts and rewards
- Track user activity and consumption history
- Customize redeemable items

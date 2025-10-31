### IMPORTANT NOTICE: 
- Only use this document (Project_Plan.md) as reference and/or guidance.
- This document is meant for **step by step design and build clarity**
- Do not remove or overwrite this document (Project_Plan.md).

# Project Plan: "AfriShorts" (African Micro-Drama App) #
## A Step-by-Step Guide for Replit Agent 3

This document outlines the phased development plan to build a "ReelShort" style streaming app with a focus on African micro-dramas.

### Core Tech Stack:

- **Frontend:** React (with Vite) + Tailwind CSS + i18n library (for language support)
- **Backend (BaaS):** Supabase (for Database, Auth, and Edge Functions)
- **Video Hosting:** Cloudinary (for all video/image storage, optimization, and delivery)
- **Ads:** A 3rd-Party Rewarded Video Ad SDK (e.g., Google AdMob)
- **Offline Storage:** (Potentially needed for Downloads - e.g., IndexedDB, Service Workers)

---

### **Phase 1: Project Scaffolding & Core UI'**

Your goal here is to get the basic, visible structure of the app built and manage the navigation state.

**Initial Prompt for Replit Agent 3:**

"Initialize a new full-stack web application.

1. **Frontend:** Use **React** (with Vite) and **Tailwind CSS**. It must be a **mobile-first**, single-page application. Include an **i18n library** (like `react-i18next`) for language support.

2. **Visual Design Style (NEW):** Implement a modern, **dark-mode visual style** similar to popular short-form video apps (like DramaBox/ReelShort). Use **dark backgrounds** (black/dark grey, e.g., `#111111`, `#1A1A1A`), **light text** (white/light gray), and **vibrant, contrasting colors** (like **pink/orange/red gradients**, e.g., from `#FF4E50` to `#F9D423`) for primary buttons and calls-to-action. Ensure high visual density on browsing screens and minimalist UI on the player.

3. **Backend:** Use **Supabase** for the backend.

4. **Video Hosting:** All video and image URLs will come from **Cloudinary**.

5. **UI Shell:** Create a main App component with a sticky `BottomNavBar` at the bottom using the dark theme. Include icons for 'Home', 'For You', 'My List', and 'Profile'.

6. **Main Components (Pages):** Create the following components that the `BottomNavBar` will switch between:
    
    * `HomeScreen`
    * `ForYouScreen`
    * `PlayerScreen`
    * `SearchScreen`
    * `MyListScreen`
    * `ProfileScreen`
    * `LoginScreen`
    * `StoreScreen`
    * `RewardsScreen`
    * `TermsOfUseScreen` (static text)
    * `DetailedPointsHistoryScreen`
    * `HistoryScreen`
    * `MyWalletScreen`
    * `TransactionHistoryScreen`
    * `RewardCoinsHistoryScreen`
    * `ConsumptionRecordsScreen`
    * `LanguageScreen`
    * `DownloadsScreen`
    * `SettingsScreen`
    * `ManageMembershipScreen`
    * `AccountDeletionScreen`
    * `AboutScreen` (Placeholder/Deferred)
    * `HelpFeedbackScreen` (Placeholder/Deferred)

7. **State Management:** In the main `App` component, create state variables for:
    
    * `currentView` (default: 'home')
    * `selectedSeriesId` (default: null)
    * `selectedEpisodeNumber` (default: 1)
    * `playerStartTime` (default: 0)
    * `showCopiedToast` (default: false)
    * `showToastMessage` (default: null).
    * `currentLanguage` (default: 'en', fetched from user preference later)
    * `cacheSizeMB` (default: 0.0)

8. **Navigation Functions (REVISED):** In `App`, create:
     
     * `MapsToPlayer(seriesId, episodeNumber = 1, startTime = 0)`: This is the key function.
     * Also create functions like `MapsToHome()`, `MapsToProfile()`, `MapsToLogin()`, `MapsToRewards()`, `MapsToPointsHistory()`, `MapsToHistory()`,    `MapsToStore()`, `MapsToMyWallet()`, `MapsToTransactionHistory()`, `MapsToRewardCoinsHistory()`, `MapsToConsumptionRecords()`,         `MapsToLanguage()`,  `MapsToDownloads()`, `MapsToSettings()`, `MapsToManageMembership()`, `MapsToAccountDeletion()`, `MapsToAbout()`,    `MapsToHelpFeedback()` etc., that just change the `currentView`.

9. **Prop Drilling:** Pass all necessary navigation functions down to the components that need them."

---

### **Phase 2: Build the Full 'HomeScreen' (All Tabs)**

Now, we build the complex, multi-tab `HomeScreen` using mock data.

**Follow-up Prompt:**
"Let's build the full, tabbed `HomeScreen`. Ensure all UI elements adhere to the dark theme established in Phase 1.

1. **Props:** The `HomeScreen` must accept the `MapsToPlayer` function as a prop.

2. **Top Tab Bar:** Add a horizontal scrolling tab bar: 'Popular', 'New', 'Rankings', 'Kumawood', 'Naija'. Style the active tab distinctly.

3. **Create All Tab Layouts:** Build the different components for each tab:

   * `PopularTabComponent`: (3-column grid, ComingSoonCarousel, etc. Use vibrant poster images.)

   * `NewTabComponent`: (Vertical list with image left, text right.)

   * `RankingsTabComponent`: (Numbered list.)

   * `KumawoodTabComponent`: (Filter tags + 3-column grid.)

4. **Click-to-Play Logic (CRITICAL):**

   * In all components that show a series, make the series thumbnail clickable.

   * The `onClick` handler for every series must call `props.navigateToPlayer(series.id, 1, 0)`. (Start from 0 seconds).

5. **"Remind Me" Stub:** The ComingSoonCarousel must have a "Remind Me" button styled as a secondary action. For now, it does nothing.

6. **Mock Data:** Create a `mockData.js` file to populate all these components. All `posterUrl` and `videoUrl` fields should be placeholder URLs from Cloudinary."

---

### **Phase 3: Real Backend - Supabase & Auth (REVISED)**

Now, let's replace the mock data with a real database and add user accounts.

**Follow-up Prompt:**

"Connect the **Supabase** backend.

1. **Supabase Database:** Create the following tables:

  * `series`: (id, title, synopsis, poster_url, is_coming_soon, release_date)

  * `episodes`: (id, series_id, episode_number, title, video_url)

  * `users`: (id, email, `coins`, `reward_coins`, `points`, `has_membership`, `membership_expires_at`, `check_in_streak`, `last_check_in_date`, `ads_watched_today`, `autoplay_preference` boolean default true, `language_preference` text default 'en', `allow_mobile_download` boolean default false)

  * `redeemable_items`: (id, title, points_cost, reward_type, reward_value)

  * `daily_reward_claims`: (id, user_id, last_claim_date)

  * `user_points_history`: (id, user_id, points_change, reason, created_at)

  * `user_tasks_completed`: (id, user_id, task_id_string)

  * `purchase_history`: (id, user_id, item_type ('coin' or 'membership'), item_details, amount_ghs, created_at)

  * `reward_coin_history`: (id, user_id, coins_change, reason, created_at)

  * `consumption_history`: (id, user_id, episode_id, coin_type ('paid' or 'reward'), coins_spent, created_at)

2. **Data Upload:** Upload the mock data from `mockData.js` into these new tables.

  * Add a "5-Day Membership Extension" to `redeemable_items` with a cost of 1000 points.

3. **Refactor UI:** Change all the `HomeScreen` tab components to fetch their data directly from Supabase instead of `mockData.js`."

---

### **Phase 4: The Core Feature - 'PlayerScreen' (REVISED)**

This is the full player. It now needs to accept a `startTime` and write to the user's `watch_history`.

**Follow-up Prompt:**

"Let's build the complete `PlayerScreen` component and add watch history tracking. Ensure all overlays and bottom sheets use the dark theme.

1. **New Table:** First, create a new table in Supabase called `watch_history` (columns: `id` (primary key), `user_id`, `series_id`, `episode_id`, `last_watched_timestamp`).

2. **Props:** It must accept `selectedSeriesId`, `selectedEpisodeNumber`, `playerStartTime`, and the `MapsToHome` function.

3. **Data Fetching:** On load, use the props to query **Supabase** and find the specific episode row. Also fetch the user's `autoplay_preference`.

4. **Main Player & `video` Element:**

  * Get the `video_url` from the fetched episode row (a Cloudinary URL).

  * Set this as the `src` for the HTML5 `<video>` tag. The video must auto-play.

  * **Start Time:** Add an `onLoadedMetadata` event listener to the `<video>` tag. Inside this listener, set `video.currentTime = props.playerStartTime`.

  * **History Tracking (CRITICAL):** Add an `onTimeUpdate` event listener to the `<video>` tag. Every 15 seconds, it must 'upsert' a row into the `watch_history` table for the current `user_id`, `series_id`, and `episode_id`, updating the `last_watched_timestamp`.

  * **Autoplay Next:** Add an `onEnded` event listener. If `autoplay_preference` is true, automatically navigate to the next episode (`MapsToPlayer(seriesId, currentEpisode + 1, 0)`).

5. **Tap-to-Toggle Overlays:**

  * A single tap on the video must *toggle the visibility* of all overlay elements using a smooth fade transition.

  * They should be visible by default, fade out after 3 seconds, and re-appear on tap.

6. **The Overlays (Default Auto-Hiding):**

  * **Top Bar Overlay:** A semi-transparent dark bar at the top with a "Back" arrow (calls `MapsToHome`), Episode Number, "Speed" button, and "More" (three dots) icon (all light colored).

  * **Center Overlay:** A light-colored "Pause" icon in the center.

  * **Right-Side Icons Overlay:** A vertical stack of light-colored icon buttons on the right: "Like", "Episodes", "Share".

  * **Bottom Title Overlay:** A semi-transparent dark block at the bottom with the Series Title and a short description (light text). Clickable.

  * **Bottom Seek Bar:** A very thin, white horizontal, interactive seek bar positioned just above the bottom title overlay.

7. **All Bottom Sheets:**

  * Create and connect the `EpisodeSheet` (with 'Synopsis'/'Episodes' tabs). Style using the dark theme.

  * Create and connect the `SpeedSelectionSheet`. Style using the dark theme.

  * Create and connect the `PlaybackSettingsSheet`. Style using the dark theme."

---

### **Phase 4.5: Build the 'For You' Feed (REVISED)**

This is the "Hook Player." It now needs the "Like" button to work.

**Follow-up Prompt:**

"Let's build the `ForYouScreen` component and its 'Hook Player'. This screen should use the established dark theme.

1. **New Table:** Create a new table in Supabase called `user_following` (columns: `id` (primary key), `user_id`, `series_id`).

2. **Props:** It must accept the `MapsToPlayer` and `MapsToSearch` functions.

3. **Fetch 'Hooks':** In `ForYouScreen`, query the `episodes` table in Supabase. Get a list of 20 random episodes where `episodeNumber` is 1.

4. **Install Swiper:** Add a swipe component (like `swiper-react`) for a full-screen, vertical feed.

5. **Create `HookPlayer` Component:**

  * Create a *new, simplified* player component named `HookPlayer`. It must have its own internal `<video>` tag.

  * **UI (Dark Theme):** It should have only the following overlays, and they must be permanently visible (no auto-hide), styled according to the dark theme:

      * Top-right: A light "Search" icon (calls `props.navigateToSearch`).

      * Right-side: Light "Like", "Episodes", "Share" icons.

      * Bottom: Semi-transparent dark block with Title, Description (light text).

      * **"Manual Invest" Button:** A clickable bar (semi-transparent dark) showing "[Icon] EP.1 / EP.80 [>]" (light text/icon).

  * **"Like" Button Logic:** When the user taps the **"Like" (bookmark) icon**, it must add a row to the `user_following` table for the current `user_id` and `series_id`.

  * **"Manual Invest" Click Logic:** When a user taps this button, it must get the `currentTime` from its video and call `props.navigateToPlayer(series.id, 1, videoCurrentTime`).

  * **"Automatic Invest" Logic:** Add an `onEnded` event listener to the `<video>` tag. When the video finishes, it *must* call `props.navigateToPlayer(series.id, 2, 0`).

6. **Build Feed:** Loop over the 20 'hook' episodes and render a `<HookPlayer />` for each one inside a swiper slide."

---

### **Phase 5: Monetization (The "ReelShort" Model) (REVISED)**

Here's how you'll make money. This implements the pay-per-episode "coin" system using Supabase.

**Follow-up Prompt:**

"Implement the coin-based monetization system using **Supabase** with the new **Reward Coin logic**. Ensure the monetization overlay uses the dark theme.

1. **Episode Cost:** In the `episodes` table in Supabase, add two new columns: `is_free` (boolean) and `cost_in_coins` (number). Make `episodeNumber: 1` free (`is_free: true`), and all other episodes cost 50 coins.

2. **Unlock Logic (In `EpisodeSheet`):**

   * Create an `unlocked_episodes` table (columns: `id` (primary key), `user_id`, `episode_id`).

   * In the **'Episodes'** tab grid (dark theme), add a **'lock'** icon (light color) to every episode that is not free and is not in the user's `unlocked_episodes` table.

   * When a user tries to watch a locked episode, **do not play the video**.

   * Instead, show a **"monetization overlay"** (dark theme) that says: 'Unlock for 50 Coins'. Style the "Unlock" button using the primary CTA gradient.

   * **NEW UNLOCK LOGIC:** When the user clicks the "Unlock" button, call a **Supabase Edge Function ('unlock-episode')**. This function must:

       1. Check the user's `reward_coins` balance. If it's enough, subtract the cost from `reward_coins` and log this in `consumption_history` as 'reward'.

       2. If `reward_coins` is not enough, calculate the remainder, subtract it from `reward_coins` (log 'reward'), and subtract the rest from the user's `coins` (paid) balance (log 'paid' in `consumption_history`).

       3. If both are insufficient, return an error: 'Not enough coins.'

       4. If successful, add a new row to the `unlocked_episodes` table.

   * If they don't have enough coins, show a message (styled toast/modal): 'Not enough coins. Please buy more.'"

---

### **Phase 6: Payments (Localized for Ghana - COINS) (REVISED)**

This phase makes the app a real business, using Supabase for the backend.

**Follow-up Prompt:**

"Let's add a way for users to buy *paid* coins using Ghanaian currency and payment methods. Ensure the Store screen uses the dark theme.

1. **Integrate Ghanaian Payment Gateway:** Find and integrate a payment gateway that:

     * Explicitly supports **Mobile Money** (MTN, Telecel, AirtelTigo).

     * Processes payments in **Ghana Cedi (GHS)**.

     * (Examples to suggest to the Agent: *Paystack, Flutterwave*).

2. **Build `StoreScreen` (Coins Section):**

     * Create the `StoreScreen` component using the dark theme. It needs a "Back" arrow (calls `MapsToProfile`) and a "Restore" button in the header.

     * Add a **"COINS" section**.

     * **Coin Packages (Localized):** Create clickable boxes (dark background, light text) for coin packages with prices in GHS. Highlight selected box. Add bonus text styling.

     * 100 (+100 Bonus) - ₵20

     * 300 - ₵50

     * 500 (+50 Bonus) - ₵90

     * 1000 (+150 Bonus) - ₵170

 * **Payment Logic:** Clicking a coin package must trigger the **Paystack/Flutterwave** payment flow for that specific package, using **GHS (₵)**.

 * **Supabase Edge Function:** When a purchase is successful (confirmed by a webhook), trigger a **Supabase Edge Function** to:

     1. * Securely update the user's *paid* `coins` balance in their `users` table row.

     2. Log the transaction in the `purchase_history` table."

---

### **Phase 7: Build the 'SearchScreen'**

This is the new search page you discovered.

**Follow-up Prompt:**

"Let's build the `SearchScreen` component using the dark theme.

1.  **Props:** It must accept the `MapsToPlayer` and `MapsToForYou` functions.

2.  **UI:** Create the `SearchScreen` component with:

    * A `Search Bar` at the top (dark theme styled, with a light "Back" arrow to call `MapsToForYou`).

     * A **"Trending Searches"** section title (light text) below the search bar.

4.  **Trending List:** Fetch the top 10 most-viewed shows from the `series` table in Supabase and display them in a **`RankingsList`** component (numbered list, dark theme styled).

5.  **Click-to-Play:** Make each item in the "Trending Searches" list clickable, calling `props.navigateToPlayer(series.id, 1, 0)`."

---

### **Phase 8: Build the 'MyListScreen' (FINAL)**

This is the new "My List" page, with re-engagement, reminders, and **bulk-delete functionality**.

**Follow-up Prompt:**

"Let's build the `MyListScreen` component with all its features, using the dark theme.

1.  **Props:** It must accept the `MapsToPlayer` function.

2.  **New Table:** Create a new table in **Supabase** called `user_reminders` (columns: `id` (primary key), `user_id`, `series_id`).

3.  **Hook up "Remind Me":** Go back to the `ComingSoonCarousel` in the `HomeScreen`. Its "Remind Me" button must now add a row to the `user_reminders` table for the.

4.  **Main UI (Dark Theme):** Create the `MyListScreen` with:

    * A top tab bar for **"Following"**, **"History"**, and **"Reminder Set"**. Style the active tab.

    * An **"Edit" icon** (light color) in the top-right corner.

6.  **State Management:** Create three state variables in `MyListScreen`:

    * `isEditing` (default: false), toggled by the "Edit" icon.

    * `selectedItems` (default: `[]`).

    * `showDeleteModal` (default: false).

8.  **"Following" Tab:**

    * Fetch all `series` from the `user_following` table. Display as a vertical list (dark theme). Show progress (e.g., "EP.6 / EP.74").

    * `onClick` (when `isEditing` is false) must call `MapsToPlayer(series.id, last_watched_episode_id)`.

    * At the bottom, add a "Most Trending" horizontal carousel (dark theme).

10.  **"History" Tab:**
    * Fetch all shows from the user's `watch_history` table. Display as a vertical list (dark theme).

    * `onClick` (when `isEditing` is false) must call `MapsToPlayer(series.id, last_watched_episode_id)`.

12.  **"Reminder Set" Tab:**
    * Fetch all `series` from the `user_reminders` table. Display as a vertical list (dark theme).
    * **Empty State:** If the list is empty, show the placeholder UI (icon + text, dark theme) with the "Watch popular dramas" button (styled as primary CTA).

13.  **Edit Mode Logic (when `isEditing` is true):**
    * **Conditional UI (Dark Theme):** Hide the top tab bar. Show a light "Choose" title and "Cancel" button.
    * **Checkboxes:** Show a circular checkbox (styled for dark theme) next to each item. Add a slight dark overlay to selected items' thumbnails.
    * **Selection:** Tapping a checkbox adds/removes its `id` from the `selectedItems` array.
    * **Delete Button:** Show a "Remove" button (dark theme, potentially red text/icon) at the bottom. It must be **inactive** (grayed out) if `selectedItems.length === 0` and **active** (brighter color) otherwise.

14. **Delete Action (with Confirmation):**
    * When the active "Remove" button is clicked, it must set `showDeleteModal = true`.
    * **Create Delete Modal (Dark Theme):** Render a modal when `showDeleteModal` is true. Style it for the dark theme. It must say "Remove videos", ask for confirmation, and have "Cancel" and "Remove" buttons (use primary CTA style for "Remove").
    * **Cancel:** The "Cancel" button sets `showDeleteModal = false`.
    * **Confirm Delete:** The "Remove" button must:
        1.  Call a **Supabase Edge Function** to delete all rows from the *correct table* where the `id` is in the `selectedItems` array.
        2.  Clear `selectedItems`, set `isEditing = false`, and set `showDeleteModal = false`."

---

### **Phase 9: Build the 'ProfileScreen' & Auth Flow (REVISED)**

This phase builds the central hub for the user's account and monetization.

**Follow-up Prompt:**

"Let's build the `ProfileScreen` and add the Membership purchase flow. Use the dark theme throughout.

1.  **Props:** It must accept navigation functions like `MapsToLogin`, `MapsToStore`, `MapsToHistory`, `MapsToRewards`, `MapsToTerms`, `MapsToMyWallet`, `MapsToLanguage`, `MapsToDownloads`, `MapsToHelpFeedback`, and `MapsToSettings`. It also needs the `showCopiedToast` state and its setter.

2.  **Main `ProfileScreen` UI (Dark Theme):**
    * **Login/User Info:**
        * If *not* logged in, show "Log in >" (light text). `onClick` calls `props.navigateToLogin()`.
        * If *logged in*, show the user's email and "ID: [user_id]" (light text).
        * Add a **copy icon** (light color) next to the ID. `onClick` must:
            1.  Call `document.execCommand('copy')` with the user's ID.
            2.  Set `showCopiedToast(true)` for 3 seconds.
    * **"Copied" Toast:** In the main `App` component, render a simple "Copied" message toast (dark theme styled) in the center of the screen when `showCopiedToast` is true.
    * **Membership Banner:** A styled banner (gold/yellow gradient background?) that says "Join Membership". Use primary CTA style for the "Join" button. `onClick` calls `props.navigateToStore()`.
    * **Menu List:** A list of clickable rows (dark theme):
        * "History" (calls `props.navigateToHistory()`).
        * "Top Up" (navigates to `StoreScreen`).
        * "My Wallet" (calls `props.navigateToMyWallet()`). Show coin balance here (light text).
        * "Earn Rewards" (navigates to `RewardsScreen`). Show badge if applicable.
        * "Language" (calls `props.navigateToLanguage()`). Show current language.
        * "Downloads" (calls `props.navigateToDownloads()`).
        * "Help & feedback" (calls `props.navigateToHelpFeedback()`). (**Deferred Feature**)
        * "Settings" (calls `props.navigateToSettings()`).

3.  **Build `LoginScreen` (Dark Theme):**
    * This component should use **Supabase Auth** to provide styled 'Sign in with Google', 'Sign in with Apple', and 'Sign in with Facebook' buttons.
    * On successful login, it should navigate back to the `ProfileScreen`.

4.  **Build `StoreScreen` (Membership Section - REVISED):**
    * Add a **"MEMBERSHIP" section** (dark theme) below the "COINS" section.
    * Add the **Weekly/Yearly** toggleable options (highlight selected).
    * List all the benefits (light text with icons).
    * Add the "Tips" section with clickable "Terms of Use" and "Privacy Policy" links (light colored links). Navigate to `TermsOfUseScreen`.
    * **Payment Logic:** Clicking a membership option must trigger the **Paystack/Flutterwave** payment flow (showing a native-style payment sheet) for the selected plan, using **GHS (₵)**.
    * **Supabase Edge Function:** On successful payment, a webhook must trigger a Supabase function to:
        1. Update the user's `has_membership` and `membership_expires_at` columns in the `users` table.
        2. Log the transaction in the `purchase_history` table."

---

### **Phase 10: Build the 'RewardsScreen' (FINAL)**

This is the new gamification/loyalty system.

**Follow-up Prompt:**

"Let's build the `RewardsScreen component` with its two tabs and all reward logic. Ensure everything uses the dark theme.

1.  **Props:** It must accept `MapsToPointsHistory`, `MapsToStore`, `MapsToCoinPurchase`, and the `showToastMessage` setter.

2.  **State:** Create a state variable `showMembershipSheet` (default: false).

3.  **Main UI (Dark Theme):** Create the `RewardsScreen` with a top tab bar for "Reward coins" and "Member Points". Style active tab.

4.  **Build "Member Points" Tab (Dark Theme):**

      * **Navigation:**

          * Add a "[Points] >" button (light text) that calls `props.navigateToPointsHistory()`.
          
          * Add a "Rules" button (light text) that toggles a new `PointsRulesModal` (a modal with static text, styled for dark theme).
      
      * **User Points:** Show the user's current `points` balance (light text).
      
      * **Daily Points:** Show a "Daily points" treasure chest section.
          
          * Add a **"Claim Points"** button (primary CTA style). Make it inactive/gray if already claimed today.
          
          * `onClick`, check if the user `has_membership`.
          
          * If `true`, call a **Supabase Edge Function** ('claim-daily-points'). This function checks `daily_reward_claims`, grants points,             and logs the claim in `user_points_history`.
          
          * If `false`, call `props.showToastMessage('Only members can claim this reward')`.
      
      * **Redeem Points:**
          
          * Fetch and display all items from the `redeemable_items` table (e.g., "5-Day Membership Extension"). Style list items for dark               theme.
          
          * Each item has a "Redeem" button (primary CTA style). Make inactive if user lacks points.
          
          * `onClick`, check if the user `has_membership`.
          
          * If `true`, call a **Supabase Edge Function** ('redeem-item'). This function checks `points` balance, subtracts points, grants               the reward, and logs it in `user_points_history`.
          
          * If `false`, call `props.showToastMessage('Only members can claim this reward')`.
      
      * **Upsell Section:**

          * Add the "Become a member" section with a **"Detail >**" link (light text) that calls `props.navigateToStore()`.
          
          * Add a **"Join Now"** button (primary CTA style) that sets `showMembershipSheet(true)`.

5.  **Build "Reward Coins" Tab (FINAL - Dark Theme):**

      * **UI:** Show the user's *reward_coins* balance (light text).
      
      * **Rules Button:** Add a "Rules" button (light text) that opens a RewardCoinsRulesModal (dark theme styled modal).
      
      * **Daily Check-in:**
          
          * Create a 7-day "Daily Check-in" UI (dark theme styled). Highlight current day/claimed days.
          
          * Check the user's `last_check_in_date` and `check_in_streak` to show progress.
          
          * Add a "Check-in" button (primary CTA style). Change text to "Signed" or disable if already checked in today. On click, call a               **Supabase Edge Function ('daily-check-in')**.

          * This function grants `reward_coins`, updates `last_check_in_date`, increments `check_in_streak`, and logs in
            `reward_coin_history`.
      
      * **"Earn Rewards" Task List (FINAL - Dark Theme):**

           * Fetch the user's `user_tasks_completed` table to know which tasks are done.
           
           * Fetch the user's `ads_watched_today` count. Style list rows for dark theme.
           
           * **Task: "Login with any account":**
               
               * Button text is "Claim" (primary CTA style) if not claimed, "Claimed" (grayed out) if done.
               
               * `onClick`: Call a Supabase function ('claim-task') with 'task_login'. Show toast.
           
           * **Task: "Turn push notification":**
               * Button text is "Claim" or "Claimed".
               
               * `onClick`: Trigger Notification.requestPermission(). On 'granted', call Supabase function ('claim-task') with 'task_push'.                   Show toast.

           * **Task: "Watch a video to earn coins (x/15)":**
               
               * UI: Show progress like `(1/15)`.
               
               * **Button:** Text is "Watch" (primary CTA style). Disable if `ads_watched_today` >= 15.
               
               * `onClick`:
                  
                  1. * Integrate a 3rd-Party **Rewarded Video Ad SDK**.
                  
                  2. * Call SDK to show ad.
                  
                  3. * `onAdCompleted` **Callback:** Call Supabase function ('claim-ad-reward'). Update state. Show toast.
           
           * **Task: "Follow on YouTube" (REVISED):**
               
               * Button text is "Follow" (primary CTA style), "Claim" (primary CTA style), or "Claimed" (grayed out).
               
               * **State:** Need `hasFollowedYoutube`.
               
               * **"Follow"** `onClick`: Open YouTube URL. Set hasFollowedYoutube = true.
               
               * **"Claim"** `onClick`: Call Supabase function ('claim-task') with 'task_youtube'. Show toast.
           
           * **Task: "Get more coins":**
               
               * Button text is "Go" (primary CTA style). `onClick` calls `props.navigateToStore()`.

6.  **Membership Bottom Sheet:**

      * Create a `MembershipBottomSheet` component (dark theme styled).
      
      * Render it when `showMembershipSheet` is true.
      
      * Show Weekly/Yearly options and payment button (reusable logic from `StoreScreen`)."

---

### **Phase 11: Build 'Detailed Points History'**

This is the new screen to show all point transactions.

**Follow-up Prompt:**

"Let's build the `DetailedPointsHistoryScreen` component using the dark theme.

1. **Props:** It must accept a `MapsToRewards` function.

2. **UI (Dark Theme):** Create a new screen with a "Back" arrow (light color, calls `MapsToRewards`) and a title "Detailed Points History"       (light text).

3. **Data Fetching:** Fetch all records for the current user from the `user_points_history` table in Supabase, ordered by `created_at`           descending.

4. **List (Dark Theme):** Render the records in a vertical list. Each row should show the `reason` and `points_change` (light text, use          green/red for positive/negative changes).

5. **Empty State (Dark Theme):** If there are no records, show an icon and the text **"No Records"** (light color)."

---

### **Phase 12: Build Dedicated 'HistoryScreen'**

This builds the standalone history page accessed from the Profile screen.

**Follow-up Prompt:**

"Let's build the dedicated `HistoryScreen` component using the dark theme.

1. **Props:** It must accept `MapsToPlayer` and `MapsToProfile`.

2. **UI (Dark Theme):** Create a new screen with a "Back" arrow (calls `MapsToProfile`), a title "History", and an "Edit" icon in the top-       right corner.

3. **Data Fetching:** Fetch all shows from the user's `watch_history` table (grouped by `series_id`, showing the latest episode for each         series).

4. **List (Dark Theme):** Display the fetched history as a vertical list. Each item should show the series poster, title, and the last           watched episode number.

5. **Click-to-Play:** When *not* in edit mode, tapping an item must call `props.navigateToPlayer(series.id, last_watched_episode_id`).

6. **Implement Bulk Edit/Delete:** Re-implement the exact same 'Edit Mode' logic from Phase 8 (steps 5, 9, 10), ensuring all UI elements (Choose/Cancel header, checkboxes, Remove button, confirmation modal) are styled for the dark theme. The 'Confirm Delete' action must call the Supabase function to delete the selected items from the `watch_history` table."

---

### **Phase 13: Build 'MyWalletScreen'**

This builds the central wallet screen.

**Follow-up Prompt:**

"Let's build the `MyWalletScreen` component using the dark theme.

1. **Props:** It must accept `MapsToStore`, `MapsToTransactionHistory`, `MapsToRewardCoinsHistory`, `MapsToConsumptionRecords`, and `MapsToProfile`.

2. **UI (Dark Theme):** Create the `MyWalletScreen` component with:

   * A "Back" arrow (calls `MapsToProfile`).

   * Display for `coins` (Paid) balance (large light text).

   * Display for `reward_coins` (Earned) balance (large light text).

   * A prominent **"Top Up"** button (primary CTA style, calls `MapsToStore`).

   * Clickable rows (dark theme styled) for:

     * "Transaction History" (calls `MapsToTransactionHistory`).

     * "Reward Coins" (calls `MapsToRewardCoinsHistory`).

     * "Consumption Records" (calls `MapsToConsumptionRecords`).

   * An **"Autoplay next video"** toggle switch (styled for dark theme).

4. **Data Fetching:** Fetch the user's `coins`, `reward_coins`, and `autoplay_preference` from the `users` table in Supabase.

5. **Toggle Logic:** The "Autoplay" toggle must update the `autoplay_preference` value in the user's row in the `users` table."

---

### **Phase 14: Build 'TransactionHistoryScreen'**

Builds the screen showing real money purchases.

**Follow-up Prompt:**

"Let's build the `TransactionHistoryScreen` component using the dark theme.

1. **Props:** It must accept `MapsToMyWallet`.

2. **UI (Dark Theme):** Create a screen with a "Back" arrow (calls `MapsToMyWallet`) and title "Transaction History".

3. **Data Fetching:** Fetch all records for the user from `purchase_history` table, ordered descending.

4. **List (Dark Theme):** Display records showing item details, amount (GHS), and date.

5. **Empty State (Dark Theme):** If no records, show "You don't have any purchases"."

---

### **Phase 15: Build 'RewardCoinsHistoryScreen'**

Builds the screen showing earned reward coins.

**Follow-up Prompt:**

"Let's build the `RewardCoinsHistoryScreen` component using the dark theme.

1. **Props:** It must accept `MapsToMyWallet`.

2. **UI (Dark Theme):** Create a screen with a "Back" arrow (calls `MapsToMyWallet`) and title "Reward Coins".

3. **Data Fetching:** Fetch all records for the user from `reward_coin_history` table, ordered descending.

4. **List (Dark Theme):** Display records showing `coins_change` (e.g., "+20") and `reason`.

5. **Empty State (Dark Theme):** If no records, show placeholder."

---

### **Phase 16: Build 'ConsumptionRecordsScreen'**

Builds the screen showing spent coins.

**Follow-up Prompt:**

"Let's build the `ConsumptionRecordsScreen` component using the dark theme.

1. **Props:** It must accept `MapsToMyWallet`.

2. **UI (Dark Theme):** Create a screen with a "Back" arrow (calls `MapsToMyWallet`) and title "Consumption Records".

3. **Data Fetching:** Fetch all records for the user from `consumption_history` table, ordered descending.

4. **List (Dark Theme):** Display records showing episode unlocked, `coins_spent`, `coin_type` ('Paid' or 'Reward'), and date.

5. **Empty State (Dark Theme):** If no records, show placeholder."

---

### **Phase 17: Build 'LanguageScreen'**

Builds the language selection screen.

**Follow-up Prompt:**

"Let's build the LanguageScreen component using the dark theme.

1. **Props:** It must accept `MapsToProfile`.

2. **UI (Dark Theme):** Create a new screen with a "Cancel" button (light text, calls `MapsToProfile`) and a title "Language" (light text).

3. **Data Fetching:** Fetch the user's current `language_preference` from the `users` table.

4. **Language List (Dark Theme):** Display a list of available languages (light text). Show a checkmark (e.g., primary color) next to the        current language.

5. **Selection Logic:** Tapping a language must:
     
     * Update the `language_preference` in the user's row in the `users` table.
     
     * Update the app's language using the i18n library.
     
     * Navigate back to the `ProfileScreen`."

---

### **Phase 18: Build 'DownloadsScreen'**

Builds the screen for managing offline downloads (Membership required).

**Follow-up Prompt:**

"Let's build the DownloadsScreen component using the dark theme.

1. **Props:** It must accept `MapsToProfile` and `MapsToPlayer`.

2. **UI (Dark Theme):** Create a new screen with a "Back" arrow (calls `MapsToProfile`) and a title "Download". Show available device            storage (light text) at the bottom.

3. **Membership Check:** Fetch the user's `has_membership` status from Supabase.

4. **Conditional Rendering:**
     
     * If `has_membership` is false: Show the empty state icon and text: "Your download list is empty." (light color). Maybe add an upsell         button to the `StoreScreen`.
     
     * If `has_membership` is true:

       * Implement offline storage (e.g., using IndexedDB via a library like `Dexie.js` or Service Workers).

       * Add a "Download" button to the `EpisodeSheet` in the `PlayerScreen` (only visible to members). This button downloads the video              file (from Cloudinary) and saves it to local storage, associating it with the `episode_id`.

       * Fetch the list of locally stored `episode_ids`.

       * Query Supabase to get the details (poster, title) for these episodes.

       * Display the downloaded episodes in a list (dark theme styled).

       * Tapping a downloaded episode should call `MapsToPlayer`, passing a flag or special URL to indicate it should play from local                storage, not stream.

       * Add functionality (e.g., swipe-to-delete or an edit mode) to manage/delete downloaded files.

5. **(Advanced - Optional):** Implement background downloading and progress indicators."

---

### **Phase 19: Build 'SettingsScreen' (FINAL)**

Builds the main settings page.

**Follow-up Prompt:**

"Let's build the `SettingsScreen` component using the dark theme.

1. **Props:** It must accept `MapsToProfile`, `MapsToManageMembership`, `MapsToAccountDeletion`, `MapsToAbout`, and the `cacheSizeMB` state      setter. It also needs the Supabase `signOut` function.

2. **UI (Dark Theme):** Create a screen with a "Back" arrow (calls `MapsToProfile`) and title "Settings".

3. **Menu List (Dark Theme):** Create clickable rows for:
     
     * "Manage Membership" (calls `MapsToManageMembership`).
     
     * "Clear Cache" (shows current `cacheSizeMB`, light text).
     
     * "Account Deletion" (calls `MapsToAccountDeletion`).
     
     * "Download with mobile data allowed" (Toggle switch, styled for dark theme).
     
     * "About" (calls `MapsToAbout`). (**Deferred Feature**)
     
     * A **"Log out"** button at the bottom (styled distinctly, perhaps red text on dark background).

4. **Clear Cache Logic:**

     * The "Clear Cache" button should trigger a function to clear relevant browser/local storage (e.g., image thumbnails, not downloaded          videos). Use standard browser APIs.
     
     * After clearing, it should update the `cacheSizeMB` state to 0.0. Show a confirmation toast.

5. **Mobile Download Toggle Logic:**

     * This toggle must update the `allow_mobile_download` value in the user's row in the `users` table.

6. **Log Out Logic:**

     * The "Log out" button must call the **Supabase Auth** `signOut()` function.
     
     * On successful sign out, navigate the user back to the `LoginScreen` or `HomeScreen`."

---

### **Phase 20: Build 'ManageMembershipScreen' (NEW)**

Builds the screen for managing an active subscription.

**Follow-up Prompt:**

"Let's build the `ManageMembershipScreen` component using the dark theme.

1. **Props:** It must accept `MapsToSetting` and `MapsToStore`.

2. **UI (Dark Theme):** Create a screen with a "Back" arrow (calls `MapsToSettings`) and title "Manage Membership".

3. **Membership Check:** Fetch the user's `has_membership` status and `membership_expires_at` date from Supabase.

4. **Conditional Rendering (Dark Theme):**
     
     * If `has_membership` is false: Show a message like "You are not currently a member" (light text) and an upsell button linking to the         `StoreScreen` (primary CTA style).
     
     * If `has_membership` **is true:**

       * Display the current plan (e.g., "Weekly Plan") (light text).

       * Show the expiry/renewal date (`membership_expires_at`) (light text).

       * Provide information or a button/link (styled appropriately) on how to cancel the subscription via the payment provider                      (Paystack/Flutterwave) or platform store."

---

### **Phase 21: Build 'AccountDeletionScreen' (NEW)**

Builds the screen for account deletion confirmation.

**Follow-up Prompt:**

"Let's build the `AccountDeletionScreen` component using the dark theme.

1. **Props:** It must accept `MapsToSettings` and likely a function to navigate back to the `LoginScreen` after deletion.

2. **UI (Dark Theme):** Create a screen with a "Back" arrow (calls `MapsToSettings`) and title "Account Deletion".

3. **Confirmation (Dark Theme):**
    
     * Display warnings about permanent deletion (light text).
     
     * Add a checkbox (styled for dark theme): "I understand and wish to proceed."
     
     * Add a **"Delete Account"** button (styled dangerously, e.g., red background), which is **disabled** (grayed out) until the checkbox         is checked.

4. **Deletion Logic:**
     
     * `onClick` for the enabled "Delete Account" button must:

        1. * Call a **Supabase Edge Function ('delete-user-account')**. This function must securely handle deleting the user's data from                 all relevant tables (users, history, lists, etc.) and their Auth entry.
        
        2. * On success, sign the user out and navigate them to the `LoginScreen`."

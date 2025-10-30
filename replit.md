# AfriShorts - African Short-Form Video Streaming Platform

## Overview

AfriShorts is a mobile-first, short-form video streaming application focused on African micro-dramas and series. The platform delivers TikTok-style vertical video content showcasing authentic African storytelling from across the continent. It features a gamified reward system with coins, points, and membership tiers to drive user engagement.

**Core Purpose**: Provide an immersive, content-first streaming experience for African short-form dramas with a freemium business model combining ad-supported viewing, virtual currency purchases, and premium memberships.

**Current Status** (Updated: October 30, 2025): 
- Phases 4 and 4.5 completed
- Full-featured PlayerScreen with HTML5 video player, watch history tracking, autoplay, overlays, and bottom sheets
- ForYouScreen with vertical TikTok-style feed using Swiper
- HookPlayer component for vertical feed showing first episodes with like/follow functionality
- All data fully integrated with Supabase backend
- Cloudinary integration fully implemented with image/video upload and delete endpoints
- User must follow setup instructions in SUPABASE_SETUP.md to run migrations and seed data

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite for development/bundling

**UI Design System**:
- Dark-mode-first aesthetic inspired by DramaBox/ReelShort/TikTok
- Shadcn/ui components with Radix UI primitives
- Tailwind CSS with custom design tokens for dark backgrounds (#111111, #1A1A1A)
- Gradient accents (primary: #FF4E50 → #F9D423) for CTAs and active states
- Mobile-first responsive design with vertical (9:16) video aspect ratios

**State Management**:
- React Query (TanStack Query) for server state and data fetching
- Local component state for UI interactions
- No global state management library (relies on prop drilling and composition)

**Routing**: 
- Client-side view switching via state management (no react-router)
- Single-page application with conditional rendering based on `currentView` state
- Bottom navigation bar controls primary navigation flow

**Internationalization**: react-i18next for multi-language support (currently English only, extensible to French, Swahili, Hausa, Yoruba, Igbo, Amharic, Arabic)

**Key Pages/Views**:
- HomeScreen: Tabbed interface (Popular, New, Rankings, Kumawood, Naija)
- ForYouScreen: Vertical TikTok-style feed using Swiper, shows random first episodes with HookPlayer component
- PlayerScreen: Full-featured video player with HTML5 controls, watch history tracking (every 15s), autoplay next episode, tap-to-toggle overlays, seek bar, and bottom sheets (Episodes, Speed, Settings)
- ProfileScreen: User account, settings, wallet management
- StoreScreen: Coin purchase packages
- RewardsScreen: Daily tasks, achievements, points system

### Backend Architecture

**Server Framework**: Express.js on Node.js

**API Design**: RESTful JSON endpoints under `/api/*` namespace
- `/api/series/*` - Series and episode data retrieval
- Category-based endpoints (popular, new, ranking, kumawood, naija, coming-soon)

**Storage Layer**: 
- Abstracted through `IStorage` interface in `server/storage.ts`
- Implementation: `SupabaseStorage` class using Supabase client
- Mapper functions (`server/mappers.ts`) convert snake_case database fields to camelCase TypeScript types
- All queries use the mapping layer to ensure type compatibility between Supabase responses and frontend code

**Build Process**:
- Development: tsx for TypeScript execution with hot reload
- Production: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.js`

### Data Storage

**Database**: PostgreSQL via Supabase

**Schema Design** (defined in `shared/schema.ts` using Drizzle ORM):

**Core Tables**:
- `users`: User accounts with email/password, coins (purchasable), rewardCoins (earned), points, membership status, preferences
- `series`: TV series/shows with metadata (title, synopsis, poster, genre, rating, tags, rank)
- `episodes`: Individual episodes linked to series (episode_number, title, video_url)
- `watch_history`: Tracks user viewing progress (unique on user_id, series_id, episode_id)
- `user_following`: Tracks series that users have liked/followed (unique on user_id, series_id)

**Gamification Tables**:
- `redeemable_items`: Items users can redeem with points (membership extensions, bonuses)
- `daily_reward_claims`: Tracks daily check-in streaks
- `user_tasks_completed`: Completed tasks tracking
- `user_points_history`: Points transaction ledger

**Transaction Tables**:
- `purchase_history`: Coin purchase records
- `reward_coin_history`: Reward coin earnings history
- `consumption_history`: Episode viewing records

**Data Migration**: SQL migrations in `server/migrations/001_initial_schema.sql` (manually executed via Supabase SQL Editor - see SUPABASE_SETUP.md)

**Seeding**: `server/seed.ts` populates database with mock series data using Supabase client. Run with `npx tsx server/seed.ts` after migration.

**Setup Required**: Before the app can fetch data, the user must:
1. Run the migration SQL in Supabase SQL Editor to create tables
2. Run the seed script to populate initial data
3. See SUPABASE_SETUP.md for detailed instructions

### Authentication & Authorization

**Current State**: Basic email/password authentication planned (LoginScreen exists but not fully implemented)

**Session Management**: Express session middleware mentioned in imports (`connect-pg-simple`) but not actively configured

**Authorization**: No role-based access control; membership tiers control content access at application level

### External Dependencies

**Supabase**:
- Purpose: Managed PostgreSQL database and authentication backend
- Configuration: Requires `SUPABASE_PROJECT_URL` and `SUPABASE_ANON_KEY` environment variables
- Client: `@supabase/supabase-js` v2.76.1
- Usage: All database operations route through Supabase client

**Cloudinary**:
- Purpose: Video and image CDN hosting, optimization, and delivery
- Configuration: Requires `CLOUDINARY_URL` environment variable (contains cloud name, API key, and secret)
- SDK: `cloudinary` v2 package for Node.js
- Configuration File: `server/cloudinary.ts` initializes the Cloudinary client
- Upload Endpoints:
  - `POST /api/upload/image` - Upload images (jpg, jpeg, png, webp, gif) to `afrishorts/images` folder
  - `POST /api/upload/video` - Upload videos (mp4, mov, avi, mkv, webm) to `afrishorts/videos` folder
  - `DELETE /api/upload/:publicId` - Delete uploaded assets by public ID (requires `ADMIN_TOKEN` in `x-admin-token` header for security)
- Integration: All video URLs (`videoUrl`) and poster images (`posterUrl`) reference Cloudinary endpoints
- Format: URLs structured as `https://res.cloudinary.com/[cloud-name]/...`
- Upload Handler: Uses multer middleware with memory storage for file handling before Cloudinary upload
- Security: DELETE endpoint protected with admin token authentication to prevent unauthorized asset deletion

**Drizzle ORM**:
- Purpose: Type-safe database schema definition and query building
- Configuration: `drizzle.config.ts` points to PostgreSQL via `DATABASE_URL`
- Schema: TypeScript schema in `shared/schema.ts` shared between client and server
- Note: Configuration references `DATABASE_URL` but application uses Supabase client directly (potential architectural inconsistency)

**UI Component Libraries**:
- Radix UI: Headless component primitives (@radix-ui/react-*)
- Shadcn/ui: Pre-built accessible components built on Radix
- Lucide React: Icon library
- class-variance-authority + clsx: Conditional CSS class utilities
- Swiper: Touch slider for vertical feed (swiper, swiper/react)

**Development Tools**:
- Vite: Frontend dev server and build tool
- esbuild: Server-side bundling for production
- tsx: TypeScript execution for development
- TypeScript: Type safety across full stack

**Design Tokens**:
- Custom CSS variables defined in `client/src/index.css`
- Tailwind configuration extends base theme with HSL-based color system
- Dark mode enforced via `dark` class on document root
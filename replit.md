# AfriShorts - African Short-Form Video Streaming Platform

## Overview

AfriShorts is a mobile-first, short-form video streaming application focused on African micro-dramas and series. The platform delivers TikTok-style vertical video content showcasing authentic African storytelling from across the continent. It features a gamified reward system with coins, points, and membership tiers to drive user engagement.

**Core Purpose**: Provide an immersive, content-first streaming experience for African short-form dramas with a freemium business model combining ad-supported viewing, virtual currency purchases, and premium memberships.

**Current Status** (Updated: October 28, 2025): Fully migrated from mock data to Supabase backend. The database schema, API endpoints, and frontend components are all configured to work with Supabase. User must follow setup instructions in SUPABASE_SETUP.md to run migrations and seed data.

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
- ForYouScreen: Personalized recommendations
- PlayerScreen: Video playback with episode navigation
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
- Purpose: Video and image CDN hosting
- Integration: All video URLs (`videoUrl`) and poster images (`posterUrl`) reference Cloudinary endpoints
- Format: URLs structured as `https://res.cloudinary.com/demo/...`

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

**Development Tools**:
- Vite: Frontend dev server and build tool
- esbuild: Server-side bundling for production
- tsx: TypeScript execution for development
- TypeScript: Type safety across full stack

**Design Tokens**:
- Custom CSS variables defined in `client/src/index.css`
- Tailwind configuration extends base theme with HSL-based color system
- Dark mode enforced via `dark` class on document root
# AfriShorts Design Guidelines

## Design Approach
**Reference-Based Approach**: Inspired by short-form video streaming apps like DramaBox, ReelShort, and TikTok. Focus on immersive, content-first experience with dark aesthetics and vibrant accent colors.

## Core Design Principles
1. **Mobile-First**: All layouts optimized for vertical mobile screens first
2. **Content Immersion**: Minimize UI chrome on viewing screens, maximize content visibility
3. **Dark Mode Native**: Black/dark grey foundation with high-contrast text and vibrant CTAs
4. **Instant Recognition**: Users should immediately identify video content and actions

---

## Color Palette

### Backgrounds
- Primary Background: `#111111` (pure black)
- Secondary Background: `#1A1A1A` (dark grey)
- Card/Container: `#222222` (slightly lighter grey)
- Elevated surfaces: `#2A2A2A`

### Text
- Primary Text: `#FFFFFF` (white)
- Secondary Text: `#B0B0B0` (light grey)
- Tertiary/Muted: `#808080` (medium grey)

### Accent & CTAs
- Primary Gradient: `#FF4E50` → `#F9D423` (pink to orange/yellow)
- Use as gradient backgrounds for primary buttons, progress indicators, active states
- Secondary actions: Solid `#FF4E50` or `#F9D423`
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)

---

## Typography

### Font Families
- Primary: `'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif`
- Fallback: System fonts for performance

### Type Scale
- **Series/Episode Titles**: 20px-24px, font-weight: 700 (bold)
- **Screen Headers**: 28px-32px, font-weight: 800 (extrabold)
- **Body Text**: 14px-16px, font-weight: 400 (regular)
- **Metadata** (duration, episode numbers): 12px-14px, font-weight: 500 (medium)
- **Captions/Labels**: 11px-12px, font-weight: 400
- **Button Text**: 14px-16px, font-weight: 600 (semibold)

### Line Heights
- Headers: 1.2
- Body: 1.5
- Compact lists: 1.4

---

## Layout System

### Spacing Units (Tailwind)
Use consistent spacing: `p-2`, `p-4`, `p-6`, `gap-4`, `mb-6`, `mt-8`
- Tight spacing: 8px (2 units)
- Standard spacing: 16px (4 units)
- Generous spacing: 24px (6 units)
- Section spacing: 32px (8 units)

### Container Strategy
- **Full-Width Sections**: Video players, hero banners
- **Browsing Screens**: Padding `px-4` on mobile, `px-6` on tablet
- **Max Width**: None for mobile-first; use full viewport width

### Grid Patterns
- **Home/Browse Grids**: 2 columns on mobile (`grid-cols-2`), 3-4 on tablet (`md:grid-cols-3 lg:grid-cols-4`)
- **Gap**: `gap-3` or `gap-4` for content grids
- **Episode Lists**: Single column stacked vertically with thumbnails

---

## Component Library

### Bottom Navigation Bar
- **Position**: Sticky at bottom (`sticky bottom-0`)
- **Background**: `#1A1A1A` with subtle top border (`border-t border-gray-800`)
- **Height**: 60px-64px
- **Icons**: 24px, spaced evenly with labels below (10px-12px text)
- **Active State**: Gradient text color (`#FF4E50` → `#F9D423`) or solid accent
- **Labels**: Always visible, no icon-only state

### Video Cards (Home/Browse)
- **Aspect Ratio**: 9:16 (portrait) for thumbnails
- **Thumbnail**: Full-bleed image with rounded corners (`rounded-lg`, 8px-12px)
- **View Count Overlay**: Bottom-left corner of thumbnail, white text with play icon (12px, `Play` icon 12px)
- **Rating Badge**: Top-right corner, backdrop-blur pill with star icon
- **Metadata Placement**: BELOW thumbnail (not overlay) - white title (14px-16px bold), grey genre/subtitle (12px)
- **Spacing**: `mb-2` between thumbnail and text metadata, `space-y-1` for metadata stack
- **Hover/Press**: Subtle scale (`scale-105`) and shadow increase on thumbnail only

### Player Screen (Minimalist)
- **Background**: Pure black (`#000000`)
- **Video**: Full viewport height, centered
- **Controls**: Overlay with auto-hide after 3-5s
- **Control Bar Background**: `rgba(0,0,0,0.6)` with blur (`backdrop-blur-md`)
- **Icons**: White, 28px-32px
- **Progress Bar**: Thin (3px-4px), gradient fill (`#FF4E50` → `#F9D423`), grey track
- **Episode Navigation**: Minimalist arrows (left/right) or swipe gesture indicators

### Primary Buttons
- **Style**: Gradient background (`bg-gradient-to-r from-[#FF4E50] to-[#F9D423]`)
- **Padding**: `px-6 py-3` or `px-8 py-4` for prominent CTAs
- **Border Radius**: `rounded-full` (fully rounded)
- **Text**: White, 14px-16px, font-weight 600
- **Hover/Active**: Brightness increase (`brightness-110`) or subtle shadow
- **Disabled**: Opacity 50%, gradient remains

### Secondary Buttons
- **Style**: Transparent with border (`border-2 border-gray-600`)
- **Text**: Light grey (`#B0B0B0`)
- **Hover**: Border and text change to gradient or accent color
- **Padding**: Same as primary

### Lists (My List, History, etc.)
- **Layout**: Vertical stack, full width
- **Item Height**: 80px-100px
- **Thumbnail**: 16:9 or 1:1, 80px-100px width, left-aligned
- **Content**: Right of thumbnail - title (16px bold), metadata (12px grey), episode info
- **Separator**: 1px border-bottom (`border-gray-800`)
- **Action Icons**: Right side - 3-dot menu, download icon, etc. (20px, light grey)

### Profile/Settings Screens
- **Header**: Large avatar (80px-100px), centered, with gradient border
- **Username**: 20px-24px bold, centered below avatar
- **Stats Row**: Points/Coins/Membership - 3 columns, centered text, gradient accent for values
- **Menu Items**: Full-width rows (56px height), icon left (24px), chevron right (16px)
- **Background**: `#111111` with `#1A1A1A` card backgrounds

### Store/Rewards Screens
- **High Visual Density**: Tightly packed offer cards
- **Card Style**: `bg-[#1A1A1A]` with gradient border on featured items
- **Pricing**: Large, bold (24px), white with gradient accent for discount badges
- **Coin Icons**: 20px-24px, bright gold/yellow (`#FFD700`)
- **Purchase Buttons**: Full-width within cards, gradient, prominent

### Toast/Notification
- **Position**: Top-center or bottom-center (above nav)
- **Background**: `#2A2A2A` with subtle shadow
- **Border**: 1px accent gradient or none
- **Text**: White, 14px
- **Duration**: 2-3 seconds auto-dismiss
- **Animation**: Slide-in from top/bottom, fade out

---

## Icons
- **Library**: Heroicons (outline for inactive, solid for active states)
- **Size**: 24px standard, 20px compact, 28px-32px for player controls
- **Color**: Light grey default (`#B0B0B0`), white active, gradient for highlights

---

## Images

### Hero/Featured Content
- **Home Screen Hero**: Full-width banner (16:9 aspect ratio) showcasing trending series
- **Placement**: Top of HomeScreen, immediately below any promotional banner
- **Treatment**: Subtle gradient overlay from left (`rgba(0,0,0,0.7)`) to transparent right, allowing text overlay (series title, CTA button)
- **CTA Button**: Positioned bottom-left or center-left with blurred background (`backdrop-blur-lg bg-white/10`)

### Thumbnails
- **Series Cards**: 9:16 portrait thumbnails with character/scene imagery
- **Episode Lists**: 16:9 landscape thumbnails showing episode-specific scenes
- **Quality**: High-resolution, optimized via Cloudinary

---

## Animations
**Minimal and Purposeful**:
- Navigation transitions: Quick fade (150ms-200ms)
- Card interactions: Subtle scale on press (`scale-105`, 100ms)
- Progress bars: Smooth width transitions
- Auto-hide controls: Fade out (300ms)
- **Avoid**: Excessive page transitions, distracting scroll effects

---

## Accessibility
- Minimum touch target: 44px x 44px
- Color contrast: Ensure 4.5:1 ratio for text on dark backgrounds (already met with white/#B0B0B0 on black)
- Focus indicators: Visible outline or glow on keyboard navigation
- Alt text: All video thumbnails and images

---

## Mobile-First Breakpoints
- **Mobile**: 0-640px (base styles)
- **Tablet**: 641px-1024px (`md:`)
- **Desktop**: 1025px+ (`lg:`) - Use for enhanced layouts, but prioritize mobile experience
# Tournament Hub — Project TODO

## Backend & Database
- [x] Database schema: users, teams, players, player_passports, documents
- [x] Database schema: tournaments, tournament_divisions, teams_in_tournament
- [x] Database schema: games, pools, brackets, rankings
- [x] Database schema: payments, receipts, posts, messages, followers
- [x] tRPC routers: auth, users, passport, tournaments
- [x] tRPC routers: teams, games, rankings, payments, social
- [x] DB migrations pushed

## Branding & Config
- [x] Generate app logo/icon
- [x] Update theme colors (Electric Blue, Charcoal, Gold)
- [x] Update app.config.ts with app name and logo

## Auth & Onboarding
- [x] Role-based navigation routing (tab layout switches by role)
- [x] Role Selector component (modal switcher)

## Athlete Screens
- [x] Athlete Home Feed (upcoming tournaments, activity, passport banner)
- [x] Player Passport screen (digital ID card, document checklist, QR code)
- [x] Athlete Profile (stats, settings, role switcher)
- [x] Tournament Browser screen (search, filter, registration)
- [x] Highlights Feed screen (top plays + community feed)
- [x] National Rankings screen (podium, full list, age group filter)

## Host Screens
- [x] Host Dashboard (stats, revenue chart, tournament list)
- [x] Tournament Management screen (create, manage, schedule, scores)
- [x] Team Roster Management (passport verification, payment status)
- [x] Revenue & Payments screen (overview, transactions, payout)

## Admin Screens
- [x] Admin Overview (platform stats, alerts, quick actions)
- [x] User Management (search, filter, suspend, restore)
- [x] Passport Review Queue (approve/reject with document checklist)
- [x] Payment Oversight (revenue, transactions, disputes)
- [x] Content Moderation (review queue, approve/remove)

## Shared Components
- [x] StatCard, Badge, EmptyState, ScreenHeader components
- [x] RoleSelector modal component

## Static Webpage
- [x] Interactive presentation webpage with charts and visualizations

## Phase 2 — Enhancements & Expansion

### Theme & Branding
- [x] Update theme colors (Black, Red, White, Grey)
- [x] Implement light/dark mode toggle
- [x] Persist theme preference to AsyncStorage
- [x] Generate new sports-tech logo (Overtime/OT7 style - Concept 2)
- [x] Update app.config.ts with new logo URL
- [x] ThemeToggle component created

### Tournament Data Integration
- [x] Build Zorts Sports data ingestion system (database schema)
- [x] zorts_tournaments table for external tournament data
- [x] Support for Championship 7v7, DR7, Battle 7's, etc.
- [x] Store historical results and brackets
- [x] Sync upcoming tournaments

### Team Logo Detection
- [x] Implement automatic team logo detection (database schema)
- [x] team_logos table with confidence scoring
- [x] Search sports databases for logos
- [x] Store logos in S3 media storage
- [x] Add fallback placeholder support

### Host Features
- [x] Entry fee configuration with deadlines (database schema)
- [x] Late fee settings (database schema)
- [x] tournamentWaivers table for document uploads
- [x] waiverSignatures table for digital signatures
- [x] tournamentRequirements table for eligibility rules
- [x] Age/graduation class restrictions
- [x] Roster limits & eligibility rules

### Player Profile Expansion
- [x] Add social media links (Instagram, Twitter, TikTok, YouTube) to athleteProfiles
- [x] Add Hudl film links & highlight reels (existing fields)
- [x] Add player measurables (height, weight, 40-time, vertical) (existing fields)
- [ ] Display recruiting-style profile layout UI

### Stat Entry System
- [x] playerStats table with comprehensive stat tracking
- [x] QB stat tracking (passing yards, TDs, completion %)
- [x] Receiver stats (receptions, yards, TDs)
- [x] Defense stats (INTs, breakups, tackles)
- [x] Team stats (points scored/allowed, W/L record)
- [x] Authorize coaches/team staff to enter stats
- [x] StatEntryForm component created

### Leaderboards
- [x] statLeaderboards table for cached rankings
- [x] National stat leaderboards screen created
- [x] State stat leaderboards screen created
- [x] Filter by graduation class, position, state, tournament, season
- [x] Display top players and stat leaders
- [x] Leaderboard component created
- [x] Added to athlete tab navigation

### UI Modernization
- [x] Apply new color palette (Black, Red, White, Grey) to theme system
- [x] Update dashboard cards with new colors
- [x] Theme toggle button in header
- [ ] Update tournament listings with new colors
- [ ] Update player profiles with new colors
- [ ] Update rankings pages with new colors
- [ ] Update host dashboard with new colors

### Remaining Tasks
- [ ] Integrate Stripe for payments
- [ ] Implement real-time score updates (Socket.IO)
- [ ] Build AI recruiting exposure score engine
- [ ] Connect to Zorts Sports API for live data sync
- [ ] Implement team logo auto-detection service


## Phase 3 — Visual Redesign (ID Card Screens)

### Player ID Card Screen
- [x] Redesign Player ID Card to match National Rankings visual style
- [x] Pure black background with lime-green accents (#39FF14)
- [x] Green person icon in top-left header square
- [x] Bold white "Player ID Card" title
- [x] Gray subtitle text
- [x] Horizontal dark bar with "$15 / 365 days" in bright green
- [x] Central content area with large green person icon
- [x] Three benefits with green checkmarks
- [x] Prominent lime-green "Purchase" button with cart icon

### Coach ID Card Screen
- [x] Redesign Coach ID Card with identical layout structure
- [x] Orange/yellow whistle icon in top-left header square
- [x] Bold white "Coach ID Card" title
- [x] Gray subtitle text
- [x] Horizontal dark bar with "$15 / 365 days" in bright green
- [x] Central content area with large orange whistle icon
- [x] Three benefits with green checkmarks
- [x] Prominent lime-green "Purchase" button with cart icon

### Verification
- [x] Both screens match National Rankings visual style exactly
- [x] Black backgrounds, lime-green accents consistent
- [x] Layout structure identical between Player and Coach screens
- [x] Button styles, spacing, and typography match


## Phase 4 — App Simplification & Premium Redesign

### Bottom Navigation Restructuring
- [x] Reduce bottom tabs to absolute minimum (Home, Tournaments, Leaderboards, Profile)
- [x] Remove Player ID and Coach ID dropdown selectors from tab bar
- [x] Hide admin/host tabs from athlete view
- [x] Simplify tab bar appearance

### Profile Tab Enhancement
- [x] Move Player ID selector to top of Profile screen
- [x] Move Coach ID selector to top of Profile screen
- [x] Create clean dropdown/card-based selector UI
- [x] Allow instant switching between credentials
- [x] Display current active credential prominently

### Leaderboards & Rankings Consolidation
- [x] Create unified Leaderboards/Rankings feature
- [x] Merge national and state rankings into one screen
- [x] Add segmented control for Rankings vs Leaderboards view
- [x] Keep filtering and sorting functionality

### Premium Landing Page (Home Screen)
- [x] Dark-mode sports aesthetic background
- [x] Bold Mississippi Heat 7on7 branding at top
- [x] Hero imagery or subtle video background
- [x] Dynamic stat highlights (top players, recent tournaments)
- [x] Quick-action buttons (Browse Tournaments, View Leaderboards)
- [x] Smooth micro-animations on load
- [x] Professional, fast, exciting visual design
- [x] Instantly engaging layout

### Home Screen Leaderboard Access
- [x] Add prominent Leaderboards button/section to home screen
- [x] Display top 3-5 players as quick preview
- [x] Link to full Leaderboards screen
- [x] Integrate with unified Leaderboards feature

### Navigation Simplification
- [x] Aggressive consolidation of screens and menus
- [x] Remove redundant features
- [x] Zero clutter, maximum clarity
- [x] Intuitive flow requiring no thinking


## Phase 5 — Navigation Revision (Based on Screenshot)

### Bottom Tab Simplification
- [x] Remove Player ID tab from bottom navigation
- [x] Remove Coach ID tab from bottom navigation
- [x] Keep only: Home, Tournaments, Leaderboards, Profile
- [x] Verify clean, minimal bottom bar

### Leaderboard Screen Enhancement
- [x] Move Player ID selector to top of Leaderboard screen
- [x] Move Coach ID selector to top of Leaderboard screen
- [x] Style as prominent segmented controls or pill buttons
- [x] Allow instant switching between credentials
- [x] Consolidate Rankings and Leaderboards in same screen

### Home Screen Quick Access
- [x] Add prominent Leaderboard quick-access button
- [x] Position prominently on landing page
- [x] Link directly to Leaderboard screen

### Testing & Verification
- [x] Test bottom tab navigation flow
- [x] Verify credential switching on Leaderboard
- [x] Confirm home screen quick-access works
- [x] Zero TypeScript errors

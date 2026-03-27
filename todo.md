# Tournament Hub — Project TODO

## Phase 1 — Core App Build
- [x] Database schema: users, teams, players, player_passports, documents
- [x] Database schema: tournaments, tournament_divisions, teams_in_tournament
- [x] Database schema: games, pools, brackets, rankings
- [x] Database schema: payments, receipts, posts, messages, followers
- [x] tRPC routers: auth, users, passport, tournaments, teams, games, rankings, payments, social
- [x] Generate app logo/icon
- [x] Update theme colors (Electric Blue, Charcoal, Gold)
- [x] Role-based navigation routing (tab layout switches by role)
- [x] Athlete Home, Passport, Profile, Tournaments, Feed, Rankings screens
- [x] Host Dashboard, Tournaments, Teams, Payments screens
- [x] Admin Users, Payments, Content screens
- [x] Interactive presentation webpage with charts

## Phase 2 — Enhancements & Expansion
- [x] Update theme colors (Black, Red, White, Grey) with light/dark mode toggle
- [x] Generate new sports-tech logo (Concept 2)
- [x] Zorts Sports data ingestion system (database schema)
- [x] Automatic team logo detection (database schema)
- [x] Host features: entry fees, waivers, requirements (database schema)
- [x] Player profile expansion: social media links, measurables
- [x] Stat entry system with comprehensive stat tracking
- [x] National & state leaderboards with filtering
- [x] StatEntryForm and Leaderboard components

## Phase 3 — Visual Redesign (ID Card Screens)
- [x] Redesign Player ID Card to match National Rankings visual style
- [x] Redesign Coach ID Card with identical layout structure
- [x] Black backgrounds, lime-green accents (#39FF14)
- [x] Icons, titles, subtitles, pricing bars, benefits, purchase buttons

## Phase 4 — App Simplification & Premium Redesign
- [x] Reduce bottom tabs to 4 core tabs (Home, Tournaments, Leaderboards, Profile)
- [x] Move Player ID/Coach ID selectors to Profile tab
- [x] Consolidate Leaderboards and Rankings into unified feature
- [x] Create premium dark-mode landing page with hero imagery
- [x] Add dynamic stat highlights and quick-action buttons
- [x] Implement smooth micro-animations on load

## Phase 5 — Navigation Revision (Based on Screenshot)
- [x] Remove Player ID and Coach ID tabs from bottom navigation
- [x] Keep only 4 core tabs: Home, Tournaments, Leaderboards, Profile
- [x] Move ID selectors to top of Leaderboard screen as segmented controls
- [x] Add prominent Leaderboard quick-access button to home screen

## Phase 6 — UI Update (Screenshot-Based)
- [x] Remove two blue-circled dropdowns from bottom nav bar
- [x] Add "Leaderboard" and "Index Board" selectors to Leaderboard screen
- [x] Style selectors with green/black Mississippi Heat theme
- [x] Implement switching between Leaderboard and Index Board views

## Phase 7 — Facial Recognition Check-In Feature
- [x] Add facial_recognition_checkins table
- [x] Add team_member_invitations table
- [x] Add check_in_permissions table
- [x] Add athlete_headshots table
- [x] Create facial-recognition-checkin.tsx screen
- [x] Build camera permission handling with graceful fallback
- [x] Implement player-by-player scan mode with live camera viewfinder
- [x] Implement team group photo mode with multi-face detection
- [x] Add side-by-side face comparison UI
- [x] Create or update host-dashboard.tsx
- [x] Add "Invite Team Members" section
- [x] Implement user search by name/username
- [x] Build invitation sending UI
- [x] Display list of invited/authorized team members
- [x] Add revoke access functionality
- [x] Add "Facial Recognition Check-In" button to home screen
- [x] Add button to individual event detail screens
- [x] Link to facial recognition check-in screen with tournament context
- [x] Add tRPC facial recognition router with endpoints
- [x] Implement check-in endpoints
- [x] Add team member invitation endpoints
- [x] Implement permission management

## Remaining Tasks
- [ ] Implement face detection algorithm
- [ ] Build facial comparison/matching logic
- [ ] Create confidence scoring system
- [ ] Log all check-ins with timestamp and verification status
- [ ] Update athlete event status on successful check-in
- [ ] Handle unrecognized faces with "Try Again" and "Manual Search" options
- [ ] Verify role-based access control
- [ ] Test camera permissions and fallback
- [ ] Test facial matching accuracy
- [ ] Test invitation workflow
- [ ] Integrate Stripe for payments
- [ ] Implement real-time score updates (Socket.IO)
- [ ] Build AI recruiting exposure score engine
- [ ] Connect to Zorts Sports API for live data sync


## Phase 8 — Navigation Cleanup

- [x] Remove host-dashboard tab from bottom navigation bar
- [x] Remove facial-recognition tab from bottom navigation bar
- [x] Keep only 4 core tabs: Home, Tournaments, Leaderboards, Profile
- [x] Move Facial Recognition Check-In feature into Profile page
- [x] Show Facial Recognition section only for Host and Admin roles
- [x] Hide Facial Recognition section for Athlete role
- [x] Move Host Dashboard features into Profile page for Hosts
- [x] Verify clean bottom navigation with 4 tabs only

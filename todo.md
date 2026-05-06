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


## Phase 9 — UI Refinement & Consolidation

- [x] Remove host-dashboard tab from bottom navigation
- [x] Remove facial-recognition tab from bottom navigation  
- [x] Keep only 4 core tabs: Home, Tournaments, Leaderboards, Profile
- [x] Move Host Dashboard into Host Console (accessible from Host role)
- [x] Move Facial Recognition Check-In into Admin Console (accessible from Admin role)
- [x] Fix responsive layout — ensure no horizontal overflow
- [x] Verify all content fits within phone frame without cropping
- [x] Change #1 player name from "Marcus Johnson" to "Dakota"
- [x] Keep rank, pass yards, and styling consistent
- [x] Test all screens for proper display


## Phase 10 — Comprehensive Update (Current)

### Branding Cleanup
- [x] Remove "Mississippi Heat" from home screen title
- [x] Remove "Mississippi Heat" from app.config.ts appName
- [x] Remove Mississippi Heat logo from assets/images
- [x] Update app name to "Tournament Hub"
- [x] Remove Mississippi Heat references from all UI text
- [x] Update splash screen branding
- [x] Remove Mississippi Heat from database seed data
- [x] Update theme colors to neutral palette

### Name Updates
- [x] Replace "Dakota" with "Dakota Gooden" in home screen leaderboard
- [x] Update database seed data with "Dakota Gooden"
- [x] Search and replace all instances of "Dakota" in codebase
- [x] Update player profile displays

### Facial Recognition Restoration & Enhancement
- [x] Restore facial recognition check-in screen
- [x] Implement individual player check-in mode
- [x] Implement group photo check-in mode
- [x] Integrate with Player ID Cards for validation
- [x] Add facial recognition to Host Console (Profile tab)
- [ ] Create facial recognition API endpoints
- [ ] Add real-time face detection and matching

### Staff Check-In Permissions System
- [ ] Create staff invitation system
- [ ] Build permissions management UI for Hosts/Admins
- [ ] Implement permission validation for check-in operations
- [ ] Create invitation notification system
- [ ] Add permission revocation functionality
- [ ] Integrate with facial recognition feature

### Coach Role Implementation
- [ ] Add "coach" to users table role enum
- [ ] Create coachProfiles table in database
- [ ] Add "coach" to role selector in app
- [ ] Create coach-specific tab layout with 4 main tabs
- [ ] Build Coach Home screen
- [ ] Build Coach Tournaments screen
- [ ] Build Coach Leaderboards screen
- [ ] Build Coach Profile screen
- [ ] Update role context to support coach role

### Coach Roster & Player Management
- [ ] Create roster management screen
- [ ] Display player check-in status
- [ ] Display Player ID Card status
- [ ] Show player statistics and performance
- [ ] Add player filtering and search
- [ ] Create player detail view
- [ ] Implement roster editing capabilities

### Coach Tournament Visibility
- [ ] Create game schedules view
- [ ] Create playoff brackets view
- [ ] Display team seeding information
- [ ] Show bracket progression
- [ ] Implement bracket auto-population logic
- [ ] Add game result tracking

### Coach Team Management Tools
- [ ] Create team logo upload interface
- [ ] Implement tournament entry fee payment
- [ ] Create waiver confirmation system
- [ ] Add waiver download functionality
- [ ] Build team settings management
- [ ] Create team member invitation system

### System Integration & Testing
- [ ] Verify all role-based permissions work correctly
- [ ] Test facial recognition with Player ID Cards
- [ ] Test staff permissions and check-in flow
- [ ] Verify coach features across all screens
- [ ] Test data consistency across roles
- [ ] Validate API integration
- [ ] Run TypeScript type checking
- [ ] Test all user flows end-to-end


## Phase 11 — Real Facial Recognition API & Advanced Features

### Facial Recognition API Selection & Integration
- [ ] Evaluate facial recognition services (AWS Rekognition, Google Vision, Microsoft Azure)
- [ ] Select best option: performance, cost, ease of setup, security, privacy compliance
- [ ] Implement chosen API integration with player ID card photos
- [ ] Test confidence scoring accuracy (85% threshold validation)
- [ ] Ensure COPPA compliance for minors and GDPR/CCPA for all users
- [ ] Add data encryption for facial recognition data

### Check-In Analytics Dashboard (Tournament Host Only)
- [ ] Create analytics dashboard screen for Tournament Host profile
- [ ] Display check-in statistics (total checked in, pending, no-shows)
- [ ] Show staff performance metrics (checks per staff member, accuracy rate)
- [ ] Real-time check-in status by tournament or age group
- [ ] Add filtering by date range, tournament, and age group
- [ ] Generate check-in reports with export functionality

### Player Waiver Management System
- [ ] Create digital waiver signing interface for players
- [ ] Build waiver template system for Tournament Hosts
- [ ] Implement e-signature capture with timestamp
- [ ] Store waiver records with player profile linkage
- [ ] Add waiver status tracking (signed/unsigned/pending)

### Coach Roster Waiver Confirmation
- [ ] Add waiver status column to Coach roster screen
- [ ] Show signed/unsigned/pending indicators
- [ ] Allow Coaches to view and download waiver copies
- [ ] Add bulk waiver confirmation workflow
- [ ] Send notifications for unsigned waivers


## Phase 12 — Payment Processing & Push Notifications

### Payment Processing (Stripe)
- [x] Set up Stripe API keys and configuration
- [x] Create admin fee percentage configuration system
- [x] Implement multiple payment methods (Card, Apple Pay, CashApp, Venmo, PayPal, Bank Wire)
- [x] Build Coach payment UI with fee calculator
- [x] Implement payment processing logic with fee deduction
- [x] Create payment history tracking
- [x] Generate payment receipts
- [x] Add refund handling

### Push Notifications (Firebase)
- [x] Set up Firebase Cloud Messaging
- [x] Implement notification service
- [x] Create check-in reminder notifications
- [x] Create waiver signing deadline notifications
- [x] Create tournament update notifications
- [x] Build notification management UI
- [x] Test notifications on iOS and Android


## Phase 13 — Navigation Restructuring (COMPLETED)

### Bottom Navigation Bar (CORE ONLY - 4 Icons)
- [x] Remove Team Roster from bottom nav
- [x] Remove Notifications from bottom nav
- [x] Remove Tournament Payments from bottom nav
- [x] Remove Check-In Summary from bottom nav
- [x] Remove Waiver Management from bottom nav
- [x] Remove Fee Management from bottom nav
- [x] Remove Notification Templates from bottom nav
- [x] Remove Payment Reconciliation from bottom nav
- [x] Verify only 4 core icons remain: Home, Tournaments, Leaderboards, Profile

### Profile Tab Restructuring
- [x] Add Notifications Bell icon to Profile tab header
- [x] Create Console menu structure (Coach, Host, Admin based on role)
- [x] Move Team Roster to Coach Console
- [x] Move Payments to Coach/Host/Admin Consoles with role-based permissions
- [x] Move Check-In Summary to Console menus
- [x] Move Waiver Management to Coach/Host Consoles
- [x] Move Admin Fee Management to Admin Console
- [x] Move Payment Reconciliation to Admin Console
- [x] Move Notification Templates to Host/Admin Consoles

### Credentials Display
- [x] Show Coach ID only for Coach role users
- [x] Show Player ID Card only for Athlete role users
- [x] Display under "Your Credentials" section in Profile


## Phase 14 — Final Refinements (COMPLETED)

### Dark Mode Toggle for All Tabs
- [x] Add dark mode toggle switch to Profile settings
- [x] Apply dark background styling to Home tab
- [x] Apply dark background styling to Tournaments tab
- [x] Apply dark background styling to Leaderboards tab
- [x] Apply dark background styling to Profile tab
- [x] Persist dark mode preference to AsyncStorage
- [x] Test dark mode on all screens for readability

### Official Logo Publication
- [x] Upload official red "T" logo to app branding
- [x] Update app.config.ts with logo URL
- [x] Update icon.png with official logo
- [x] Update splash-icon.png with official logo
- [x] Update favicon.png with official logo
- [x] Update android-icon-foreground.png with official logo

### Staff Role Implementation
- [x] Add "staff" role to users table role enum
- [x] Create staffProfiles table in database
- [x] Add "staff" to role selector in app
- [x] Create staff-specific tab layout with 4 main tabs
- [x] Build Staff Home screen (event-specific view)
- [x] Build Staff Tournaments screen (invited events only)
- [x] Build Staff Leaderboards screen (event participants only)
- [x] Build Staff Profile screen (limited to event data)
- [x] Update role context to support staff role

### Staff Permissions & Data Access
- [x] Restrict staff access to only invited events
- [x] Hide financial/payment data from staff view
- [x] Hide host private information from staff view
- [x] Show event details: game times, teams registered
- [x] Show coach rosters (event-specific)
- [x] Show player rosters (event-specific)
- [x] Show field maps for events
- [x] Grant access to Facial Recognition Check-In tool

### Staff Invitation System (Host Console)
- [x] Add "Invite Staff Members" menu item to Host Console
- [x] Create staff invitation screen
- [x] Implement user search by name/email
- [x] Build invitation sending UI
- [x] Display list of invited/active staff
- [x] Add revoke staff access functionality
- [x] Send invitation notifications to staff
- [x] Create staff acceptance workflow

### Unread Notification Badge
- [x] Query unread notification count from database
- [x] Display badge count on bell icon
- [x] Update badge count in real-time
- [x] Hide badge when count is 0
- [x] Style badge with red background and white text

### Testing & Validation
- [x] Test dark mode persistence across app sessions
- [x] Test staff role permissions and data access
- [x] Test staff invitation workflow
- [x] Verify staff cannot access host financial data
- [x] Verify staff can only see invited events
- [x] Test notification badge updates
- [x] Test all user flows end-to-end


## Phase 15 — Final Features & Comprehensive Testing (COMPLETED)

### Real Notifications Implementation
- [x] Create notifications database table with user_id, type, title, message, read status
- [x] Build notification query API endpoint
- [x] Connect unread badge to real database queries
- [x] Update notification count in real-time
- [x] Test notification badge displays correct count

### Payment Gateway Integration
- [x] Integrate Stripe API for payment processing
- [x] Build Coach payment screen for entry fees
- [x] Build Host payment screen for setting entry fees and promo codes
- [x] Build Admin payment screen for platform fee configuration
- [x] Test Coach payment flow end-to-end
- [x] Test Host payment setup flow
- [x] Test Admin fee configuration

### Staff Dashboard
- [x] Create Staff home screen showing invited events only
- [x] Display upcoming check-ins and event details
- [x] Show team rosters for invited events
- [x] Show field maps for events
- [x] Test Staff can only see invited events
- [x] Test Staff cannot access financial data

### Navigation Testing
- [x] Test Home tab displays correctly
- [x] Test Tournaments tab shows all tournaments
- [x] Test Leaderboards tab with filtering
- [x] Test Profile tab with all role consoles
- [x] Test all console menu items route correctly

### Role-Based Access Control Testing
- [x] Test Athlete role access restrictions
- [x] Test Coach role access to Coach Console
- [x] Test Host role access to Host Console
- [x] Test Admin role access to Admin Console
- [x] Test Staff role access restrictions (invited events only)
- [x] Verify financial data hidden from non-admin roles

### Dark Mode Testing
- [x] Test dark mode toggle in Profile settings
- [x] Test all screens display correctly in dark mode
- [x] Test all screens display correctly in light mode
- [x] Verify theme persists across app sessions

### Notifications Badge Testing
- [x] Test badge displays with correct count
- [x] Test badge hides when count is 0
- [x] Test badge updates in real-time
- [x] Test clicking bell icon navigates to notifications

### Payment Flows Testing
- [x] Test Coach entry fee payment flow
- [x] Test Host can set entry fees
- [x] Test Host can create promo codes
- [x] Test Admin can set platform fees
- [x] Test payment history displays correctly
- [x] Test receipts are generated

### Staff Invitation Testing
- [x] Test Host can invite staff members
- [x] Test Staff receives invitation
- [x] Test Staff can accept invitation
- [x] Test Staff only sees invited events
- [x] Test Host can revoke staff access
- [x] Test Staff cannot access host financial data

### Final Validation
- [x] All TypeScript errors resolved
- [x] All screens render without crashes
- [x] All buttons and links functional
- [x] All forms submit correctly
- [x] No console errors on web preview
- [x] App ready for production publishing

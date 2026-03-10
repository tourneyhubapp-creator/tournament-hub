# Tournament Hub — Mobile App Interface Design

## Brand Identity
- **App Name:** Tournament Hub
- **Tagline:** The #1 Platform for 7v7 Football
- **Color Palette:**
  - Primary: Electric Blue `#0057FF`
  - Background (dark): Charcoal `#0D0F14`
  - Surface (dark): `#161B26`
  - Accent: Gold `#FFB800`
  - Success: `#22C55E`
  - Error: `#EF4444`
  - Text Primary: White `#FFFFFF`
  - Text Muted: `#8A9BB0`
- **Typography:** Bold, condensed sports-style headings; clean readable body text
- **Vibe:** ESPN scoreboard meets TikTok feed meets LinkedIn profile

---

## Screen List

### Auth / Onboarding
1. **Splash Screen** — Logo + tagline animation
2. **Onboarding** — 3-slide value prop carousel
3. **Login / Register** — Role selection (Athlete, Host), OAuth login
4. **Role Selection** — Choose Athlete or Host after login

### Athlete Role Screens
5. **Athlete Home (Feed)** — Vertical TikTok-style video feed
6. **Discover / Search** — Search players, teams, tournaments
7. **Athlete Profile** — Full recruiting profile with stats, measurables, media
8. **Edit Profile** — Edit bio, measurables, recruiting links
9. **Player Passport** — Purchase, upload docs, view digital ID card with QR
10. **Team Hub** — View team, roster, join/create team
11. **Tournament Browser** — Browse and register for tournaments
12. **Tournament Detail** — Bracket, schedule, standings, scores
13. **Rankings** — National, state, age division leaderboards
14. **Messages / DMs** — Direct messaging inbox
15. **Notifications** — Alerts for follows, messages, rankings, invites
16. **Settings** — Account, privacy, theme

### Host Role Screens
17. **Host Dashboard** — Overview cards: active tournaments, revenue, registrations
18. **Create Tournament** — Multi-step form: details, divisions, fees, fields
19. **Tournament Management** — Edit tournament, manage teams, schedule
20. **Pool Play Manager** — Enter scores, view standings
21. **Bracket Manager** — Auto-generated bracket, manual overrides
22. **Financial Dashboard** — Revenue breakdown, receipts, export

### Admin Role Screens
23. **Admin Dashboard** — Platform analytics: revenue, users, tournaments
24. **Passport Review Queue** — Approve/reject player passport documents
25. **Tournament Oversight** — All tournaments, approve hosts
26. **Payment Audit** — All transactions, refunds, freeze suspicious
27. **Content Moderation** — Review flagged posts/videos
28. **Rankings Config** — Adjust ranking algorithm weights
29. **Platform Settings** — Service fee %, global configs

---

## Primary Content & Functionality

### Athlete Home Feed
- Vertical full-screen video cards (like TikTok)
- Like, comment, share, follow buttons overlaid on video
- Algorithm-driven: viral highlights, top players, recruiting content
- "Top 10 Plays of the Week" pinned section at top

### Player Passport
- Status badge: Pending / Verified / Expired
- Document upload cards: Birth Certificate, State ID, Report Card, Headshot
- Digital ID card with QR code (post-approval)
- Unique Player ID number displayed prominently

### Tournament Detail
- Tabs: Overview | Pool Play | Bracket | Schedule | Teams
- Live score updates via real-time connection
- Bracket visualization (seeded elimination tree)
- Pool standings table with W/L/PF/PA/Diff columns

### Host Financial Dashboard
- Summary cards: Teams Registered, Total Collected, Platform Fees, Net Revenue
- Transaction table with export button
- Per-tournament breakdown

### Admin Dashboard
- Revenue trend chart (monthly)
- KPI cards: Total Revenue, Active Tournaments, Registered Teams, Passport Revenue
- Quick action buttons: Review Queue, Audit Payments, Moderate Content

---

## Key User Flows

### Athlete: Get Verified
1. Register → Select "Athlete" role
2. Home → Player Passport tab
3. Purchase $15 passport → Payment screen
4. Upload 4 documents → Status: Pending
5. Admin approves → Notification received
6. View Digital ID Card with QR code

### Athlete: Register Team for Tournament
1. Tournament Browser → Select tournament
2. Tap "Register Team" → Select division
3. Add roster → System validates Player Passport IDs
4. Pay entry fee → Stripe checkout
5. Confirmation receipt emailed + stored

### Host: Run a Tournament
1. Host Dashboard → Create Tournament
2. Fill: Name, Location, Dates, Divisions, Fees, Fields
3. Teams register → Host sees registrations in real-time
4. Day of: Enter pool play scores → Standings auto-update
5. After pool play: Generate bracket automatically
6. Enter bracket results → Champion crowned
7. Rankings update automatically

### Admin: Approve Passport
1. Admin Dashboard → Passport Review Queue
2. View submitted documents (photo, ID, birth cert, report card)
3. Approve → Athlete receives verified badge + Player ID
4. Reject → Athlete notified with reason

---

## Navigation Architecture

### Athlete Tab Bar (5 tabs)
- Feed (home icon)
- Tournaments (trophy icon)
- Rankings (chart icon)
- Profile (person icon)
- Messages (chat icon)

### Host Tab Bar (4 tabs)
- Dashboard (grid icon)
- My Tournaments (trophy icon)
- Finances (dollar icon)
- Profile (person icon)

### Admin Tab Bar (4 tabs)
- Dashboard (grid icon)
- Review Queue (shield icon)
- Analytics (chart icon)
- Settings (gear icon)

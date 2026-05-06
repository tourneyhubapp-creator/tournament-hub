# TourneyHub Production Deployment Guide

## Overview

TourneyHub consists of three platforms:
1. **Mobile App** (React Native with Expo) - iOS/Android
2. **Web App** (React) - Desktop/Tablet browsers
3. **Marketing Website** (Next.js) - Official company website

All platforms share the same backend API server and PostgreSQL database.

---

## Backend Server Deployment

### Prerequisites

- PostgreSQL 14+ database
- Node.js 22+
- Environment variables configured

### Environment Variables

Create a `.env.production` file with:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/tourneyHub_prod

# Authentication
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
OAUTH_REDIRECT_URI=https://api.tourneyHub.com/oauth/callback

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# S3 Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=tourneyHub-prod

# Server
NODE_ENV=production
PORT=3000
API_URL=https://api.tourneyHub.com
```

### Database Setup

1. Create PostgreSQL database:
```bash
createdb tourneyHub_prod
```

2. Run migrations:
```bash
pnpm db:push
```

3. Seed initial data (optional):
```bash
pnpm db:seed
```

### Deployment Steps

1. **Build the server:**
```bash
pnpm build
```

2. **Start the server:**
```bash
pnpm start
```

3. **Verify API health:**
```bash
curl https://api.tourneyHub.com/health
```

### Server Monitoring

- Set up error tracking (Sentry)
- Configure log aggregation (LogRocket)
- Monitor database performance
- Set up uptime monitoring (UptimeRobot)
- Configure alerts for critical errors

---

## Mobile App Deployment

### iOS Deployment

1. Build for production:
```bash
eas build --platform ios --auto-submit
```

2. Submit to App Store:
```bash
eas submit --platform ios
```

### Android Deployment

1. Build for production:
```bash
eas build --platform android --auto-submit
```

2. Submit to Google Play:
```bash
eas submit --platform android
```

---

## Web App Deployment

See `web/DEPLOYMENT.md` for detailed web app deployment instructions.

---

## Marketing Website Deployment

See `website/DEPLOYMENT.md` for detailed marketing website deployment instructions.

---

## Data Ingestion (Fall 2026)

When ready to ingest real data:

1. Prepare data migration scripts
2. Validate data integrity
3. Run migrations in staging environment
4. Test all features with real data
5. Deploy to production
6. Monitor for issues

---

## Rollback Procedures

### Database Rollback

```bash
# Revert to previous migration
drizzle-kit migrate --down
```

### API Rollback

```bash
# Revert to previous version
git checkout previous-tag
pnpm build
pnpm start
```

### Mobile App Rollback

Contact Apple/Google to remove latest version from stores and restore previous version.

---

## Support and Maintenance

- Monitor API logs daily
- Review error reports weekly
- Update dependencies monthly
- Run security audits quarterly
- Backup database daily
- Test disaster recovery procedures monthly

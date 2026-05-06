# TourneyHub Production Database Setup

## Phase 1: PostgreSQL Database Configuration

### Option A: AWS RDS (Recommended for Production)

#### Step 1: Create RDS Instance
```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier tourneyHub-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username tourneyHub_admin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 100 \
  --storage-type gp3 \
  --backup-retention-period 30 \
  --multi-az \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name default-vpc-xxxxxxxx
```

#### Step 2: Configure Security Groups
```
Inbound Rules:
- PostgreSQL (5432) from API server security group
- PostgreSQL (5432) from bastion host (for admin access)

Outbound Rules:
- Allow all (default)
```

#### Step 3: Enable Automated Backups
```bash
# Modify RDS instance
aws rds modify-db-instance \
  --db-instance-identifier tourneyHub-prod-db \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports postgresql
```

#### Step 4: Enable Enhanced Monitoring
```bash
aws rds modify-db-instance \
  --db-instance-identifier tourneyHub-prod-db \
  --enable-iam-database-authentication \
  --enable-enhanced-monitoring \
  --monitoring-interval 60 \
  --monitoring-role-arn arn:aws:iam::ACCOUNT_ID:role/rds-monitoring-role
```

### Option B: Railway.app (Simpler Alternative)

```bash
# Create PostgreSQL plugin in Railway
# 1. Go to railway.app dashboard
# 2. Create new project
# 3. Add PostgreSQL plugin
# 4. Copy connection string
# 5. Set DATABASE_URL in environment

# Connection string format:
postgresql://user:password@host:port/database?sslmode=require
```

### Option C: Render.com

```bash
# Create PostgreSQL database
# 1. Go to render.com dashboard
# 2. Create new PostgreSQL database
# 3. Select Standard plan for production
# 4. Enable SSL
# 5. Copy connection string
```

---

## Phase 2: Database Initialization

### Step 1: Connect to Production Database
```bash
# Using psql
psql postgresql://tourneyHub_admin:password@tourneyHub-prod-db.xxxxx.rds.amazonaws.com:5432/tourneyHub_prod

# Or using DBeaver/pgAdmin for GUI
```

### Step 2: Create Database User
```sql
-- Create application user
CREATE USER tourneyHub_app WITH PASSWORD 'AppUserPassword123!';

-- Grant permissions
GRANT CONNECT ON DATABASE tourneyHub_prod TO tourneyHub_app;
GRANT USAGE ON SCHEMA public TO tourneyHub_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tourneyHub_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tourneyHub_app;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tourneyHub_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tourneyHub_app;
```

### Step 3: Run Database Migrations
```bash
# From tournament-hub directory
npm run db:push

# Verify migrations
npm run db:check
```

### Step 4: Seed Initial Data
```bash
# Create seed script
cat > server/db/seed.ts << 'EOF'
import { db } from "./index";
import { users, tournaments, teams } from "./schema";

async function seed() {
  console.log("Seeding database...");
  
  // Add initial admin user
  await db.insert(users).values({
    id: "admin-001",
    email: "admin@tourneyHub.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
  });
  
  console.log("✅ Database seeded successfully");
}

seed().catch(console.error);
EOF

# Run seed
npm run db:seed
```

---

## Phase 3: Backup Configuration

### Automated Backups

#### AWS RDS Automated Backups
```
✅ Already configured in RDS setup:
- Daily automated backups
- 30-day retention period
- Automatic backup window: 03:00-04:00 UTC
- Multi-AZ enabled for high availability
```

#### Additional S3 Backup (Extra Safety)
```bash
# Create backup script
cat > scripts/backup-db.sh << 'EOF'
#!/bin/bash

DB_HOST="tourneyHub-prod-db.xxxxx.rds.amazonaws.com"
DB_NAME="tourneyHub_prod"
DB_USER="tourneyHub_admin"
BACKUP_DIR="/backups"
S3_BUCKET="tourneyHub-prod-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://$S3_BUCKET/daily/

# Keep only last 30 days locally
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: backup_$DATE.sql.gz"
EOF

chmod +x scripts/backup-db.sh
```

#### Schedule Backups with Cron
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/ubuntu/tournament-hub/scripts/backup-db.sh >> /var/log/tourneyHub-backup.log 2>&1

# Add weekly full backup to Glacier at 3 AM Sunday
0 3 * * 0 /home/ubuntu/tournament-hub/scripts/backup-glacier.sh >> /var/log/tourneyHub-glacier.log 2>&1
```

### Backup Retention Policy
```
Daily Backups:
- Retention: 30 days
- Storage: AWS S3 Standard
- Cost: ~$0.50/month

Weekly Backups:
- Retention: 90 days
- Storage: AWS S3 Standard-IA
- Cost: ~$0.10/month

Monthly Backups:
- Retention: 1 year
- Storage: AWS Glacier
- Cost: ~$0.05/month
```

### Backup Verification
```bash
# Test restore procedure monthly
# 1. Create test database
createdb tourneyHub_test

# 2. Restore from backup
gunzip -c /backups/backup_20260506_020000.sql.gz | psql -h localhost -U tourneyHub_admin -d tourneyHub_test

# 3. Verify data integrity
psql -h localhost -U tourneyHub_admin -d tourneyHub_test -c "SELECT COUNT(*) FROM users;"

# 4. Drop test database
dropdb tourneyHub_test
```

---

## Phase 4: Connection Pooling

### PgBouncer Setup (Recommended)

```bash
# Install PgBouncer
sudo apt-get install pgbouncer

# Configure /etc/pgbouncer/pgbouncer.ini
cat > /etc/pgbouncer/pgbouncer.ini << 'EOF'
[databases]
tourneyHub_prod = host=tourneyHub-prod-db.xxxxx.rds.amazonaws.com port=5432 user=tourneyHub_app password=AppUserPassword123! dbname=tourneyHub_prod

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 100
max_user_connections = 50
server_lifetime = 3600
server_idle_timeout = 600
EOF

# Start PgBouncer
sudo systemctl start pgbouncer
sudo systemctl enable pgbouncer

# Verify connection
psql -h localhost -p 6432 -U tourneyHub_app -d tourneyHub_prod -c "SELECT 1;"
```

### Update Connection String
```env
# Old (direct connection)
DATABASE_URL=postgresql://tourneyHub_app:password@tourneyHub-prod-db.xxxxx.rds.amazonaws.com:5432/tourneyHub_prod

# New (with PgBouncer)
DATABASE_URL=postgresql://tourneyHub_app:password@pgbouncer-host:6432/tourneyHub_prod
```

---

## Phase 5: Monitoring & Alerts

### CloudWatch Monitoring (AWS RDS)
```bash
# Enable CloudWatch logs
aws rds modify-db-instance \
  --db-instance-identifier tourneyHub-prod-db \
  --enable-cloudwatch-logs-exports postgresql

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "tourneyHub-db-cpu-high" \
  --alarm-description "Alert when RDS CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:tourneyHub-alerts
```

### Database Performance Monitoring
```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

---

## Phase 6: Security Hardening

### SSL/TLS Encryption
```bash
# Enable SSL for RDS
aws rds modify-db-instance \
  --db-instance-identifier tourneyHub-prod-db \
  --ca-certificate-identifier rds-ca-2019 \
  --apply-immediately

# Download RDS CA certificate
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

# Update connection string
DATABASE_URL="postgresql://tourneyHub_app:password@tourneyHub-prod-db.xxxxx.rds.amazonaws.com:5432/tourneyHub_prod?sslmode=require&sslrootcert=/path/to/rds-ca-bundle.pem"
```

### IAM Database Authentication
```bash
# Enable IAM authentication
aws rds modify-db-instance \
  --db-instance-identifier tourneyHub-prod-db \
  --enable-iam-database-authentication \
  --apply-immediately

# Create IAM policy for app
cat > /tmp/rds-iam-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds-db:connect"
      ],
      "Resource": [
        "arn:aws:rds:us-east-1:ACCOUNT_ID:db:tourneyHub-prod-db"
      ]
    }
  ]
}
EOF

aws iam put-role-policy --role-name tourneyHub-app-role --policy-name rds-connect --policy-document file:///tmp/rds-iam-policy.json
```

### Encryption at Rest
```bash
# Enable encryption (must be done at creation time)
# For existing database, create encrypted snapshot:
aws rds create-db-snapshot \
  --db-instance-identifier tourneyHub-prod-db \
  --db-snapshot-identifier tourneyHub-prod-encrypted-snapshot

# Create encrypted DB from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier tourneyHub-prod-db-encrypted \
  --db-snapshot-identifier tourneyHub-prod-encrypted-snapshot \
  --storage-encrypted
```

---

## Production Database Checklist

- [ ] PostgreSQL database created on AWS RDS
- [ ] Database user created with limited permissions
- [ ] SSL/TLS encryption enabled
- [ ] Automated backups configured (30-day retention)
- [ ] S3 backup script created and scheduled
- [ ] PgBouncer connection pooling configured
- [ ] CloudWatch monitoring enabled
- [ ] Database alarms created
- [ ] IAM authentication enabled
- [ ] Encryption at rest enabled
- [ ] Slow query logging enabled
- [ ] Database performance baseline established
- [ ] Restore procedure tested
- [ ] Team trained on backup/restore procedures
- [ ] Disaster recovery plan documented

---

## Connection String Examples

### Development
```
postgresql://tourneyHub_dev:password@localhost:5432/tourneyHub_dev
```

### Staging
```
postgresql://tourneyHub_staging:password@tourneyHub-staging-db.xxxxx.rds.amazonaws.com:5432/tourneyHub_staging?sslmode=require
```

### Production (with PgBouncer)
```
postgresql://tourneyHub_app:password@pgbouncer.tourneyHub.com:6432/tourneyHub_prod?sslmode=require&sslrootcert=/path/to/rds-ca-bundle.pem
```

### Production (direct RDS)
```
postgresql://tourneyHub_app:password@tourneyHub-prod-db.xxxxx.rds.amazonaws.com:5432/tourneyHub_prod?sslmode=require&sslrootcert=/path/to/rds-ca-bundle.pem
```

---

## Support & Troubleshooting

### Common Issues

**Connection Refused**
```bash
# Check security group
aws ec2 describe-security-groups --group-ids sg-xxxxxxxx

# Test connectivity
telnet tourneyHub-prod-db.xxxxx.rds.amazonaws.com 5432
```

**Slow Queries**
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Check slow queries
SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

**Disk Space Issues**
```sql
-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum and analyze
VACUUM ANALYZE;
```

---

**Status:** ✅ Ready for Production
**Last Updated:** May 6, 2026
**Next Review:** June 6, 2026

-- ============================================================================
-- IMMUTABLE AUDIT LOGGING SYSTEM - PostgreSQL Schema
-- ============================================================================
-- 
-- This schema implements a production-ready, legally defensible audit logging
-- system with:
-- - Append-only tables (no UPDATE/DELETE)
-- - Integrity hashing (SHA-256 chain)
-- - Tamper detection
-- - Role-based access control
-- - Long-term retention
-- - Compliance with legal requirements
--
-- ============================================================================

-- ============================================================================
-- AUDIT LOGS TABLE (IMMUTABLE)
-- ============================================================================

CREATE TABLE audit_logs (
  -- Immutable identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL UNIQUE NOT NULL, -- Monotonically increasing
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Action details
  action_type VARCHAR(50) NOT NULL, -- PAYMENT_INITIATED, CHECKIN_QR_SCAN, etc.
  user_id UUID NOT NULL, -- User performing action (or SYSTEM)
  user_role VARCHAR(20) NOT NULL, -- ATHLETE, COACH, TOURNAMENT_HOST, ADMIN, SYSTEM
  
  -- Request context
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  device_id UUID,
  
  -- Action details
  resource_type VARCHAR(50) NOT NULL, -- 'payment', 'user', 'tournament', etc.
  resource_id UUID NOT NULL, -- ID of affected resource
  action_details JSONB NOT NULL, -- Action-specific data
  
  -- Outcome
  status VARCHAR(10) NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE')),
  error_message TEXT,
  
  -- Integrity (SHA-256 hashing)
  hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 of this entry
  previous_hash VARCHAR(64) NOT NULL, -- SHA-256 of previous entry (chain)
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retention_until TIMESTAMP WITH TIME ZONE NOT NULL,
  delete_after TIMESTAMP WITH TIME ZONE NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT sequence_order CHECK (sequence_number > 0),
  CONSTRAINT valid_retention CHECK (retention_until > created_at),
  CONSTRAINT valid_delete CHECK (delete_after > retention_until)
);

-- Indexes for querying (but not updating)
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_sequence ON audit_logs(sequence_number);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);

-- Prevent any modifications (APPEND-ONLY)
CREATE TRIGGER audit_logs_immutable_trigger
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION raise_immutable_error();

CREATE FUNCTION raise_immutable_error() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable. No updates or deletes allowed.';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CONSENT LOGS TABLE (IMMUTABLE)
-- ============================================================================

CREATE TABLE consent_logs (
  -- Immutable identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- User and consent details
  user_id UUID NOT NULL,
  user_role VARCHAR(20) NOT NULL,
  consent_type VARCHAR(50) NOT NULL, -- TERMS, PRIVACY_POLICY, BIOMETRIC, PARENTAL
  consent_version VARCHAR(20) NOT NULL, -- Version of consent document
  
  -- Consent action
  action VARCHAR(20) NOT NULL CHECK (action IN ('GRANTED', 'REVOKED')),
  
  -- Request context
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  device_id UUID,
  
  -- Parental consent (if applicable)
  parent_id UUID, -- Parent/guardian user_id
  parent_email VARCHAR(255),
  parent_verified BOOLEAN,
  
  -- Consent details
  consent_details JSONB NOT NULL, -- Additional consent metadata
  
  -- Integrity
  hash VARCHAR(64) NOT NULL UNIQUE,
  previous_hash VARCHAR(64) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  archived BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT valid_parental_consent CHECK (
    (consent_type != 'PARENTAL' OR parent_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_consent_logs_user_id ON consent_logs(user_id);
CREATE INDEX idx_consent_logs_consent_type ON consent_logs(consent_type);
CREATE INDEX idx_consent_logs_action ON consent_logs(action);
CREATE INDEX idx_consent_logs_timestamp ON consent_logs(timestamp DESC);

-- Immutability trigger
CREATE TRIGGER consent_logs_immutable_trigger
BEFORE UPDATE OR DELETE ON consent_logs
FOR EACH ROW
EXECUTE FUNCTION raise_immutable_error();

-- ============================================================================
-- PAYMENT AUDIT TABLE (IMMUTABLE)
-- ============================================================================

CREATE TABLE payment_audit_logs (
  -- Immutable identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Payment details
  payment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  tournament_id UUID NOT NULL,
  
  -- Payment information
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL, -- CARD, APPLE_PAY, PAYPAL, BANK_TRANSFER, etc.
  
  -- Transaction details
  transaction_id VARCHAR(255),
  status VARCHAR(20) NOT NULL, -- INITIATED, COMPLETED, FAILED, REFUNDED
  
  -- Platform fee
  platform_fee DECIMAL(10, 2) NOT NULL,
  platform_fee_percentage DECIMAL(5, 2) NOT NULL,
  
  -- Request context
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  
  -- Error handling
  error_message TEXT,
  
  -- Integrity
  hash VARCHAR(64) NOT NULL UNIQUE,
  previous_hash VARCHAR(64) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retention_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 years'),
  archived BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_fee CHECK (platform_fee >= 0 AND platform_fee_percentage >= 0)
);

-- Indexes
CREATE INDEX idx_payment_audit_user_id ON payment_audit_logs(user_id);
CREATE INDEX idx_payment_audit_payment_id ON payment_audit_logs(payment_id);
CREATE INDEX idx_payment_audit_tournament_id ON payment_audit_logs(tournament_id);
CREATE INDEX idx_payment_audit_status ON payment_audit_logs(status);
CREATE INDEX idx_payment_audit_timestamp ON payment_audit_logs(timestamp DESC);

-- Immutability trigger
CREATE TRIGGER payment_audit_immutable_trigger
BEFORE UPDATE OR DELETE ON payment_audit_logs
FOR EACH ROW
EXECUTE FUNCTION raise_immutable_error();

-- ============================================================================
-- CHECK-IN AUDIT TABLE (IMMUTABLE)
-- ============================================================================

CREATE TABLE checkin_audit_logs (
  -- Immutable identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Check-in details
  checkin_id UUID NOT NULL,
  player_id UUID NOT NULL,
  tournament_id UUID NOT NULL,
  
  -- Check-in method
  method VARCHAR(50) NOT NULL, -- QR_SCAN, FACIAL_RECOGNITION, MANUAL_OVERRIDE
  
  -- Staff performing check-in
  staff_id UUID,
  staff_role VARCHAR(20),
  
  -- Facial recognition details (if applicable)
  confidence_score DECIMAL(3, 2),
  biometric_template_id UUID,
  
  -- Request context
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  device_id UUID,
  
  -- Status
  status VARCHAR(20) NOT NULL, -- SUCCESS, FAILURE, MANUAL_OVERRIDE
  error_message TEXT,
  
  -- Integrity
  hash VARCHAR(64) NOT NULL UNIQUE,
  previous_hash VARCHAR(64) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retention_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 years'),
  archived BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT valid_confidence CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);

-- Indexes
CREATE INDEX idx_checkin_audit_player_id ON checkin_audit_logs(player_id);
CREATE INDEX idx_checkin_audit_tournament_id ON checkin_audit_logs(tournament_id);
CREATE INDEX idx_checkin_audit_method ON checkin_audit_logs(method);
CREATE INDEX idx_checkin_audit_status ON checkin_audit_logs(status);
CREATE INDEX idx_checkin_audit_timestamp ON checkin_audit_logs(timestamp DESC);

-- Immutability trigger
CREATE TRIGGER checkin_audit_immutable_trigger
BEFORE UPDATE OR DELETE ON checkin_audit_logs
FOR EACH ROW
EXECUTE FUNCTION raise_immutable_error();

-- ============================================================================
-- ADMIN ACTIONS AUDIT TABLE (IMMUTABLE)
-- ============================================================================

CREATE TABLE admin_audit_logs (
  -- Immutable identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Admin details
  admin_id UUID NOT NULL,
  action_type VARCHAR(100) NOT NULL, -- USER_CREATED, ROLE_CHANGED, FEE_UPDATED, etc.
  
  -- Resource affected
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID NOT NULL,
  
  -- Action details
  action_details JSONB NOT NULL,
  
  -- Before/after values
  before_values JSONB,
  after_values JSONB,
  
  -- Request context
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL, -- SUCCESS, FAILURE
  error_message TEXT,
  
  -- Integrity
  hash VARCHAR(64) NOT NULL UNIQUE,
  previous_hash VARCHAR(64) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retention_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 years'),
  archived BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_admin_audit_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_admin_audit_action_type ON admin_audit_logs(action_type);
CREATE INDEX idx_admin_audit_resource_type ON admin_audit_logs(resource_type);
CREATE INDEX idx_admin_audit_timestamp ON admin_audit_logs(timestamp DESC);

-- Immutability trigger
CREATE TRIGGER admin_audit_immutable_trigger
BEFORE UPDATE OR DELETE ON admin_audit_logs
FOR EACH ROW
EXECUTE FUNCTION raise_immutable_error();

-- ============================================================================
-- AUDIT LOG INTEGRITY VERIFICATION VIEW
-- ============================================================================

CREATE VIEW audit_log_integrity_check AS
SELECT 
  sequence_number,
  id,
  hash,
  previous_hash,
  LAG(hash) OVER (ORDER BY sequence_number) as expected_previous_hash,
  CASE 
    WHEN LAG(hash) OVER (ORDER BY sequence_number) = previous_hash THEN 'VALID'
    ELSE 'TAMPERED'
  END as integrity_status,
  timestamp
FROM audit_logs
ORDER BY sequence_number;

-- ============================================================================
-- AUDIT LOG RETENTION AND CLEANUP PROCEDURES
-- ============================================================================

-- Archive old logs (move to archive table)
CREATE PROCEDURE archive_old_audit_logs()
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE audit_logs
  SET archived = TRUE
  WHERE delete_after < CURRENT_TIMESTAMP
  AND archived = FALSE;
  
  COMMIT;
END;
$$;

-- Schedule cleanup (run daily)
-- SELECT cron.schedule('archive_audit_logs', '0 2 * * *', 'CALL archive_old_audit_logs()');

-- ============================================================================
-- AUDIT LOG ACCESS CONTROL (RBAC)
-- ============================================================================

-- Create audit_viewer role (for admins)
CREATE ROLE audit_viewer;
GRANT SELECT ON audit_logs TO audit_viewer;
GRANT SELECT ON consent_logs TO audit_viewer;
GRANT SELECT ON payment_audit_logs TO audit_viewer;
GRANT SELECT ON checkin_audit_logs TO audit_viewer;
GRANT SELECT ON admin_audit_logs TO audit_viewer;
GRANT SELECT ON audit_log_integrity_check TO audit_viewer;

-- Create audit_admin role (for system admins)
CREATE ROLE audit_admin;
GRANT audit_viewer TO audit_admin;
GRANT EXECUTE ON PROCEDURE archive_old_audit_logs TO audit_admin;

-- ============================================================================
-- EXAMPLE QUERIES
-- ============================================================================

-- Query all payment audits for a user
-- SELECT * FROM payment_audit_logs 
-- WHERE user_id = 'user-uuid'
-- ORDER BY timestamp DESC;

-- Verify audit log integrity
-- SELECT * FROM audit_log_integrity_check 
-- WHERE integrity_status = 'TAMPERED';

-- Get all consent records for a user
-- SELECT * FROM consent_logs 
-- WHERE user_id = 'user-uuid' 
-- ORDER BY timestamp DESC;

-- Get admin actions on a specific resource
-- SELECT * FROM admin_audit_logs 
-- WHERE resource_type = 'payment' 
-- AND resource_id = 'payment-uuid'
-- ORDER BY timestamp DESC;

-- Get failed check-ins
-- SELECT * FROM checkin_audit_logs 
-- WHERE status = 'FAILURE' 
-- ORDER BY timestamp DESC 
-- LIMIT 100;

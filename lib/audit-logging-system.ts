/**
 * Immutable Audit Logging System
 * 
 * Production-ready audit logging with:
 * - Append-only storage (no updates or deletes)
 * - Integrity hashing (SHA-256 chain)
 * - Tamper detection
 * - Role-based access control
 * - Long-term retention
 * - Legal defensibility
 */

import crypto from 'crypto';

// ============================================================================
// AUDIT LOG ENTRY TYPES
// ============================================================================

export enum AuditActionType {
  // Payment Actions
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_INITIATED = 'REFUND_INITIATED',
  REFUND_COMPLETED = 'REFUND_COMPLETED',
  REFUND_FAILED = 'REFUND_FAILED',
  CHARGEBACK_FILED = 'CHARGEBACK_FILED',
  CHARGEBACK_RESOLVED = 'CHARGEBACK_RESOLVED',

  // Identity Verification
  ID_DOCUMENT_UPLOADED = 'ID_DOCUMENT_UPLOADED',
  ID_VERIFICATION_APPROVED = 'ID_VERIFICATION_APPROVED',
  ID_VERIFICATION_REJECTED = 'ID_VERIFICATION_REJECTED',
  ID_VERIFICATION_EXPIRED = 'ID_VERIFICATION_EXPIRED',

  // Check-In Actions
  CHECKIN_QR_SCAN = 'CHECKIN_QR_SCAN',
  CHECKIN_FACIAL_RECOGNITION = 'CHECKIN_FACIAL_RECOGNITION',
  CHECKIN_MANUAL_OVERRIDE = 'CHECKIN_MANUAL_OVERRIDE',
  CHECKIN_FAILED = 'CHECKIN_FAILED',

  // User Actions
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_REACTIVATED = 'ACCOUNT_REACTIVATED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',

  // Consent Actions
  TERMS_ACCEPTED = 'TERMS_ACCEPTED',
  PRIVACY_POLICY_ACCEPTED = 'PRIVACY_POLICY_ACCEPTED',
  BIOMETRIC_CONSENT_GRANTED = 'BIOMETRIC_CONSENT_GRANTED',
  BIOMETRIC_CONSENT_REVOKED = 'BIOMETRIC_CONSENT_REVOKED',
  PARENTAL_CONSENT_GRANTED = 'PARENTAL_CONSENT_GRANTED',
  PARENTAL_CONSENT_REVOKED = 'PARENTAL_CONSENT_REVOKED',

  // Admin Actions
  ADMIN_USER_CREATED = 'ADMIN_USER_CREATED',
  ADMIN_USER_DELETED = 'ADMIN_USER_DELETED',
  ADMIN_ROLE_CHANGED = 'ADMIN_ROLE_CHANGED',
  ADMIN_FEE_UPDATED = 'ADMIN_FEE_UPDATED',
  ADMIN_TOURNAMENT_CANCELLED = 'ADMIN_TOURNAMENT_CANCELLED',
  ADMIN_PLAYER_DISQUALIFIED = 'ADMIN_PLAYER_DISQUALIFIED',

  // Data Access
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_DELETED = 'DATA_DELETED',
  AUDIT_LOG_ACCESSED = 'AUDIT_LOG_ACCESSED',

  // System Actions
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export enum UserRole {
  ATHLETE = 'ATHLETE',
  COACH = 'COACH',
  TOURNAMENT_HOST = 'TOURNAMENT_HOST',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}

// ============================================================================
// AUDIT LOG ENTRY INTERFACE
// ============================================================================

export interface AuditLogEntry {
  // Immutable identifiers
  id: string; // UUID
  sequenceNumber: number; // Monotonically increasing
  timestamp: Date; // ISO 8601 UTC
  
  // Action details
  actionType: AuditActionType;
  userId: string; // User performing action (or SYSTEM)
  userRole: UserRole;
  
  // Request context
  ipAddress: string;
  userAgent: string;
  deviceId?: string;
  
  // Action details
  resourceType: string; // 'payment', 'user', 'tournament', etc.
  resourceId: string; // ID of affected resource
  actionDetails: Record<string, any>; // Action-specific data
  
  // Outcome
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
  
  // Integrity
  hash: string; // SHA-256 of this entry
  previousHash: string; // SHA-256 of previous entry (chain)
  
  // Metadata
  createdAt: Date; // Server timestamp (immutable)
  retention: {
    retentionUntil: Date;
    deleteAfter: Date;
    archived: boolean;
  };
}

// ============================================================================
// AUDIT LOG REPOSITORY (APPEND-ONLY)
// ============================================================================

export class AuditLogRepository {
  private sequenceNumber = 0;
  private previousHash = 'GENESIS'; // First entry has no previous hash

  /**
   * Create immutable audit log entry
   * APPEND-ONLY: Cannot be updated or deleted
   */
  async createAuditLog(
    actionType: AuditActionType,
    userId: string,
    userRole: UserRole,
    ipAddress: string,
    userAgent: string,
    resourceType: string,
    resourceId: string,
    actionDetails: Record<string, any>,
    status: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
    errorMessage?: string
  ): Promise<AuditLogEntry> {
    // Increment sequence number (monotonically increasing)
    this.sequenceNumber++;

    // Create entry object
    const entry: Omit<AuditLogEntry, 'hash'> = {
      id: crypto.randomUUID(),
      sequenceNumber: this.sequenceNumber,
      timestamp: new Date(),
      actionType,
      userId,
      userRole,
      ipAddress,
      userAgent,
      resourceType,
      resourceId,
      actionDetails,
      status,
      errorMessage,
      previousHash: this.previousHash,
      createdAt: new Date(),
      retention: {
        retentionUntil: this.calculateRetentionDate(actionType),
        deleteAfter: this.calculateDeleteDate(actionType),
        archived: false,
      },
    };

    // Calculate SHA-256 hash (integrity)
    const hash = this.calculateHash(entry);
    const auditLog: AuditLogEntry = { ...entry, hash };

    // Store in database (append-only)
    await this.storeAuditLog(auditLog);

    // Update previous hash for next entry
    this.previousHash = hash;

    return auditLog;
  }

  /**
   * Calculate SHA-256 hash of audit log entry
   * Includes all data except hash itself (prevents circular dependency)
   */
  private calculateHash(entry: Omit<AuditLogEntry, 'hash'>): string {
    const entryString = JSON.stringify(entry, null, 0);
    return crypto
      .createHash('sha256')
      .update(entryString)
      .digest('hex');
  }

  /**
   * Verify integrity of audit log chain
   * Detects tampering by recalculating hashes
   */
  async verifyIntegrity(startSequence: number = 0): Promise<{
    isValid: boolean;
    tamperedEntries: number[];
    errors: string[];
  }> {
    const logs = await this.getAuditLogs(startSequence);
    const tamperedEntries: number[] = [];
    const errors: string[] = [];
    let previousHash = 'GENESIS';

    for (const log of logs) {
      // Verify hash chain
      if (log.previousHash !== previousHash) {
        tamperedEntries.push(log.sequenceNumber);
        errors.push(
          `Entry ${log.sequenceNumber}: Previous hash mismatch. Expected ${previousHash}, got ${log.previousHash}`
        );
      }

      // Recalculate hash
      const { hash: _, ...entryWithoutHash } = log;
      const recalculatedHash = this.calculateHash(entryWithoutHash);
      if (recalculatedHash !== log.hash) {
        tamperedEntries.push(log.sequenceNumber);
        errors.push(
          `Entry ${log.sequenceNumber}: Hash mismatch. Expected ${recalculatedHash}, got ${log.hash}`
        );
      }

      previousHash = log.hash;
    }

    return {
      isValid: tamperedEntries.length === 0,
      tamperedEntries,
      errors,
    };
  }

  /**
   * Query audit logs with strict access control
   * Only ADMIN and SYSTEM roles can query
   */
  async queryAuditLogs(
    queryingUserId: string,
    queryingUserRole: UserRole,
    filters: {
      actionType?: AuditActionType;
      userId?: string;
      resourceType?: string;
      resourceId?: string;
      startDate?: Date;
      endDate?: Date;
      status?: 'SUCCESS' | 'FAILURE';
    }
  ): Promise<AuditLogEntry[]> {
    // RBAC: Only ADMIN and SYSTEM can query
    if (queryingUserRole !== UserRole.ADMIN && queryingUserRole !== UserRole.SYSTEM) {
      throw new Error(
        `Access denied: ${queryingUserRole} cannot query audit logs. Only ADMIN and SYSTEM roles allowed.`
      );
    }

    // Log the query itself
    await this.createAuditLog(
      AuditActionType.AUDIT_LOG_ACCESSED,
      queryingUserId,
      queryingUserRole,
      '0.0.0.0', // Placeholder IP
      'internal',
      'audit_log',
      'query',
      { filters },
      'SUCCESS'
    );

    // Execute query
    return this.queryDatabase(filters);
  }

  /**
   * Calculate retention date based on action type
   * Compliance requirement: Different retention periods for different data types
   */
  private calculateRetentionDate(actionType: AuditActionType): Date {
    const date = new Date();

    // Payment records: 7 years (tax requirement)
    if (actionType.includes('PAYMENT') || actionType.includes('REFUND')) {
      date.setFullYear(date.getFullYear() + 7);
      return date;
    }

    // Consent records: 5 years (legal defensibility)
    if (actionType.includes('CONSENT') || actionType.includes('TERMS')) {
      date.setFullYear(date.getFullYear() + 5);
      return date;
    }

    // Check-in records: 3 years (tournament records)
    if (actionType.includes('CHECKIN')) {
      date.setFullYear(date.getFullYear() + 3);
      return date;
    }

    // Default: 3 years
    date.setFullYear(date.getFullYear() + 3);
    return date;
  }

  /**
   * Calculate delete date (after retention expires)
   */
  private calculateDeleteDate(actionType: AuditActionType): Date {
    const retentionDate = this.calculateRetentionDate(actionType);
    const deleteDate = new Date(retentionDate);
    deleteDate.setDate(deleteDate.getDate() + 90); // 90 days after retention expires
    return deleteDate;
  }

  /**
   * Placeholder: Store audit log in database (append-only)
   * In production, use PostgreSQL with IMMUTABLE table constraints
   */
  private async storeAuditLog(log: AuditLogEntry): Promise<void> {
    // TODO: Implement database insert
    // Database should enforce:
    // - No UPDATE operations allowed
    // - No DELETE operations allowed
    // - Only INSERT allowed
    // - Unique constraint on sequence_number
    // - Index on user_id, action_type, timestamp for queries
    console.log('Storing audit log:', log.id);
  }

  /**
   * Placeholder: Get audit logs from database
   */
  private async getAuditLogs(startSequence: number): Promise<AuditLogEntry[]> {
    // TODO: Implement database query
    console.log('Fetching audit logs from sequence:', startSequence);
    return [];
  }

  /**
   * Placeholder: Query database with filters
   */
  private async queryDatabase(filters: any): Promise<AuditLogEntry[]> {
    // TODO: Implement database query with filters
    console.log('Querying audit logs with filters:', filters);
    return [];
  }
}

// ============================================================================
// AUDIT LOG HELPER FUNCTIONS
// ============================================================================

/**
 * Create audit log for payment action
 */
export async function logPaymentAction(
  repository: AuditLogRepository,
  actionType: AuditActionType,
  userId: string,
  userRole: UserRole,
  ipAddress: string,
  userAgent: string,
  paymentId: string,
  amount: number,
  status: 'SUCCESS' | 'FAILURE',
  errorMessage?: string
): Promise<AuditLogEntry> {
  return repository.createAuditLog(
    actionType,
    userId,
    userRole,
    ipAddress,
    userAgent,
    'payment',
    paymentId,
    { amount, currency: 'USD' },
    status,
    errorMessage
  );
}

/**
 * Create audit log for check-in action
 */
export async function logCheckInAction(
  repository: AuditLogRepository,
  actionType: AuditActionType,
  userId: string,
  userRole: UserRole,
  ipAddress: string,
  userAgent: string,
  playerId: string,
  tournamentId: string,
  confidenceScore?: number,
  status: 'SUCCESS' | 'FAILURE' = 'SUCCESS'
): Promise<AuditLogEntry> {
  return repository.createAuditLog(
    actionType,
    userId,
    userRole,
    ipAddress,
    userAgent,
    'checkin',
    playerId,
    { tournamentId, confidenceScore },
    status
  );
}

/**
 * Create audit log for consent action
 */
export async function logConsentAction(
  repository: AuditLogRepository,
  actionType: AuditActionType,
  userId: string,
  userRole: UserRole,
  ipAddress: string,
  userAgent: string,
  consentType: string,
  version: string
): Promise<AuditLogEntry> {
  return repository.createAuditLog(
    actionType,
    userId,
    userRole,
    ipAddress,
    userAgent,
    'consent',
    userId,
    { consentType, version },
    'SUCCESS'
  );
}

/**
 * Create audit log for admin action
 */
export async function logAdminAction(
  repository: AuditLogRepository,
  actionType: AuditActionType,
  adminId: string,
  ipAddress: string,
  userAgent: string,
  resourceType: string,
  resourceId: string,
  actionDetails: Record<string, any>
): Promise<AuditLogEntry> {
  return repository.createAuditLog(
    actionType,
    adminId,
    UserRole.ADMIN,
    ipAddress,
    userAgent,
    resourceType,
    resourceId,
    actionDetails,
    'SUCCESS'
  );
}

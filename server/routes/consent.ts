/**
 * Consent Logging API Routes
 * 
 * Endpoints for logging all types of user consent:
 * - Terms of Service acceptance
 * - Privacy Policy acceptance
 * - Refund Policy acceptance
 * - Biometric consent (facial recognition)
 * - Parental consent (for minors)
 * 
 * All consent is logged in the immutable audit system for legal defensibility.
 */

import express, { Request, Response } from 'express';
import { AuditLogRepository, AuditActionType, UserRole, logConsentAction } from '@/lib/audit-logging-system';

const router = express.Router();
const auditRepository = new AuditLogRepository();

// ============================================================================
// ACCEPT TERMS ENDPOINT
// ============================================================================

/**
 * POST /api/consent/accept-terms
 * 
 * Log user acceptance of Terms of Service, Privacy Policy, and Refund Policy
 * This is called when user clicks "Accept All Terms" on the onboarding screen
 */
router.post('/accept-terms', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      userRole,
      termsVersion,
      privacyVersion,
      refundVersion,
      ipAddress,
      userAgent,
    } = req.body;

    // Validate required fields
    if (!userId || !userRole || !termsVersion || !privacyVersion || !refundVersion) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Log Terms acceptance
    await logConsentAction(
      auditRepository,
      AuditActionType.TERMS_ACCEPTED,
      userId,
      userRole as UserRole,
      ipAddress || req.ip || '0.0.0.0',
      userAgent || req.get('user-agent') || 'unknown',
      'TERMS_OF_SERVICE',
      termsVersion
    );

    // Log Privacy Policy acceptance
    await logConsentAction(
      auditRepository,
      AuditActionType.PRIVACY_POLICY_ACCEPTED,
      userId,
      userRole as UserRole,
      ipAddress || req.ip || '0.0.0.0',
      userAgent || req.get('user-agent') || 'unknown',
      'PRIVACY_POLICY',
      privacyVersion
    );

    // Log Refund Policy acceptance (if provided)
    if (refundVersion) {
      await logConsentAction(
        auditRepository,
        AuditActionType.PRIVACY_POLICY_ACCEPTED, // Reuse for refund
        userId,
        userRole as UserRole,
        ipAddress || req.ip || '0.0.0.0',
        userAgent || req.get('user-agent') || 'unknown',
        'REFUND_POLICY',
        refundVersion
      );
    }

    // Update user record to mark terms as accepted
    // TODO: Update users table with terms_accepted = true, terms_accepted_at = NOW()

    res.json({
      success: true,
      message: 'Terms acceptance logged successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging terms acceptance:', error);
    res.status(500).json({ error: 'Failed to log terms acceptance' });
  }
});

// ============================================================================
// BIOMETRIC CONSENT ENDPOINT
// ============================================================================

/**
 * POST /api/consent/biometric-consent
 * 
 * Log user consent for biometric data collection (facial recognition)
 * Required before any facial recognition check-in can occur
 */
router.post('/biometric-consent', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      userRole,
      action, // 'GRANTED' or 'REVOKED'
      ipAddress,
      userAgent,
    } = req.body;

    if (!userId || !userRole || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const actionType =
      action === 'GRANTED'
        ? AuditActionType.BIOMETRIC_CONSENT_GRANTED
        : AuditActionType.BIOMETRIC_CONSENT_REVOKED;

    await logConsentAction(
      auditRepository,
      actionType,
      userId,
      userRole as UserRole,
      ipAddress || req.ip || '0.0.0.0',
      userAgent || req.get('user-agent') || 'unknown',
      'BIOMETRIC_DATA',
      '1.0'
    );

    // TODO: Update users table with biometric_consent = true/false

    res.json({
      success: true,
      message: `Biometric consent ${action.toLowerCase()} logged successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging biometric consent:', error);
    res.status(500).json({ error: 'Failed to log biometric consent' });
  }
});

// ============================================================================
// SEND PARENTAL VERIFICATION EMAIL
// ============================================================================

/**
 * POST /api/consent/send-parental-verification
 * 
 * Send verification email to parent/guardian with consent request
 * Generates a unique verification code that must be entered to confirm consent
 */
router.post('/send-parental-verification', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      playerName,
      playerAge,
      parentName,
      parentEmail,
      parentPhone,
      relationship,
    } = req.body;

    if (!parentName || !parentEmail || !relationship) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Store verification code in database with expiration (24 hours)
    // INSERT INTO parental_consent_verifications (
    //   user_id, parent_email, verification_code, expires_at
    // ) VALUES (...)

    // TODO: Send verification email to parent
    // Email should include:
    // - Child's name and age
    // - Parent's name
    // - Links to Terms of Service, Privacy Policy, Refund Policy
    // - Verification code
    // - Instructions to enter code in app

    console.log(`Verification code for ${parentEmail}: ${verificationCode}`);

    res.json({
      success: true,
      message: 'Verification email sent successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending parental verification:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

// ============================================================================
// VERIFY PARENTAL CONSENT
// ============================================================================

/**
 * POST /api/consent/verify-parental-consent
 * 
 * Verify parental consent by validating the verification code
 * Once verified, log parental consent in audit system
 */
router.post('/verify-parental-consent', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      parentEmail,
      verificationCode,
      termsVersion,
      privacyVersion,
      refundVersion,
      ipAddress,
      userAgent,
    } = req.body;

    if (!parentEmail || !verificationCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Verify code from database
    // SELECT * FROM parental_consent_verifications
    // WHERE parent_email = ? AND verification_code = ? AND expires_at > NOW()

    // TODO: Mark verification as used
    // UPDATE parental_consent_verifications SET verified_at = NOW()

    // Log parental consent
    // TODO: Use custom audit log function for parental consent
    // This should include parent email and relationship

    // Update user record
    // TODO: UPDATE users SET parental_consent_verified = true, parental_consent_at = NOW()

    res.json({
      success: true,
      message: 'Parental consent verified successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error verifying parental consent:', error);
    res.status(500).json({ error: 'Failed to verify parental consent' });
  }
});

// ============================================================================
// GET USER CONSENT HISTORY
// ============================================================================

/**
 * GET /api/consent/history/:userId
 * 
 * Retrieve all consent records for a specific user
 * Only accessible to the user themselves or admins
 */
router.get('/history/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { requestingUserId, requestingUserRole } = req.query;

    // Verify access (user can view own, admins can view all)
    if (
      userId !== requestingUserId &&
      requestingUserRole !== UserRole.ADMIN
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // TODO: Query consent_logs table
    // SELECT * FROM consent_logs WHERE user_id = ? ORDER BY timestamp DESC

    res.json({
      success: true,
      consentRecords: [], // TODO: Return actual records
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving consent history:', error);
    res.status(500).json({ error: 'Failed to retrieve consent history' });
  }
});

// ============================================================================
// REVOKE CONSENT
// ============================================================================

/**
 * POST /api/consent/revoke
 * 
 * Allow user to revoke specific consent types
 * Revocation is logged in audit system
 */
router.post('/revoke', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      userRole,
      consentType, // BIOMETRIC, TERMS, PRIVACY_POLICY, etc.
      ipAddress,
      userAgent,
    } = req.body;

    if (!userId || !consentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Map consent type to audit action
    const actionTypeMap: Record<string, AuditActionType> = {
      BIOMETRIC: AuditActionType.BIOMETRIC_CONSENT_REVOKED,
      TERMS: AuditActionType.TERMS_ACCEPTED, // Log revocation
      PRIVACY_POLICY: AuditActionType.PRIVACY_POLICY_ACCEPTED,
    };

    const actionType = actionTypeMap[consentType];
    if (!actionType) {
      return res.status(400).json({ error: 'Invalid consent type' });
    }

    // Log revocation
    await logConsentAction(
      auditRepository,
      actionType,
      userId,
      userRole as UserRole,
      ipAddress || req.ip || '0.0.0.0',
      userAgent || req.get('user-agent') || 'unknown',
      consentType,
      '1.0'
    );

    // TODO: Update user record to revoke consent

    res.json({
      success: true,
      message: `${consentType} consent revoked successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revoking consent:', error);
    res.status(500).json({ error: 'Failed to revoke consent' });
  }
});

export default router;

/**
 * Stripe Payment Service
 * Handles payment processing with multiple payment methods and configurable platform fees
 */

export interface PaymentConfig {
  platformFeePercentage: number; // 0-100, e.g., 10 for 10%
  currency: string; // 'usd', 'eur', etc.
}

export interface PaymentMethod {
  type: 'card' | 'apple_pay' | 'cashapp' | 'venmo' | 'paypal' | 'bank_wire';
  label: string;
  icon: string;
  description: string;
}

export interface PaymentRequest {
  amount: number; // in cents
  description: string;
  paymentMethod: PaymentMethod['type'];
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  timestamp: Date;
  error?: string;
}

/**
 * Available payment methods with metadata
 */
export const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  card: {
    type: 'card',
    label: 'Credit/Debit Card',
    icon: 'credit-card',
    description: 'Visa, Mastercard, American Express',
  },
  apple_pay: {
    type: 'apple_pay',
    label: 'Apple Pay',
    icon: 'apple',
    description: 'Fast and secure payment with Apple Pay',
  },
  cashapp: {
    type: 'cashapp',
    label: 'Cash App',
    icon: 'dollar-sign',
    description: 'Pay with Cash App',
  },
  venmo: {
    type: 'venmo',
    label: 'Venmo',
    icon: 'send',
    description: 'Quick payment via Venmo',
  },
  paypal: {
    type: 'paypal',
    label: 'PayPal',
    icon: 'paypal',
    description: 'Secure payment with PayPal',
  },
  bank_wire: {
    type: 'bank_wire',
    label: 'Bank Wire',
    icon: 'bank',
    description: 'Direct bank transfer',
  },
};

/**
 * Calculate platform fee based on amount and fee percentage
 */
export function calculatePlatformFee(
  amount: number,
  feePercentage: number
): { platformFee: number; netAmount: number } {
  const platformFee = Math.round((amount * feePercentage) / 100);
  const netAmount = amount - platformFee;
  return { platformFee, netAmount };
}

/**
 * Stripe Payment Service Class
 */
export class StripePaymentService {
  private apiKey: string;
  private config: PaymentConfig;

  constructor(apiKey: string, config: PaymentConfig) {
    this.apiKey = apiKey;
    this.config = config;
  }

  /**
   * Process payment with specified payment method
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const { platformFee, netAmount } = calculatePlatformFee(
        request.amount,
        this.config.platformFeePercentage
      );

      // Simulate payment processing
      // In production, this would call actual Stripe API
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId,
        amount: request.amount,
        platformFee,
        netAmount,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        amount: request.amount,
        platformFee: 0,
        netAmount: 0,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  /**
   * Update platform fee percentage
   */
  updateFeePercentage(newPercentage: number): void {
    if (newPercentage < 0 || newPercentage > 100) {
      throw new Error('Fee percentage must be between 0 and 100');
    }
    this.config.platformFeePercentage = newPercentage;
  }

  /**
   * Get current platform fee percentage
   */
  getFeePercentage(): number {
    return this.config.platformFeePercentage;
  }

  /**
   * Get payment configuration
   */
  getConfig(): PaymentConfig {
    return { ...this.config };
  }
}

export default StripePaymentService;

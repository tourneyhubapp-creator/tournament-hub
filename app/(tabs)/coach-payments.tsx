import { ScrollView, Text, View, Pressable, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import { PAYMENT_METHODS, calculatePlatformFee } from '@/lib/stripe-service';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

export default function CoachPaymentsScreen() {
  const colors = useColors();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [platformFeePercentage, setPlatformFeePercentage] = useState(10);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      date: 'Mar 28, 2026',
      amount: 50000,
      method: 'card',
      status: 'completed',
      transactionId: 'txn_1234567890',
    },
    {
      id: '2',
      date: 'Mar 15, 2026',
      amount: 75000,
      method: 'paypal',
      status: 'completed',
      transactionId: 'txn_0987654321',
    },
  ]);

  const numAmount = parseFloat(amount) || 0;
  const { platformFee, netAmount } = calculatePlatformFee(numAmount * 100, platformFeePercentage);

  const handlePayment = () => {
    if (!selectedMethod || !amount) {
      return;
    }

    const newPayment: PaymentHistory = {
      id: `${paymentHistory.length + 1}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: numAmount * 100,
      method: selectedMethod,
      status: 'pending',
      transactionId: `txn_${Date.now()}`,
    };

    setPaymentHistory([newPayment, ...paymentHistory]);
    setAmount('');
    setSelectedMethod(null);
    setShowPaymentModal(false);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Tournament Payments</Text>
            <Text className="text-sm text-muted">Manage entry fees and payments</Text>
          </View>

          {/* Fee Configuration Section */}
          <View
            className="bg-surface rounded-2xl p-4 border border-border"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-lg font-semibold text-foreground mb-3">Platform Fee Configuration</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Current Fee Percentage:</Text>
                <Text className="text-lg font-bold text-primary">{platformFeePercentage}%</Text>
              </View>
              <TextInput
                className="bg-background text-foreground rounded-lg p-3 border border-border"
                placeholder="Enter fee percentage (0-100)"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={platformFeePercentage.toString()}
                onChangeText={(text) => {
                  const num = parseFloat(text) || 0;
                  if (num >= 0 && num <= 100) {
                    setPlatformFeePercentage(num);
                  }
                }}
              />
              <Text className="text-xs text-muted italic">
                Adjust the percentage amount you keep from each payment
              </Text>
            </View>
          </View>

          {/* Payment Entry Section */}
          <View
            className="bg-surface rounded-2xl p-4 border border-border"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-lg font-semibold text-foreground mb-3">New Payment</Text>
            <View className="gap-3">
              <View>
                <Text className="text-sm text-muted mb-2">Amount (USD)</Text>
                <TextInput
                  className="bg-background text-foreground rounded-lg p-3 border border-border"
                  placeholder="0.00"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* Fee Breakdown */}
              {numAmount > 0 && (
                <View className="bg-background rounded-lg p-3 gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Total Amount:</Text>
                    <Text className="text-sm font-semibold text-foreground">${numAmount.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Platform Fee ({platformFeePercentage}%):</Text>
                    <Text className="text-sm font-semibold text-primary">
                      ${(platformFee / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View className="h-px bg-border my-1" />
                  <View className="flex-row justify-between">
                    <Text className="text-sm font-semibold text-foreground">You Receive:</Text>
                    <Text className="text-sm font-bold text-primary">
                      ${(netAmount / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Payment Method Selection */}
              <View>
                <Text className="text-sm text-muted mb-2">Payment Method</Text>
                <View className="gap-2">
                  {Object.values(PAYMENT_METHODS).map((method) => (
                    <Pressable
                      key={method.type}
                      onPress={() => setSelectedMethod(method.type)}
                      style={({ pressed }) => [
                        {
                          opacity: pressed ? 0.7 : 1,
                          backgroundColor:
                            selectedMethod === method.type ? colors.primary : colors.background,
                        },
                      ]}
                      className="rounded-lg p-3 border border-border"
                    >
                      <Text
                        className={cn(
                          'font-semibold',
                          selectedMethod === method.type ? 'text-background' : 'text-foreground'
                        )}
                      >
                        {method.label}
                      </Text>
                      <Text
                        className={cn(
                          'text-xs mt-1',
                          selectedMethod === method.type ? 'text-background opacity-80' : 'text-muted'
                        )}
                      >
                        {method.description}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handlePayment}
                disabled={!selectedMethod || !amount}
                style={({ pressed }) => [
                  {
                    opacity: !selectedMethod || !amount ? 0.5 : pressed ? 0.8 : 1,
                  },
                ]}
                className="bg-primary rounded-lg p-4 items-center mt-2"
              >
                <Text className="text-background font-bold text-lg">Process Payment</Text>
              </Pressable>
            </View>
          </View>

          {/* Payment History */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Payment History</Text>
            {paymentHistory.length === 0 ? (
              <View className="bg-surface rounded-lg p-4 items-center">
                <Text className="text-muted">No payments yet</Text>
              </View>
            ) : (
              paymentHistory.map((payment) => (
                <View
                  key={payment.id}
                  className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      ${(payment.amount / 100).toFixed(2)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {payment.date} • {PAYMENT_METHODS[payment.method]?.label}
                    </Text>
                    <Text className="text-xs text-muted">{payment.transactionId}</Text>
                  </View>
                  <View
                    className={cn(
                      'px-3 py-1 rounded-full',
                      payment.status === 'completed'
                        ? 'bg-success'
                        : payment.status === 'pending'
                          ? 'bg-warning'
                          : 'bg-error'
                    )}
                  >
                    <Text className="text-xs font-semibold text-background capitalize">
                      {payment.status}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

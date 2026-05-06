/**
 * Parental Consent Screen
 * 
 * For users under 18, a parent/guardian must provide explicit consent.
 * This screen collects parental information and sends consent verification email.
 * Parental consent is logged in the immutable audit system.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';

interface ParentalConsentProps {
  userId: string;
  playerName: string;
  playerAge: number;
}

export default function ParentalConsentScreen() {
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'parent-details' | 'verification'>('info');

  // Parent information
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSendVerification = async () => {
    if (!parentName || !parentEmail || !relationship) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/consent/send-parental-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          parentEmail,
          parentPhone,
          relationship,
          playerName: 'Player Name', // Get from context
          playerAge: 16, // Get from context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      setStep('verification');
      Alert.alert(
        'Verification Email Sent',
        `A verification email has been sent to ${parentEmail}. Please check your email and enter the verification code.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification email. Please try again.');
      console.error('Verification email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Missing Code', 'Please enter the verification code from your email.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/consent/verify-parental-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail,
          verificationCode,
          termsVersion: '1.0',
          privacyVersion: '1.0',
          refundVersion: '1.0',
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Parental Consent Required
            </Text>
            <Text className="text-base text-muted">
              Since you are under 18, a parent or guardian must provide consent before
              you can use TourneyHub.
            </Text>
          </View>

          {step === 'info' && (
            <>
              {/* Information Section */}
              <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-lg font-semibold text-foreground">
                  What We Need
                </Text>
                <View className="gap-2">
                  <Text className="text-sm text-muted">
                    • Parent/Guardian full name
                  </Text>
                  <Text className="text-sm text-muted">
                    • Parent/Guardian email address
                  </Text>
                  <Text className="text-sm text-muted">
                    • Relationship to you (Parent, Guardian, etc.)
                  </Text>
                  <Text className="text-sm text-muted">
                    • Parent/Guardian phone number (optional)
                  </Text>
                </View>
              </View>

              {/* Privacy Notice */}
              <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning">
                <Text className="text-xs text-muted leading-relaxed">
                  <Text className="font-semibold">Privacy Notice:</Text> We will send a
                  verification email to your parent/guardian. They will review our
                  Terms of Service, Privacy Policy, and Refund Policy before providing
                  consent. We do not share your information with third parties.
                </Text>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={() => setStep('parent-details')}
                className="py-4 rounded-lg items-center justify-center bg-primary"
              >
                <Text className="text-background font-semibold text-base">
                  Continue
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'parent-details' && (
            <>
              {/* Parent Information Form */}
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    Parent/Guardian Full Name *
                  </Text>
                  <TextInput
                    placeholder="Enter full name"
                    value={parentName}
                    onChangeText={setParentName}
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    Parent/Guardian Email *
                  </Text>
                  <TextInput
                    placeholder="Enter email address"
                    value={parentEmail}
                    onChangeText={setParentEmail}
                    keyboardType="email-address"
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    Relationship *
                  </Text>
                  <View className="flex-row gap-2">
                    {['Parent', 'Guardian', 'Other'].map((rel) => (
                      <TouchableOpacity
                        key={rel}
                        onPress={() => setRelationship(rel)}
                        className={cn(
                          'flex-1 py-2 rounded-lg border-2',
                          relationship === rel
                            ? 'bg-primary border-primary'
                            : 'bg-surface border-border'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-center font-semibold',
                            relationship === rel ? 'text-background' : 'text-foreground'
                          )}
                        >
                          {rel}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    Phone Number (Optional)
                  </Text>
                  <TextInput
                    placeholder="Enter phone number"
                    value={parentPhone}
                    onChangeText={setParentPhone}
                    keyboardType="phone-pad"
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor={colors.muted}
                  />
                </View>
              </View>

              {/* Send Verification Button */}
              <TouchableOpacity
                disabled={loading}
                onPress={handleSendVerification}
                className={cn(
                  'py-4 rounded-lg items-center justify-center',
                  parentName && parentEmail && relationship
                    ? 'bg-primary'
                    : 'bg-muted opacity-50'
                )}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-background font-semibold text-base">
                    Send Verification Email
                  </Text>
                )}
              </TouchableOpacity>

              {/* Back Button */}
              <TouchableOpacity
                onPress={() => setStep('info')}
                className="py-3 rounded-lg items-center justify-center bg-surface border border-border"
              >
                <Text className="text-foreground font-semibold text-base">Back</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'verification' && (
            <>
              {/* Verification Code Section */}
              <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-lg font-semibold text-foreground">
                  Enter Verification Code
                </Text>
                <Text className="text-sm text-muted">
                  A verification code has been sent to {parentEmail}. Please enter it
                  below.
                </Text>
              </View>

              {/* Code Input */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Verification Code
                </Text>
                <TextInput
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  maxLength={6}
                  keyboardType="number-pad"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-center text-lg font-bold"
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                disabled={loading || verificationCode.length !== 6}
                onPress={handleVerifyCode}
                className={cn(
                  'py-4 rounded-lg items-center justify-center',
                  verificationCode.length === 6 ? 'bg-primary' : 'bg-muted opacity-50'
                )}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-background font-semibold text-base">
                    Verify Code
                  </Text>
                )}
              </TouchableOpacity>

              {/* Resend Link */}
              <TouchableOpacity onPress={handleSendVerification}>
                <Text className="text-primary font-semibold text-center">
                  Didn't receive code? Resend
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

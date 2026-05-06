/**
 * Mandatory Terms & Conditions Acceptance Screen
 * 
 * This screen MUST be displayed before any user can access the app.
 * Users cannot proceed until they explicitly accept all terms.
 * 
 * Acceptance is logged in the immutable audit system for legal defensibility.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';

interface TermsAcceptanceProps {
  userId: string;
  userRole: 'athlete' | 'coach' | 'tournament_host' | 'admin';
  ipAddress: string;
  userAgent: string;
}

export default function TermsAcceptanceScreen() {
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedRefund, setAcceptedRefund] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setScrolledToBottom(isAtBottom);
  };

  const handleAcceptAll = async () => {
    // Validate all checkboxes are checked
    if (!acceptedTerms || !acceptedPrivacy || !acceptedRefund) {
      Alert.alert(
        'Missing Acceptance',
        'You must accept all terms and policies to continue.'
      );
      return;
    }

    setLoading(true);

    try {
      // Log acceptance in audit system
      const response = await fetch('/api/consent/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termsVersion: '1.0',
          privacyVersion: '1.0',
          refundVersion: '1.0',
          timestamp: new Date().toISOString(),
          ipAddress: 'client-ip', // Get from device
          userAgent: 'mobile-app',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log acceptance');
      }

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to process your acceptance. Please try again.');
      console.error('Terms acceptance error:', error);
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">
              Welcome to TourneyHub
            </Text>
            <Text className="text-base text-muted">
              Before you can use our platform, please review and accept our terms,
              privacy policy, and refund policy.
            </Text>
          </View>

          {/* Terms of Service */}
          <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground">
              Terms of Service
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              By using TourneyHub, you agree to comply with our Terms of Service,
              including all rules, regulations, and policies. You represent that you
              have read and understand all terms, and that you will use the platform
              only for lawful purposes.
            </Text>
            <TouchableOpacity
              className="py-2"
              onPress={() => {
                // TODO: Open full Terms of Service document
                Alert.alert('Terms of Service', 'Full document would open here');
              }}
            >
              <Text className="text-primary font-semibold">
                Read Full Terms of Service →
              </Text>
            </TouchableOpacity>

            {/* Checkbox */}
            <TouchableOpacity
              className="flex-row items-center gap-3 mt-2"
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                className={cn(
                  'w-6 h-6 rounded border-2',
                  acceptedTerms
                    ? 'bg-primary border-primary'
                    : 'border-border bg-background'
                )}
              >
                {acceptedTerms && (
                  <Text className="text-white text-center text-sm font-bold">✓</Text>
                )}
              </View>
              <Text className="text-sm text-foreground flex-1">
                I accept the Terms of Service
              </Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Policy */}
          <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground">
              Privacy Policy
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              We collect and process personal information to provide our services.
              Our Privacy Policy explains how we collect, use, and protect your data,
              including special protections for minors under COPPA compliance.
            </Text>
            <TouchableOpacity
              className="py-2"
              onPress={() => {
                // TODO: Open full Privacy Policy document
                Alert.alert('Privacy Policy', 'Full document would open here');
              }}
            >
              <Text className="text-primary font-semibold">
                Read Full Privacy Policy →
              </Text>
            </TouchableOpacity>

            {/* Checkbox */}
            <TouchableOpacity
              className="flex-row items-center gap-3 mt-2"
              onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
            >
              <View
                className={cn(
                  'w-6 h-6 rounded border-2',
                  acceptedPrivacy
                    ? 'bg-primary border-primary'
                    : 'border-border bg-background'
                )}
              >
                {acceptedPrivacy && (
                  <Text className="text-white text-center text-sm font-bold">✓</Text>
                )}
              </View>
              <Text className="text-sm text-foreground flex-1">
                I accept the Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Refund Policy */}
          <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground">
              Refund Policy
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              Our Refund Policy outlines when refunds are available and when fees are
              non-refundable. Most tournament entry fees are non-refundable once
              registration is confirmed.
            </Text>
            <TouchableOpacity
              className="py-2"
              onPress={() => {
                // TODO: Open full Refund Policy document
                Alert.alert('Refund Policy', 'Full document would open here');
              }}
            >
              <Text className="text-primary font-semibold">
                Read Full Refund Policy →
              </Text>
            </TouchableOpacity>

            {/* Checkbox */}
            <TouchableOpacity
              className="flex-row items-center gap-3 mt-2"
              onPress={() => setAcceptedRefund(!acceptedRefund)}
            >
              <View
                className={cn(
                  'w-6 h-6 rounded border-2',
                  acceptedRefund
                    ? 'bg-primary border-primary'
                    : 'border-border bg-background'
                )}
              >
                {acceptedRefund && (
                  <Text className="text-white text-center text-sm font-bold">✓</Text>
                )}
              </View>
              <Text className="text-sm text-foreground flex-1">
                I accept the Refund Policy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Legal Notice */}
          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning">
            <Text className="text-xs text-muted leading-relaxed">
              <Text className="font-semibold">Legal Notice:</Text> By clicking "Accept
              All Terms," you acknowledge that you have read, understood, and agree to
              be bound by all terms, policies, and conditions. Your acceptance is
              logged and timestamped for legal defensibility. If you are under 18,
              your parent or guardian must also provide consent.
            </Text>
          </View>

          {/* Scroll Indicator */}
          {!scrolledToBottom && (
            <View className="bg-surface rounded-lg p-3 border border-border">
              <Text className="text-xs text-muted text-center">
                Please scroll down to review all policies
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Accept Button */}
      <View className="p-6 gap-3 bg-background border-t border-border">
        <TouchableOpacity
          disabled={loading || !scrolledToBottom}
          onPress={handleAcceptAll}
          className={cn(
            'py-4 rounded-lg items-center justify-center',
            scrolledToBottom && acceptedTerms && acceptedPrivacy && acceptedRefund
              ? 'bg-primary'
              : 'bg-muted opacity-50'
          )}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text className="text-foreground font-semibold text-base">
              Accept All Terms
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-xs text-muted text-center">
          You must accept all terms to continue using TourneyHub
        </Text>
      </View>
    </SafeAreaView>
  );
}

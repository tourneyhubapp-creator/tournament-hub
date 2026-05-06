/**
 * Admin Fee Management Dashboard
 * 
 * Admin-only feature for managing platform fees and viewing fee analytics.
 * Accessible only from Admin profile page.
 * 
 * Features:
 * - View current platform fee percentage
 * - Adjust platform fee percentage (0-100%)
 * - View fee history and changes
 * - Fee analytics and revenue tracking
 * - Audit log of all fee changes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface FeeRecord {
  id: string;
  percentage: number;
  effectiveDate: Date;
  changedBy: string;
  reason: string;
}

interface FeeAnalytics {
  totalRevenue: number;
  totalFees: number;
  averageFeePercentage: number;
  transactionCount: number;
  period: 'month' | 'quarter' | 'year';
}

export default function AdminFeeDashboard() {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [currentFeePercentage, setCurrentFeePercentage] = useState(3);
  const [newFeePercentage, setNewFeePercentage] = useState('3');
  const [feeHistory, setFeeHistory] = useState<FeeRecord[]>([]);
  const [analytics, setAnalytics] = useState<FeeAnalytics | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = async () => {
    try {
      setLoading(true);
      // TODO: Fetch current fee percentage
      // TODO: Fetch fee history
      // TODO: Fetch fee analytics
      
      // Mock data for now
      setCurrentFeePercentage(3);
      setNewFeePercentage('3');
      setFeeHistory([
        {
          id: '1',
          percentage: 3,
          effectiveDate: new Date('2026-05-01'),
          changedBy: 'admin@tourneyhub.com',
          reason: 'Standard rate',
        },
        {
          id: '2',
          percentage: 2.5,
          effectiveDate: new Date('2026-04-01'),
          changedBy: 'admin@tourneyhub.com',
          reason: 'Promotional rate',
        },
      ]);
      setAnalytics({
        totalRevenue: 125000,
        totalFees: 3750,
        averageFeePercentage: 3,
        transactionCount: 1250,
        period: 'month',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load fee data');
      console.error('Load fee data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFee = async () => {
    const newPercentage = parseFloat(newFeePercentage);

    if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
      Alert.alert('Invalid Input', 'Please enter a percentage between 0 and 100');
      return;
    }

    if (newPercentage === currentFeePercentage) {
      Alert.alert('No Change', 'New fee percentage is the same as current');
      return;
    }

    if (!editReason.trim()) {
      Alert.alert('Missing Reason', 'Please provide a reason for the fee change');
      return;
    }

    setSaveLoading(true);

    try {
      const response = await fetch('/api/admin/update-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPercentage,
          reason: editReason,
          effectiveDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update fee');
      }

      Alert.alert(
        'Success',
        `Platform fee updated from ${currentFeePercentage}% to ${newPercentage}%`
      );

      setCurrentFeePercentage(newPercentage);
      setShowEditModal(false);
      setEditReason('');
      loadFeeData(); // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Failed to update platform fee');
      console.error('Update fee error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Fee Management
            </Text>
            <Text className="text-base text-muted">
              Manage platform fees and view analytics
            </Text>
          </View>

          {/* Current Fee Card */}
          <View className="bg-surface rounded-lg p-6 border border-border gap-4">
            <View className="gap-1">
              <Text className="text-sm text-muted">Current Platform Fee</Text>
              <Text className="text-4xl font-bold text-primary">
                {currentFeePercentage}%
              </Text>
            </View>

            <View className="h-px bg-border" />

            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                Fee Impact Example:
              </Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Tournament Entry Fee:</Text>
                  <Text className="text-sm font-semibold text-foreground">$150.00</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Platform Fee ({currentFeePercentage}%):</Text>
                  <Text className="text-sm font-semibold text-primary">
                    ${(150 * (currentFeePercentage / 100)).toFixed(2)}
                  </Text>
                </View>
                <View className="h-px bg-border" />
                <View className="flex-row justify-between">
                  <Text className="text-sm font-semibold text-foreground">Total:</Text>
                  <Text className="text-sm font-bold text-foreground">
                    ${(150 + 150 * (currentFeePercentage / 100)).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Update Fee Button */}
            <TouchableOpacity
              onPress={() => setShowEditModal(true)}
              className="bg-primary rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-background font-semibold">Update Fee</Text>
            </TouchableOpacity>
          </View>

          {/* Fee Analytics */}
          {analytics && (
            <View className="bg-surface rounded-lg p-6 border border-border gap-4">
              <Text className="text-lg font-semibold text-foreground">
                Monthly Analytics
              </Text>

              <View className="gap-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Total Revenue:</Text>
                  <Text className="text-lg font-bold text-foreground">
                    ${analytics.totalRevenue.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Platform Fees Collected:</Text>
                  <Text className="text-lg font-bold text-primary">
                    ${analytics.totalFees.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Transactions:</Text>
                  <Text className="text-lg font-bold text-foreground">
                    {analytics.transactionCount.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Avg Fee Percentage:</Text>
                  <Text className="text-lg font-bold text-foreground">
                    {analytics.averageFeePercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Fee History */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Fee History</Text>

            {feeHistory.map((record) => (
              <View
                key={record.id}
                className="bg-surface rounded-lg p-4 border border-border"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="gap-1 flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {record.percentage}%
                    </Text>
                    <Text className="text-xs text-muted">
                      {record.effectiveDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="bg-primary bg-opacity-20 rounded px-2 py-1">
                    <Text className="text-xs font-semibold text-primary">
                      {record.reason}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">Changed by: {record.changedBy}</Text>
              </View>
            ))}
          </View>

          {/* Legal Notice */}
          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning">
            <Text className="text-xs text-muted leading-relaxed">
              <Text className="font-semibold">Admin Notice:</Text> All fee changes are
              logged in the immutable audit system and cannot be modified. Fee changes
              take effect immediately for new transactions.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Fee Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Update Platform Fee</Text>

            <View className="gap-3">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  New Fee Percentage (0-100%)
                </Text>
                <TextInput
                  placeholder="Enter percentage"
                  value={newFeePercentage}
                  onChangeText={setNewFeePercentage}
                  keyboardType="decimal-pad"
                  maxLength={5}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Reason for Change
                </Text>
                <TextInput
                  placeholder="Enter reason"
                  value={editReason}
                  onChangeText={setEditReason}
                  multiline
                  numberOfLines={3}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={saveLoading}
                onPress={handleUpdateFee}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                {saveLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-background font-semibold">Update Fee</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

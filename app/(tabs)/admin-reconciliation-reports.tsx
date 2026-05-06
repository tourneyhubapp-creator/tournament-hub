/**
 * Payment Reconciliation Report Generator
 * 
 * Admin-only feature for generating detailed payment reconciliation reports.
 * Reports include:
 * - Total revenue and fees
 * - Coach payouts
 * - Refunds and chargebacks
 * - Payment method breakdown
 * - Tournament-by-tournament breakdown
 * 
 * Reports can be exported as CSV for accounting integration.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface ReportData {
  id: string;
  period: string;
  generatedAt: Date;
  totalRevenue: number;
  platformFees: number;
  coachPayouts: number;
  refunds: number;
  chargebacks: number;
  netRevenue: number;
  transactionCount: number;
  paymentMethods: Record<string, number>;
  tournaments: Array<{
    id: string;
    name: string;
    revenue: number;
    fees: number;
    transactions: number;
  }>;
}

export default function AdminReconciliationReports() {
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/admin/generate-reconciliation-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: reportPeriod,
          startDate: getStartDate(),
          endDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reportData: ReportData = await response.json();
      setSelectedReport(reportData);
      setShowReportModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate reconciliation report');
      console.error('Generate report error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (): string => {
    const date = new Date();
    switch (reportPeriod) {
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date.toISOString();
  };

  const handleExportCSV = async () => {
    if (!selectedReport) return;

    setExportLoading(true);

    try {
      const response = await fetch('/api/admin/export-reconciliation-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: selectedReport.id,
          format: 'csv',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      // TODO: Download CSV file
      Alert.alert('Success', 'Report exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export report');
      console.error('Export error:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Payment Reconciliation
            </Text>
            <Text className="text-base text-muted">
              Generate detailed payment reports for accounting
            </Text>
          </View>

          {/* Report Period Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Report Period</Text>
            <View className="flex-row gap-2">
              {(['month', 'quarter', 'year'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setReportPeriod(period)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border-2',
                    reportPeriod === period
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-center font-semibold capitalize',
                      reportPeriod === period ? 'text-background' : 'text-foreground'
                    )}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generate Report Button */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleGenerateReport}
            className="bg-primary rounded-lg py-4 items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="text-background font-semibold text-base">
                Generate Report
              </Text>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Report Includes:
            </Text>
            <View className="gap-1">
              <Text className="text-sm text-muted">• Total revenue and platform fees</Text>
              <Text className="text-sm text-muted">• Coach payouts and refunds</Text>
              <Text className="text-sm text-muted">• Payment method breakdown</Text>
              <Text className="text-sm text-muted">• Tournament-by-tournament details</Text>
              <Text className="text-sm text-muted">• Chargeback and dispute tracking</Text>
            </View>
          </View>

          {/* Legal Notice */}
          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning">
            <Text className="text-xs text-muted leading-relaxed">
              <Text className="font-semibold">Compliance Note:</Text> All payment data
              is sourced from immutable audit logs. Reports are suitable for tax
              reporting, audits, and regulatory compliance.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Report Modal */}
      {selectedReport && (
        <Modal
          visible={showReportModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReportModal(false)}
        >
          <View className="flex-1 bg-black bg-opacity-50">
            <View className="flex-1 bg-background m-4 rounded-lg overflow-hidden">
              <ScrollView className="flex-1">
                <View className="p-6 gap-6">
                  {/* Report Header */}
                  <View className="gap-2">
                    <Text className="text-2xl font-bold text-foreground">
                      Payment Reconciliation Report
                    </Text>
                    <Text className="text-sm text-muted">
                      Period: {selectedReport.period}
                    </Text>
                    <Text className="text-xs text-muted">
                      Generated: {selectedReport.generatedAt.toLocaleString()}
                    </Text>
                  </View>

                  {/* Summary Section */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    <Text className="text-lg font-semibold text-foreground">Summary</Text>

                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Total Revenue:</Text>
                        <Text className="text-sm font-bold text-foreground">
                          ${selectedReport.totalRevenue.toLocaleString()}
                        </Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Platform Fees:</Text>
                        <Text className="text-sm font-bold text-primary">
                          ${selectedReport.platformFees.toLocaleString()}
                        </Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Coach Payouts:</Text>
                        <Text className="text-sm font-bold text-foreground">
                          ${selectedReport.coachPayouts.toLocaleString()}
                        </Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Refunds:</Text>
                        <Text className="text-sm font-bold text-error">
                          -${selectedReport.refunds.toLocaleString()}
                        </Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Chargebacks:</Text>
                        <Text className="text-sm font-bold text-error">
                          -${selectedReport.chargebacks.toLocaleString()}
                        </Text>
                      </View>

                      <View className="h-px bg-border my-2" />

                      <View className="flex-row justify-between">
                        <Text className="text-sm font-semibold text-foreground">
                          Net Revenue:
                        </Text>
                        <Text className="text-sm font-bold text-success">
                          ${selectedReport.netRevenue.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Payment Methods */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    <Text className="text-lg font-semibold text-foreground">
                      Payment Methods
                    </Text>

                    {Object.entries(selectedReport.paymentMethods).map(([method, count]) => (
                      <View key={method} className="flex-row justify-between">
                        <Text className="text-sm text-muted capitalize">{method}:</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {count} transactions
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Top Tournaments */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    <Text className="text-lg font-semibold text-foreground">
                      Top Tournaments
                    </Text>

                    {selectedReport.tournaments.slice(0, 5).map((tournament) => (
                      <View key={tournament.id} className="gap-1">
                        <View className="flex-row justify-between">
                          <Text className="text-sm font-semibold text-foreground">
                            {tournament.name}
                          </Text>
                          <Text className="text-sm font-bold text-foreground">
                            ${tournament.revenue.toLocaleString()}
                          </Text>
                        </View>
                        <Text className="text-xs text-muted">
                          {tournament.transactions} transactions • ${tournament.fees.toLocaleString()} fees
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View className="p-6 gap-3 border-t border-border bg-background">
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={handleExportCSV}
                  className="bg-primary rounded-lg py-3 items-center justify-center"
                >
                  {exportLoading ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text className="text-background font-semibold">Export as CSV</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowReportModal(false)}
                  className="bg-surface border border-border rounded-lg py-3 items-center justify-center"
                >
                  <Text className="text-foreground font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScreenContainer>
  );
}

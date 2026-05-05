import { View, Text, ScrollView, Pressable, FlatList, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface CheckInRecord {
  id: string;
  playerId: string;
  playerName: string;
  timestamp: string;
  staffName: string;
  confidence: number;
  tournament: string;
  ageGroup: string;
  status: "checked-in" | "no-show" | "pending";
}

interface StaffMetrics {
  staffName: string;
  totalCheckIns: number;
  accuracy: number;
  averageConfidence: number;
}

export default function CheckInAnalyticsScreen() {
  const colors = useColors();
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [staffMetrics, setStaffMetrics] = useState<StaffMetrics[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");

  // Mock data for demonstration
  useEffect(() => {
    const mockRecords: CheckInRecord[] = [
      {
        id: "1",
        playerId: "TH-001",
        playerName: "Marcus Johnson",
        timestamp: new Date().toLocaleTimeString(),
        staffName: "Coach Sarah",
        confidence: 0.94,
        tournament: "Spring Classic 7v7",
        ageGroup: "14U",
        status: "checked-in",
      },
      {
        id: "2",
        playerId: "TH-002",
        playerName: "Jake Williams",
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
        staffName: "Coach Mike",
        confidence: 0.91,
        tournament: "Spring Classic 7v7",
        ageGroup: "14U",
        status: "checked-in",
      },
      {
        id: "3",
        playerId: "TH-003",
        playerName: "Tyler Brown",
        timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
        staffName: "Coach Sarah",
        confidence: 0.78,
        tournament: "Spring Classic 7v7",
        ageGroup: "16U",
        status: "checked-in",
      },
      {
        id: "4",
        playerId: "TH-004",
        playerName: "Alex Rodriguez",
        timestamp: "",
        staffName: "",
        confidence: 0,
        tournament: "Spring Classic 7v7",
        ageGroup: "14U",
        status: "no-show",
      },
    ];

    setCheckInRecords(mockRecords);

    // Calculate staff metrics
    const metrics: Record<string, StaffMetrics> = {};
    mockRecords.forEach((record) => {
      if (!metrics[record.staffName]) {
        metrics[record.staffName] = {
          staffName: record.staffName,
          totalCheckIns: 0,
          accuracy: 0,
          averageConfidence: 0,
        };
      }
      if (record.status === "checked-in") {
        metrics[record.staffName].totalCheckIns++;
        metrics[record.staffName].averageConfidence += record.confidence;
      }
    });

    Object.values(metrics).forEach((metric) => {
      if (metric.totalCheckIns > 0) {
        metric.averageConfidence /= metric.totalCheckIns;
        metric.accuracy = 95 + Math.random() * 5; // Mock accuracy
      }
    });

    setStaffMetrics(Object.values(metrics));
  }, []);

  const filteredRecords = checkInRecords.filter((record) => {
    if (selectedTournament !== "all" && record.tournament !== selectedTournament) {
      return false;
    }
    if (selectedAgeGroup !== "all" && record.ageGroup !== selectedAgeGroup) {
      return false;
    }
    return true;
  });

  const checkedInCount = filteredRecords.filter((r) => r.status === "checked-in").length;
  const noShowCount = filteredRecords.filter((r) => r.status === "no-show").length;
  const pendingCount = filteredRecords.filter((r) => r.status === "pending").length;
  const totalPlayers = filteredRecords.length;
  const checkInPercentage = totalPlayers > 0 ? ((checkedInCount / totalPlayers) * 100).toFixed(0) : "0";

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Check-In Analytics</Text>
            <Text className="text-sm text-muted">Real-time tournament check-in statistics</Text>
          </View>

          {/* Summary Stats */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Summary</Text>
            <View className="flex-row gap-3">
              {/* Check-In Rate */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#EF4444" }}
                  >
                    <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Check-In Rate</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{checkInPercentage}%</Text>
                <Text className="text-xs text-muted mt-1">
                  {checkedInCount} of {totalPlayers}
                </Text>
              </View>

              {/* No-Shows */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#F87171" }}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">No-Shows</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{noShowCount}</Text>
                <Text className="text-xs text-muted mt-1">Not checked in</Text>
              </View>

              {/* Pending */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#FBBF24" }}
                  >
                    <IconSymbol name="clock.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Pending</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{pendingCount}</Text>
                <Text className="text-xs text-muted mt-1">Awaiting confirmation</Text>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Filters</Text>

            {/* Tournament Filter */}
            <View className="gap-2">
              <Text className="text-sm text-muted">Tournament</Text>
              <View className="flex-row gap-2">
                {["all", "Spring Classic 7v7", "Gulf Coast Showcase"].map((tournament) => (
                  <Pressable
                    key={tournament}
                    onPress={() => setSelectedTournament(tournament)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        selectedTournament === tournament ? "#EF4444" : colors.surface,
                      borderWidth: 1,
                      borderColor: selectedTournament === tournament ? "#EF4444" : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedTournament === tournament ? "#fff" : colors.foreground,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {tournament === "all" ? "All Tournaments" : tournament}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Age Group Filter */}
            <View className="gap-2">
              <Text className="text-sm text-muted">Age Group</Text>
              <View className="flex-row gap-2">
                {["all", "14U", "16U", "18U"].map((ageGroup) => (
                  <Pressable
                    key={ageGroup}
                    onPress={() => setSelectedAgeGroup(ageGroup)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        selectedAgeGroup === ageGroup ? "#EF4444" : colors.surface,
                      borderWidth: 1,
                      borderColor: selectedAgeGroup === ageGroup ? "#EF4444" : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedAgeGroup === ageGroup ? "#fff" : colors.foreground,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {ageGroup === "all" ? "All Ages" : ageGroup}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Staff Performance */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Staff Performance</Text>
            {staffMetrics.map((staff) => (
              <View
                key={staff.staffName}
                className="bg-surface rounded-xl p-4 border border-border gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-foreground">{staff.staffName}</Text>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#EF4444" }}
                  >
                    <Text className="text-xs font-bold text-white">
                      {(staff.accuracy).toFixed(0)}% Accuracy
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-xs text-muted">Check-Ins</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {staff.totalCheckIns}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted">Avg Confidence</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {(staff.averageConfidence * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Recent Check-Ins */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-foreground">Recent Check-Ins</Text>
              <Pressable
                onPress={() => Alert.alert("Export", "Check-in records exported successfully")}
              >
                <Text className="text-sm font-semibold text-red-500">Export</Text>
              </Pressable>
            </View>

            {filteredRecords.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={filteredRecords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    className="bg-surface rounded-xl p-4 border border-border mb-3 flex-row justify-between items-center"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{item.playerName}</Text>
                      <Text className="text-xs text-muted mt-1">
                        {item.ageGroup} • {item.tournament}
                      </Text>
                      {item.status === "checked-in" && (
                        <Text className="text-xs text-green-500 mt-1">
                          ✓ {item.timestamp} by {item.staffName}
                        </Text>
                      )}
                      {item.status === "no-show" && (
                        <Text className="text-xs text-red-500 mt-1">✗ No-show</Text>
                      )}
                    </View>
                    {item.status === "checked-in" && (
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            item.confidence >= 0.9
                              ? "#22C55E"
                              : item.confidence >= 0.85
                                ? "#FBBF24"
                                : "#F87171",
                        }}
                      >
                        <Text className="text-xs font-bold text-white">
                          {(item.confidence * 100).toFixed(0)}%
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            ) : (
              <View className="bg-surface rounded-xl p-8 items-center border border-border">
                <IconSymbol name="checkmark.circle" size={48} color={colors.muted} />
                <Text className="text-sm text-muted mt-4">No check-ins yet</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pb-6">
            <Pressable
              className="bg-red-500 rounded-xl py-4 items-center"
              onPress={() => Alert.alert("View Details", "Detailed check-in report opened")}
            >
              <Text className="text-white font-semibold">View Detailed Report</Text>
            </Pressable>
            <Pressable
              className="border border-red-500 rounded-xl py-4 items-center"
              onPress={() => Alert.alert("Send Reminder", "Reminder sent to no-shows")}
            >
              <Text className="text-red-500 font-semibold">Send No-Show Reminders</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import { View, Text, ScrollView, Pressable, FlatList, Alert, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface RosterPlayer {
  id: string;
  name: string;
  position: string;
  number: number;
  checkedIn: boolean;
  idCardReceived: boolean;
  waiverSigned: boolean;
  age: number;
}

export default function CoachRosterScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "checked-in" | "not-checked-in" | "no-waiver">(
    "all"
  );

  const [roster, setRoster] = useState<RosterPlayer[]>([
    {
      id: "1",
      name: "Marcus Johnson",
      position: "QB",
      number: 7,
      checkedIn: true,
      idCardReceived: true,
      waiverSigned: true,
      age: 16,
    },
    {
      id: "2",
      name: "Jake Williams",
      position: "WR",
      number: 12,
      checkedIn: true,
      idCardReceived: true,
      waiverSigned: true,
      age: 17,
    },
    {
      id: "3",
      name: "Tyler Brown",
      position: "DB",
      number: 5,
      checkedIn: false,
      idCardReceived: true,
      waiverSigned: false,
      age: 16,
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      position: "RB",
      number: 22,
      checkedIn: false,
      idCardReceived: false,
      waiverSigned: false,
      age: 15,
    },
    {
      id: "5",
      name: "Chris Thompson",
      position: "LB",
      number: 44,
      checkedIn: true,
      idCardReceived: false,
      waiverSigned: true,
      age: 17,
    },
  ]);

  // Filter roster based on search and filter criteria
  const filteredRoster = roster.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterBy) {
      case "checked-in":
        return player.checkedIn;
      case "not-checked-in":
        return !player.checkedIn;
      case "no-waiver":
        return !player.waiverSigned;
      default:
        return true;
    }
  });

  // Calculate stats
  const checkedInCount = roster.filter((p) => p.checkedIn).length;
  const idCardsDistributed = roster.filter((p) => p.idCardReceived).length;
  const waiversSigned = roster.filter((p) => p.waiverSigned).length;
  const totalPlayers = roster.length;

  const handleCheckIn = (playerId: string) => {
    setRoster(
      roster.map((p) => (p.id === playerId ? { ...p, checkedIn: true } : p))
    );
    Alert.alert("✓ Check-In Recorded", "Player checked in successfully");
  };

  const handleDistributeIdCard = (playerId: string) => {
    setRoster(
      roster.map((p) => (p.id === playerId ? { ...p, idCardReceived: true } : p))
    );
    Alert.alert("✓ ID Card Distributed", "Player ID card marked as distributed");
  };

  const handleConfirmWaiver = (playerId: string) => {
    setRoster(
      roster.map((p) => (p.id === playerId ? { ...p, waiverSigned: true } : p))
    );
    Alert.alert("✓ Waiver Confirmed", "Player waiver status updated");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Team Roster</Text>
            <Text className="text-sm text-muted">Manage players and tournament requirements</Text>
          </View>

          {/* Summary Stats */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Summary</Text>
            <View className="flex-row gap-3">
              {/* Checked In */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#22C55E" }}
                  >
                    <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Checked In</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{checkedInCount}</Text>
                <Text className="text-xs text-muted mt-1">of {totalPlayers}</Text>
              </View>

              {/* ID Cards */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#3B82F6" }}
                  >
                    <IconSymbol name="rectangle.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">ID Cards</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{idCardsDistributed}</Text>
                <Text className="text-xs text-muted mt-1">Distributed</Text>
              </View>

              {/* Waivers */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#8B5CF6" }}
                  >
                    <IconSymbol name="doc.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Waivers</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{waiversSigned}</Text>
                <Text className="text-xs text-muted mt-1">Signed</Text>
              </View>
            </View>
          </View>

          {/* Search and Filter */}
          <View className="gap-3">
            {/* Search */}
            <TextInput
              placeholder="Search by name or position..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            />

            {/* Filter Buttons */}
            <View className="flex-row gap-2 flex-wrap">
              {(["all", "checked-in", "not-checked-in", "no-waiver"] as const).map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setFilterBy(filter)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: filterBy === filter ? "#EF4444" : colors.surface,
                    borderWidth: 1,
                    borderColor: filterBy === filter ? "#EF4444" : colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: filterBy === filter ? "#fff" : colors.foreground,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {filter === "all"
                      ? "All"
                      : filter === "checked-in"
                        ? "Checked In"
                        : filter === "not-checked-in"
                          ? "Not Checked In"
                          : "No Waiver"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Roster List */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Players</Text>

            {filteredRoster.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={filteredRoster}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    className="bg-surface rounded-xl p-4 border border-border mb-3"
                    style={{ backgroundColor: colors.surface }}
                  >
                    {/* Player Header */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="font-semibold text-foreground">{item.name}</Text>
                          <View
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: "#EF4444" }}
                          >
                            <Text className="text-xs font-bold text-white">#{item.number}</Text>
                          </View>
                        </View>
                        <Text className="text-xs text-muted mt-1">
                          {item.position} • Age {item.age}
                        </Text>
                      </View>
                    </View>

                    {/* Status Indicators */}
                    <View className="gap-2 mb-3">
                      {/* Check-In Status */}
                      <View className="flex-row items-center gap-2">
                        <View
                          className="w-5 h-5 rounded items-center justify-center"
                          style={{
                            backgroundColor: item.checkedIn ? "#22C55E" : "#E5E7EB",
                          }}
                        >
                          {item.checkedIn && (
                            <IconSymbol name="checkmark" size={12} color="#fff" />
                          )}
                        </View>
                        <Text className="text-sm text-foreground flex-1">
                          {item.checkedIn ? "✓ Checked In" : "Not Checked In"}
                        </Text>
                        {!item.checkedIn && (
                          <Pressable
                            className="px-3 py-1 rounded-lg border border-red-500"
                            onPress={() => handleCheckIn(item.id)}
                          >
                            <Text className="text-xs font-semibold text-red-500">Check In</Text>
                          </Pressable>
                        )}
                      </View>

                      {/* ID Card Status */}
                      <View className="flex-row items-center gap-2">
                        <View
                          className="w-5 h-5 rounded items-center justify-center"
                          style={{
                            backgroundColor: item.idCardReceived ? "#3B82F6" : "#E5E7EB",
                          }}
                        >
                          {item.idCardReceived && (
                            <IconSymbol name="checkmark" size={12} color="#fff" />
                          )}
                        </View>
                        <Text className="text-sm text-foreground flex-1">
                          {item.idCardReceived ? "✓ ID Card Received" : "ID Card Pending"}
                        </Text>
                        {!item.idCardReceived && (
                          <Pressable
                            className="px-3 py-1 rounded-lg border border-blue-500"
                            onPress={() => handleDistributeIdCard(item.id)}
                          >
                            <Text className="text-xs font-semibold text-blue-500">Distribute</Text>
                          </Pressable>
                        )}
                      </View>

                      {/* Waiver Status */}
                      <View className="flex-row items-center gap-2">
                        <View
                          className="w-5 h-5 rounded items-center justify-center"
                          style={{
                            backgroundColor: item.waiverSigned ? "#8B5CF6" : "#E5E7EB",
                          }}
                        >
                          {item.waiverSigned && (
                            <IconSymbol name="checkmark" size={12} color="#fff" />
                          )}
                        </View>
                        <Text className="text-sm text-foreground flex-1">
                          {item.waiverSigned ? "✓ Waiver Signed" : "Waiver Pending"}
                        </Text>
                        {!item.waiverSigned && (
                          <Pressable
                            className="px-3 py-1 rounded-lg border border-purple-500"
                            onPress={() => handleConfirmWaiver(item.id)}
                          >
                            <Text className="text-xs font-semibold text-purple-500">Confirm</Text>
                          </Pressable>
                        )}
                      </View>
                    </View>

                    {/* Download Waiver */}
                    <Pressable
                      className="border border-border rounded-lg py-2 items-center"
                      onPress={() => Alert.alert("Download", `${item.name}'s waiver downloaded`)}
                    >
                      <Text className="text-xs font-semibold text-red-500">
                        Download Waiver Copy
                      </Text>
                    </Pressable>
                  </View>
                )}
              />
            ) : (
              <View className="bg-surface rounded-xl p-8 items-center border border-border">
                <IconSymbol name="person.fill" size={48} color={colors.muted} />
                <Text className="text-sm text-muted mt-4">No players match filter</Text>
              </View>
            )}
          </View>

          {/* Bulk Actions */}
          <View className="gap-3 pb-6">
            <Pressable
              className="bg-red-500 rounded-xl py-4 items-center"
              onPress={() => Alert.alert("Bulk Action", "Send waiver reminders to unsigned")}
            >
              <Text className="text-white font-semibold">Send Waiver Reminders</Text>
            </Pressable>
            <Pressable
              className="border border-red-500 rounded-xl py-4 items-center"
              onPress={() => Alert.alert("Export", "Roster exported successfully")}
            >
              <Text className="text-red-500 font-semibold">Export Roster</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

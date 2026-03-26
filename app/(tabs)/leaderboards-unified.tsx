import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  team: string;
  position: string;
  statValue: number;
  statLabel: string;
}

export default function UnifiedLeaderboardsScreen() {
  const colors = useColors();
  const [boardType, setBoardType] = useState<"leaderboard" | "indexboard">("leaderboard");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"national" | "state">("national");

  // Mock data for national rankings
  const nationalQBLeaders = [
    { rank: 1, playerName: "Marcus Johnson", team: "Texas Elite 7v7", position: "QB", statValue: 2840, statLabel: "Pass Yards" },
    { rank: 2, playerName: "Jake Williams", team: "Lone Star Ballers", position: "QB", statValue: 2650, statLabel: "Pass Yards" },
    { rank: 3, playerName: "Tyler Brown", team: "Gulf Coast Warriors", position: "QB", statValue: 2520, statLabel: "Pass Yards" },
    { rank: 4, playerName: "Alex Martinez", team: "ATX Lightning", position: "QB", statValue: 2410, statLabel: "Pass Yards" },
    { rank: 5, playerName: "Chris Davis", team: "Alamo Elite", position: "QB", statValue: 2380, statLabel: "Pass Yards" },
  ];

  const nationalReceiverLeaders = [
    { rank: 1, playerName: "DeShawn Harris", team: "Texas Elite 7v7", position: "WR", statValue: 156, statLabel: "Receptions" },
    { rank: 2, playerName: "Brandon Lee", team: "Lone Star Ballers", position: "WR", statValue: 142, statLabel: "Receptions" },
    { rank: 3, playerName: "Jordan Smith", team: "Gulf Coast Warriors", position: "WR", statValue: 138, statLabel: "Receptions" },
    { rank: 4, playerName: "Malik Jackson", team: "ATX Lightning", position: "WR", statValue: 131, statLabel: "Receptions" },
    { rank: 5, playerName: "Tre White", team: "Alamo Elite", position: "WR", statValue: 127, statLabel: "Receptions" },
  ];

  const positions = ["All", "QB", "WR", "Defense"];

  const getLeaderboardData = () => {
    if (selectedPosition === "QB" || selectedPosition === null) {
      return nationalQBLeaders;
    }
    return nationalReceiverLeaders;
  };

  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: item.rank <= 3 ? colors.surface : "transparent",
      }}
    >
      {/* Rank Badge */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: item.rank === 1 ? "#FFD700" : item.rank === 2 ? "#C0C0C0" : item.rank === 3 ? "#CD7F32" : colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ fontWeight: "700", color: item.rank <= 3 ? "#000" : "#FFF", fontSize: 14 }}>
          {item.rank}
        </Text>
      </View>

      {/* Player Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
          {item.playerName}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
          {item.position} • {item.team}
        </Text>
      </View>

      {/* Stat Value */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary }}>
          {item.statValue}
        </Text>
        <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
          {item.statLabel}
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground }}>
          Rankings & Leaderboards
        </Text>
        <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
          National & State Stats
        </Text>
      </View>

      {/* PROMINENT BOARD TYPE SELECTOR AT TOP */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Select View
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => setBoardType("leaderboard")}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: boardType === "leaderboard" ? colors.primary : colors.surface,
              borderWidth: boardType === "leaderboard" ? 0 : 1,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            })}
          >
            <IconSymbol name="list.number" size={18} color={boardType === "leaderboard" ? "#000" : colors.foreground} />
            <Text
              style={{
                color: boardType === "leaderboard" ? "#000" : colors.foreground,
                fontWeight: "700",
                fontSize: 14,
              }}
            >
              Leaderboard
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setBoardType("indexboard")}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: boardType === "indexboard" ? colors.primary : colors.surface,
              borderWidth: boardType === "indexboard" ? 0 : 1,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            })}
          >
            <IconSymbol name="chart.bar.fill" size={18} color={boardType === "indexboard" ? "#000" : colors.foreground} />
            <Text
              style={{
                color: boardType === "indexboard" ? "#000" : colors.foreground,
                fontWeight: "700",
                fontSize: 14,
              }}
            >
              Index Board
            </Text>
          </Pressable>
        </View>
      </View>

      {/* National/State Tab Selector */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable
          onPress={() => setSelectedTab("national")}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: selectedTab === "national" ? colors.primary : colors.surface,
            opacity: pressed ? 0.8 : 1,
            alignItems: "center",
          })}
        >
          <Text style={{ color: selectedTab === "national" ? "#000" : colors.foreground, fontWeight: "600", fontSize: 13 }}>
            National
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab("state")}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: selectedTab === "state" ? colors.primary : colors.surface,
            opacity: pressed ? 0.8 : 1,
            alignItems: "center",
          })}
        >
          <Text style={{ color: selectedTab === "state" ? "#000" : colors.foreground, fontWeight: "600", fontSize: 13 }}>
            State
          </Text>
        </Pressable>
      </View>

      {/* Position Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {positions.map((pos) => (
            <Pressable
              key={pos}
              onPress={() => setSelectedPosition(pos === "All" ? null : pos)}
              style={({ pressed }) => ({
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: selectedPosition === pos || (pos === "All" && selectedPosition === null) ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: selectedPosition === pos || (pos === "All" && selectedPosition === null) ? "#000" : colors.foreground,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {pos}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Content based on board type */}
      {boardType === "leaderboard" ? (
        <FlatList
          data={getLeaderboardData()}
          renderItem={renderLeaderboardEntry}
          keyExtractor={(item) => `${item.rank}-${item.playerName}`}
          scrollEnabled={false}
        />
      ) : (
        <View style={{ paddingHorizontal: 16, paddingVertical: 24, alignItems: "center" }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconSymbol name="chart.bar.fill" size={40} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
            Index Board
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 20 }}>
            Index Board view shows advanced analytics and performance trends. Coming soon with detailed statistics and visualizations.
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}

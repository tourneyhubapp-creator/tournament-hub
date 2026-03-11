import React from "react";
import { ScrollView, Text, View, FlatList } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./icon-symbol";

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  team: string;
  position: string;
  statValue: number;
  statLabel: string;
}

interface LeaderboardProps {
  title: string;
  data: LeaderboardEntry[];
  filters?: {
    position?: string;
    state?: string;
    graduationYear?: number;
  };
  onFilterChange?: (filters: any) => void;
}

export function Leaderboard({ title, data, filters, onFilterChange }: LeaderboardProps) {
  const colors = useColors();

  const renderEntry = ({ item }: { item: LeaderboardEntry }) => (
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
          {title}
        </Text>
      </View>

      {/* Filters (Optional) */}
      {filters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {filters.position && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.primary }}>
                <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "600" }}>
                  {filters.position}
                </Text>
              </View>
            )}
            {filters.state && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600" }}>
                  {filters.state}
                </Text>
              </View>
            )}
            {filters.graduationYear && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600" }}>
                  Class of {filters.graduationYear}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Leaderboard List */}
      <FlatList
        data={data}
        renderItem={renderEntry}
        keyExtractor={(item) => `${item.rank}-${item.playerName}`}
        scrollEnabled={true}
      />
    </View>
  );
}

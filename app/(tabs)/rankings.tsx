import { FlatList, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const AGE_GROUPS = ["All", "12U", "14U", "16U", "18U"];

const MOCK_RANKINGS = [
  { rank: 1, team: "Texas Elite 7v7", city: "Dallas, TX", record: "28-4", points: 2450, change: 0 },
  { rank: 2, team: "Lone Star Ballers", city: "Houston, TX", record: "26-5", points: 2380, change: 1 },
  { rank: 3, team: "Gulf Coast Warriors", city: "Corpus Christi, TX", record: "24-6", points: 2290, change: -1 },
  { rank: 4, team: "ATX Lightning", city: "Austin, TX", record: "23-7", points: 2210, change: 2 },
  { rank: 5, team: "Alamo Elite", city: "San Antonio, TX", record: "22-8", points: 2150, change: 0 },
  { rank: 6, team: "North Texas Ballers", city: "Plano, TX", record: "21-9", points: 2080, change: -2 },
  { rank: 7, team: "Bayou City 7v7", city: "Houston, TX", record: "20-10", points: 2010, change: 1 },
  { rank: 8, team: "Panhandle Pride", city: "Amarillo, TX", record: "19-11", points: 1940, change: 3 },
  { rank: 9, team: "Rio Grande Ballers", city: "El Paso, TX", record: "18-12", points: 1870, change: -1 },
  { rank: 10, team: "Metroplex Elite", city: "Fort Worth, TX", record: "17-13", points: 1800, change: 0 },
  { rank: 11, team: "Coastal Ballers", city: "Galveston, TX", record: "16-14", points: 1730, change: 2 },
  { rank: 12, team: "Hill Country 7v7", city: "Kerrville, TX", record: "15-15", points: 1660, change: -3 },
  { rank: 13, team: "East Texas Elite", city: "Tyler, TX", record: "14-16", points: 1590, change: 1 },
  { rank: 14, team: "Team Velocity", city: "Lubbock, TX", record: "13-17", points: 1520, change: 0 },
  { rank: 15, team: "Piney Woods 7v7", city: "Lufkin, TX", record: "12-18", points: 1450, change: -1 },
];

function RankBadge({ rank }: { rank: number }) {
  const colors = useColors();
  const gold = "#F59E0B";
  const silver = "#94A3B8";
  const bronze = "#CD7F32";
  const bg = rank === 1 ? gold : rank === 2 ? silver : rank === 3 ? bronze : colors.surface;
  const textColor = rank <= 3 ? "#FFFFFF" : colors.muted;
  return (
    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: bg, alignItems: "center", justifyContent: "center", borderWidth: rank > 3 ? 1 : 0, borderColor: colors.border }}>
      <Text style={{ fontSize: 13, fontWeight: "700", color: textColor }}>{rank}</Text>
    </View>
  );
}

export default function RankingsScreen() {
  const colors = useColors();
  const [ageGroup, setAgeGroup] = useState("All");

  return (
    <ScreenContainer>
      <ScreenHeader title="National Rankings" subtitle="Updated weekly" />

      {/* Age Group Filter */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <FlatList
          horizontal
          data={AGE_GROUPS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setAgeGroup(item)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: ageGroup === item ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: ageGroup === item ? colors.primary : colors.border,
              })}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: ageGroup === item ? "#FFFFFF" : colors.muted }}>{item}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Top 3 Podium */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Top Teams</Text>
          {MOCK_RANKINGS.slice(0, 3).map((team) => (
            <View key={team.rank} style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <RankBadge rank={team.rank} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{team.team}</Text>
                <Text style={{ fontSize: 11, color: colors.muted }}>{team.city}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>{team.points.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Full Rankings List */}
      <FlatList
        data={MOCK_RANKINGS}
        keyExtractor={(item) => String(item.rank)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            })}
          >
            <RankBadge rank={item.rank} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.team}</Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>{item.city} · {item.record}</Text>
            </View>
            {/* Change indicator */}
            <View style={{ alignItems: "flex-end", gap: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.points.toLocaleString()}</Text>
              {item.change !== 0 && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <IconSymbol
                    name={item.change > 0 ? "chevron.up" : "chevron.down"}
                    size={12}
                    color={item.change > 0 ? colors.success : colors.error}
                  />
                  <Text style={{ fontSize: 11, color: item.change > 0 ? colors.success : colors.error, fontWeight: "600" }}>
                    {Math.abs(item.change)}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

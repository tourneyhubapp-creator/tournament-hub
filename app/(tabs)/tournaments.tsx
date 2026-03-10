import { FlatList, Text, View, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";

const MOCK_TOURNAMENTS = [
  { id: 1, name: "Spring Classic 7v7", date: "Apr 12-13, 2026", location: "Dallas, TX", fee: "$350", maxTeams: 32, registered: 24, status: "open", ageGroups: ["14U", "16U", "18U"] },
  { id: 2, name: "Gulf Coast Showcase", date: "May 3-4, 2026", location: "Houston, TX", fee: "$400", maxTeams: 24, registered: 18, status: "open", ageGroups: ["16U", "18U"] },
  { id: 3, name: "Lone Star Invitational", date: "May 17-18, 2026", location: "Austin, TX", fee: "$375", maxTeams: 32, registered: 32, status: "full", ageGroups: ["14U", "16U"] },
  { id: 4, name: "Summer Showcase", date: "Jun 7-8, 2026", location: "San Antonio, TX", fee: "$325", maxTeams: 24, registered: 8, status: "open", ageGroups: ["12U", "14U", "16U"] },
  { id: 5, name: "National Qualifier", date: "Jun 21-22, 2026", location: "Oklahoma City, OK", fee: "$500", maxTeams: 48, registered: 41, status: "open", ageGroups: ["16U", "18U"] },
];

export default function TournamentsScreen() {
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "full">("all");

  const filtered = MOCK_TOURNAMENTS.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <ScreenContainer>
      <ScreenHeader title="Tournaments" subtitle="Find & register your team" />

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tournaments..."
            placeholderTextColor={colors.muted}
            style={{ flex: 1, fontSize: 14, color: colors.foreground }}
          />
        </View>

        {/* Filter Pills */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["all", "open", "full"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                paddingHorizontal: 16,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: filter === f ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: filter === f ? colors.primary : colors.border,
              })}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: filter === f ? "#FFFFFF" : colors.muted, textTransform: "capitalize" }}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
        ListEmptyComponent={<EmptyState icon="trophy.fill" title="No tournaments found" description="Try adjusting your search or filters" />}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 18,
              borderWidth: 1,
              borderColor: colors.border,
            })}
          >
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <IconSymbol name="location.fill" size={13} color={colors.muted} />
                  <Text style={{ fontSize: 12, color: colors.muted }}>{item.location}</Text>
                </View>
              </View>
              <Badge label={item.status === "full" ? "Full" : "Open"} variant={item.status === "full" ? "error" : "success"} size="md" />
            </View>

            {/* Details */}
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconSymbol name="calendar" size={13} color={colors.muted} />
                <Text style={{ fontSize: 12, color: colors.muted }}>{item.date}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconSymbol name="dollarsign.circle.fill" size={13} color={colors.muted} />
                <Text style={{ fontSize: 12, color: colors.muted }}>{item.fee}/team</Text>
              </View>
            </View>

            {/* Age Groups */}
            <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
              {item.ageGroups.map((ag) => (
                <View key={ag} style={{ backgroundColor: colors.primary + "15", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>{ag}</Text>
                </View>
              ))}
            </View>

            {/* Progress Bar */}
            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: colors.muted }}>Teams Registered</Text>
                <Text style={{ fontSize: 11, color: colors.foreground, fontWeight: "600" }}>{item.registered}/{item.maxTeams}</Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                <View style={{ height: 6, backgroundColor: item.status === "full" ? colors.error : colors.primary, borderRadius: 3, width: `${(item.registered / item.maxTeams) * 100}%` }} />
              </View>
            </View>

            {/* Register Button */}
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: item.status === "full" ? colors.border : colors.primary,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              })}
              disabled={item.status === "full"}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: item.status === "full" ? colors.muted : "#FFFFFF" }}>
                {item.status === "full" ? "Tournament Full" : "Register Team"}
              </Text>
            </Pressable>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

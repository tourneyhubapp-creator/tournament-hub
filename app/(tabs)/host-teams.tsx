import { FlatList, Text, View, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";

const MOCK_TEAMS = [
  { id: 1, name: "Team Velocity 16U", city: "Lubbock, TX", ageGroup: "16U", players: 12, coach: "Coach Rivera", passportStatus: "all_verified", paymentStatus: "paid" },
  { id: 2, name: "ATX Lightning 14U", city: "Austin, TX", ageGroup: "14U", players: 10, coach: "Coach Martinez", passportStatus: "partial", paymentStatus: "paid" },
  { id: 3, name: "Gulf Coast Warriors 18U", city: "Corpus Christi, TX", ageGroup: "18U", players: 14, coach: "Coach Thompson", passportStatus: "all_verified", paymentStatus: "pending" },
  { id: 4, name: "Lone Star Ballers 16U", city: "Houston, TX", ageGroup: "16U", players: 11, coach: "Coach Davis", passportStatus: "partial", paymentStatus: "paid" },
  { id: 5, name: "Bayou City 7v7 18U", city: "Houston, TX", ageGroup: "18U", players: 13, coach: "Coach Wilson", passportStatus: "none", paymentStatus: "pending" },
];

export default function HostTeamsScreen() {
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const filtered = MOCK_TEAMS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.city.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedTeam !== null) {
    const team = MOCK_TEAMS.find((t) => t.id === selectedTeam)!;
    const players = [
      { name: "Marcus Johnson", position: "QB", passport: "verified", jersey: "1" },
      { name: "DeShawn Williams", position: "WR", passport: "verified", jersey: "11" },
      { name: "Tyler Brooks", position: "WR", passport: "pending", jersey: "15" },
      { name: "Jordan Smith", position: "RB", passport: "verified", jersey: "22" },
      { name: "Alex Turner", position: "DB", passport: "verified", jersey: "7" },
      { name: "Chris Evans", position: "DB", passport: "none", jersey: "4" },
      { name: "Brandon Lee", position: "LB", passport: "verified", jersey: "55" },
    ];

    return (
      <ScreenContainer>
        <ScreenHeader title={team.name} showBack onRightPress={() => setSelectedTeam(null)} />
        <FlatList
          data={players}
          keyExtractor={(item) => item.jersey}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListHeaderComponent={
            <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14 }}>
              <View style={{ flexDirection: "row", gap: 16, marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Coach</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{team.coach}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Location</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{team.city}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Badge label={team.ageGroup} variant="primary" size="md" />
                <Badge label={team.paymentStatus === "paid" ? "Paid" : "Payment Pending"} variant={team.paymentStatus === "paid" ? "success" : "warning"} size="md" />
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>#{item.jersey}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{item.position}</Text>
              </View>
              <Badge
                label={item.passport === "verified" ? "Verified" : item.passport === "pending" ? "Pending" : "No Passport"}
                variant={item.passport === "verified" ? "success" : item.passport === "pending" ? "warning" : "error"}
              />
            </View>
          )}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Registered Teams" subtitle="Manage rosters & passports" />

      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search teams..."
            placeholderTextColor={colors.muted}
            style={{ flex: 1, fontSize: 14, color: colors.foreground }}
          />
        </View>
      </View>

      {/* Summary */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, marginBottom: 12, gap: 10 }}>
        {[
          { label: "Total Teams", value: MOCK_TEAMS.length, color: colors.primary },
          { label: "Fully Verified", value: MOCK_TEAMS.filter((t) => t.passportStatus === "all_verified").length, color: colors.success },
          { label: "Pending Payment", value: MOCK_TEAMS.filter((t) => t.paymentStatus === "pending").length, color: colors.warning },
        ].map((stat) => (
          <View key={stat.label} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: stat.color }}>{stat.value}</Text>
            <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center", marginTop: 2 }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        ListEmptyComponent={<EmptyState icon="person.2.fill" title="No teams found" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedTeam(item.id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: colors.surface,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            })}
          >
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="person.2.fill" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{item.city} · {item.players} players</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                <Badge label={item.ageGroup} variant="primary" />
                <Badge
                  label={item.passportStatus === "all_verified" ? "All Verified" : item.passportStatus === "partial" ? "Partial" : "No Passports"}
                  variant={item.passportStatus === "all_verified" ? "success" : item.passportStatus === "partial" ? "warning" : "error"}
                />
              </View>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <Badge label={item.paymentStatus === "paid" ? "Paid" : "Pending"} variant={item.paymentStatus === "paid" ? "success" : "warning"} />
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

import { FlatList, Text, View, Pressable, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";

type TournamentStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";

const MOCK_TOURNAMENTS = [
  {
    id: 1, name: "Spring Classic 7v7", date: "Apr 12-13, 2026", location: "Dallas, TX",
    teams: 24, maxTeams: 32, status: "in_progress" as TournamentStatus, revenue: "$8,400",
    divisions: ["14U", "16U", "18U"], fields: 4,
  },
  {
    id: 2, name: "Gulf Coast Showcase", date: "May 3-4, 2026", location: "Houston, TX",
    teams: 18, maxTeams: 24, status: "open" as TournamentStatus, revenue: "$6,300",
    divisions: ["16U", "18U"], fields: 3,
  },
  {
    id: 3, name: "Summer Invitational", date: "Jun 7-8, 2026", location: "San Antonio, TX",
    teams: 0, maxTeams: 32, status: "draft" as TournamentStatus, revenue: "$0",
    divisions: ["14U", "16U"], fields: 4,
  },
];

const STATUS_CONFIG: Record<TournamentStatus, { label: string; variant: "success" | "primary" | "muted" | "error" | "warning" }> = {
  draft: { label: "Draft", variant: "muted" },
  open: { label: "Open", variant: "primary" },
  in_progress: { label: "Live", variant: "success" },
  completed: { label: "Completed", variant: "muted" },
  cancelled: { label: "Cancelled", variant: "error" },
};

type CreateFormState = { name: string; location: string; startDate: string; endDate: string; maxTeams: string; fee: string };

function CreateTournamentSheet({ onClose }: { onClose: () => void }) {
  const colors = useColors();
  const [form, setForm] = useState<CreateFormState>({ name: "", location: "", startDate: "", endDate: "", maxTeams: "32", fee: "" });

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
      <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: "90%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>Create Tournament</Text>
          <Pressable onPress={onClose} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
            <IconSymbol name="xmark.circle.fill" size={26} color={colors.muted} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
          {[
            { key: "name", label: "Tournament Name", placeholder: "e.g. Spring Classic 7v7" },
            { key: "location", label: "Location / Venue", placeholder: "e.g. Dallas, TX" },
            { key: "startDate", label: "Start Date", placeholder: "YYYY-MM-DD" },
            { key: "endDate", label: "End Date", placeholder: "YYYY-MM-DD" },
            { key: "maxTeams", label: "Max Teams", placeholder: "32" },
            { key: "fee", label: "Entry Fee (per team)", placeholder: "$350" },
          ].map((field) => (
            <View key={field.key}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>{field.label}</Text>
              <TextInput
                value={(form as any)[field.key]}
                onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                placeholder={field.placeholder}
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: colors.foreground,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>
          ))}

          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 8,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>Create Tournament</Text>
          </Pressable>
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </View>
  );
}

export default function HostTournamentsScreen() {
  const colors = useColors();
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const t = MOCK_TOURNAMENTS.find((x) => x.id === selected)!;
    return (
      <ScreenContainer>
        <ScreenHeader title={t.name} showBack onRightPress={() => setSelected(null)} rightIcon="pencil" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Status + Quick Actions */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {["Open Registration", "Start Tournament", "View Bracket"].map((action) => (
              <Pressable
                key={action}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                })}
              >
                <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary, textAlign: "center" }}>{action}</Text>
              </Pressable>
            ))}
          </View>

          {/* Teams */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>Registered Teams ({t.teams}/{t.maxTeams})</Text>
              <Badge label={`${Math.round((t.teams / t.maxTeams) * 100)}%`} variant="primary" />
            </View>
            <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4, marginBottom: 14 }}>
              <View style={{ height: 8, backgroundColor: colors.primary, borderRadius: 4, width: `${(t.teams / t.maxTeams) * 100}%` }} />
            </View>
            {["Team Velocity 16U", "ATX Lightning", "Gulf Coast Warriors", "Lone Star Ballers"].map((team, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: colors.border }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: colors.foreground }}>{team}</Text>
                <Badge label="Paid" variant="success" />
              </View>
            ))}
          </View>

          {/* Schedule */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>Today's Schedule</Text>
            {[
              { time: "8:00 AM", home: "Team Velocity", away: "ATX Lightning", field: "Field 1", score: "21-14" },
              { time: "9:30 AM", home: "Gulf Coast", away: "Lone Star", field: "Field 2", score: "In Progress" },
              { time: "11:00 AM", home: "TX Elite", away: "Bayou City", field: "Field 1", score: "Upcoming" },
            ].map((game, i) => (
              <View key={i} style={{ paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{game.time} · {game.field}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: game.score === "In Progress" ? colors.success : colors.muted }}>{game.score}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{game.home} vs {game.away}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title="My Tournaments"
        subtitle="Manage your events"
        rightIcon="plus.circle.fill"
        onRightPress={() => setShowCreate(true)}
      />

      {showCreate && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
          <CreateTournamentSheet onClose={() => setShowCreate(false)} />
        </View>
      )}

      <FlatList
        data={MOCK_TOURNAMENTS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        ListEmptyComponent={<EmptyState icon="trophy.fill" title="No tournaments yet" description="Create your first tournament to get started" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item.id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 18,
              borderWidth: 1,
              borderColor: colors.border,
            })}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 3 }}>{item.date} · {item.location}</Text>
              </View>
              <Badge label={STATUS_CONFIG[item.status].label} variant={STATUS_CONFIG[item.status].variant} size="md" />
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconSymbol name="person.2.fill" size={13} color={colors.muted} />
                <Text style={{ fontSize: 12, color: colors.muted }}>{item.teams}/{item.maxTeams} teams</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconSymbol name="dollarsign.circle.fill" size={13} color={colors.success} />
                <Text style={{ fontSize: 12, color: colors.success, fontWeight: "600" }}>{item.revenue}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconSymbol name="sportscourt.fill" size={13} color={colors.muted} />
                <Text style={{ fontSize: 12, color: colors.muted }}>{item.fields} fields</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
              {item.divisions.map((d) => (
                <View key={d} style={{ backgroundColor: colors.primary + "15", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                })}
                onPress={() => setSelected(item.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFFFFF" }}>Manage</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                })}
              >
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>Scores</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { RoleSelector } from "@/components/role-selector";
import { StatCard } from "@/components/ui/stat-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Badge } from "@/components/ui/badge";
import { useColors } from "@/hooks/use-colors";
import { useTournament } from "@/lib/tournament-context";
import { useRouter } from "expo-router";

// ─────────────────────────────────────────────
// ATHLETE HOME
// ─────────────────────────────────────────────
function AthleteHome() {
  const colors = useColors();
  const router = useRouter();

  const upcomingTournaments = [
    { id: 1, name: "Spring Classic 7v7", date: "Apr 12-13", location: "Dallas, TX", status: "open" },
    { id: 2, name: "Gulf Coast Showcase", date: "May 3-4", location: "Houston, TX", status: "open" },
  ];

  const recentActivity = [
    { id: 1, text: "Your passport was approved", time: "2h ago", icon: "checkmark.seal.fill" as const },
    { id: 2, text: "Team ranked #14 nationally", time: "1d ago", icon: "chart.bar.fill" as const },
    { id: 3, text: "New tournament in your area", time: "2d ago", icon: "trophy.fill" as const },
  ];

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b border-border">
        <View>
          <Text className="text-2xl font-bold text-foreground">Tournament Hub</Text>
          <Text className="text-sm text-muted">Welcome back, Athlete</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <RoleSelector />
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            onPress={() => {}}
          >
            <IconSymbol name="bell.fill" size={22} color={colors.muted} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Passport Banner */}
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          onPress={() => router.push("/passport" as any)}
        >
          <View
            style={{ backgroundColor: colors.primary, margin: 16, borderRadius: 20, padding: 20 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" }}>PLAYER PASSPORT</Text>
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginTop: 4 }}>Get Your Digital ID</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>Required for tournament play</Text>
              </View>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="qrcode" size={28} color="#FFFFFF" />
              </View>
            </View>
            <View style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <IconSymbol name="checkmark.circle.fill" size={16} color="#4ADE80" />
              <Text style={{ color: "#FFFFFF", fontSize: 13 }}>Passport Active — Expires Dec 2026</Text>
            </View>
          </View>
        </Pressable>

        {/* Stats Row */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Your Stats</Text>
          <View className="flex-row gap-3">
            <StatCard label="National Rank" value="#14" icon="medal.fill" color={colors.accent} />
            <StatCard label="Tournaments" value="8" icon="trophy.fill" color={colors.primary} />
            <StatCard label="Followers" value="234" icon="person.2.fill" color={colors.success} />
          </View>
        </View>

        {/* Upcoming Tournaments */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-foreground">Upcoming Tournaments</Text>
            <Pressable onPress={() => router.push("/tournaments" as any)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>See All</Text>
            </Pressable>
          </View>
          {upcomingTournaments.map((t) => (
            <Pressable
              key={t.id}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              })}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="trophy.fill" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{t.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{t.date} · {t.location}</Text>
              </View>
              <Badge label="Open" variant="success" />
            </Pressable>
          ))}
        </View>

        {/* Activity Feed */}
        <View className="px-4">
          <Text className="text-base font-bold text-foreground mb-3">Recent Activity</Text>
          {recentActivity.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name={item.icon} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.foreground }}>{item.text}</Text>
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─────────────────────────────────────────────
// HOST DASHBOARD
// ─────────────────────────────────────────────
function HostDashboard() {
  const colors = useColors();
  const router = useRouter();

  const stats = [
    { label: "Active Tournaments", value: "3", icon: "trophy.fill" as const, color: colors.primary },
    { label: "Registered Teams", value: "47", icon: "person.2.fill" as const, color: colors.success },
    { label: "Revenue (MTD)", value: "$4,820", icon: "dollarsign.circle.fill" as const, color: colors.accent },
    { label: "Pending Approvals", value: "6", icon: "clock.fill" as const, color: colors.warning },
  ];

  const recentTournaments = [
    { id: 1, name: "Spring Classic 7v7", teams: 24, status: "in_progress", date: "Apr 12-13" },
    { id: 2, name: "Gulf Coast Showcase", teams: 18, status: "open", date: "May 3-4" },
    { id: 3, name: "Summer Invitational", teams: 0, status: "draft", date: "Jun 7-8" },
  ];

  const statusColor = { in_progress: colors.success, open: colors.primary, draft: colors.muted };
  const statusLabel = { in_progress: "Live", open: "Open", draft: "Draft" };

  return (
    <ScreenContainer>
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b border-border">
        <View>
          <Text className="text-2xl font-bold text-foreground">Host Dashboard</Text>
          <Text className="text-sm text-muted">Manage your tournaments</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <RoleSelector />
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              backgroundColor: colors.primary,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            })}
            onPress={() => router.push("/host-tournaments" as any)}
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>New</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Stats Grid */}
        <View className="px-4 pt-4 mb-4">
          <View className="flex-row gap-3 mb-3">
            <StatCard label={stats[0].label} value={stats[0].value} icon={stats[0].icon} color={stats[0].color} />
            <StatCard label={stats[1].label} value={stats[1].value} icon={stats[1].icon} color={stats[1].color} />
          </View>
          <View className="flex-row gap-3">
            <StatCard label={stats[2].label} value={stats[2].value} icon={stats[2].icon} color={stats[2].color} />
            <StatCard label={stats[3].label} value={stats[3].value} icon={stats[3].icon} color={stats[3].color} />
          </View>
        </View>

        {/* Revenue Chart Placeholder */}
        <View className="mx-4 mb-4 bg-surface rounded-2xl p-4 border border-border">
          <Text className="text-sm font-bold text-foreground mb-3">Revenue This Month</Text>
          <View style={{ height: 80, flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
            {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
              <View key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: colors.primary + (i === 6 ? "FF" : "60"), borderRadius: 4 }} />
            ))}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <Text key={d} style={{ fontSize: 10, color: colors.muted, flex: 1, textAlign: "center" }}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Recent Tournaments */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-foreground">Your Tournaments</Text>
            <Pressable onPress={() => router.push("/host-tournaments" as any)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>Manage</Text>
            </Pressable>
          </View>
          {recentTournaments.map((t) => (
            <Pressable
              key={t.id}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              })}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="trophy.fill" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{t.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{t.teams} teams · {t.date}</Text>
              </View>
              <Badge
                label={(statusLabel as any)[t.status]}
                variant={t.status === "in_progress" ? "success" : t.status === "open" ? "primary" : "muted"}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─────────────────────────────────────────────
// ADMIN OVERVIEW
// ─────────────────────────────────────────────
function AdminOverview() {
  const colors = useColors();
  const router = useRouter();

  const stats = [
    { label: "Total Users", value: "1,284", icon: "person.2.fill" as const, color: colors.primary },
    { label: "Active Tournaments", value: "12", icon: "trophy.fill" as const, color: colors.accent },
    { label: "Platform Revenue", value: "$18.4K", icon: "dollarsign.circle.fill" as const, color: colors.success },
    { label: "Pending Passports", value: "23", icon: "qrcode" as const, color: colors.warning },
  ];

  const alerts = [
    { id: 1, text: "3 flagged posts need review", icon: "exclamationmark.triangle.fill" as const, color: colors.error },
    { id: 2, text: "23 passport applications pending", icon: "qrcode" as const, color: colors.warning },
    { id: 3, text: "2 payment disputes open", icon: "creditcard.fill" as const, color: colors.warning },
  ];

  return (
    <ScreenContainer>
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b border-border">
        <View>
          <Text className="text-2xl font-bold text-foreground">Admin Overview</Text>
          <Text className="text-sm text-muted">Platform management</Text>
        </View>
        <RoleSelector />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Stats Grid */}
        <View className="px-4 pt-4 mb-4">
          <View className="flex-row gap-3 mb-3">
            <StatCard label={stats[0].label} value={stats[0].value} icon={stats[0].icon} color={stats[0].color} />
            <StatCard label={stats[1].label} value={stats[1].value} icon={stats[1].icon} color={stats[1].color} />
          </View>
          <View className="flex-row gap-3">
            <StatCard label={stats[2].label} value={stats[2].value} icon={stats[2].icon} color={stats[2].color} />
            <StatCard label={stats[3].label} value={stats[3].value} icon={stats[3].icon} color={stats[3].color} />
          </View>
        </View>

        {/* Alerts */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Action Required</Text>
          {alerts.map((a) => (
            <Pressable
              key={a.id}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 14,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border,
              })}
            >
              <IconSymbol name={a.icon} size={20} color={a.color} />
              <Text style={{ flex: 1, fontSize: 13, color: colors.foreground }}>{a.text}</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4">
          <Text className="text-base font-bold text-foreground mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { label: "Review Passports", icon: "qrcode.viewfinder" as const, route: "/(tabs)/admin-users" },
              { label: "Manage Payments", icon: "creditcard.fill" as const, route: "/(tabs)/admin-payments" },
              { label: "Moderate Content", icon: "eye.fill" as const, route: "/(tabs)/admin-content" },
              { label: "User Management", icon: "person.2.fill" as const, route: "/(tabs)/admin-users" },
            ].map((action) => (
              <Pressable
                key={action.label}
                onPress={() => router.push(action.route.replace("/(tabs)", "") as any)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  width: "47%",
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  gap: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                })}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
                  <IconSymbol name={action.icon} size={22} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center" }}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─────────────────────────────────────────────
// ROOT: switch by role
// ─────────────────────────────────────────────
export default function HomeScreen() {
  const { activeRole } = useTournament();
  if (activeRole === "host") return <HostDashboard />;
  if (activeRole === "admin") return <AdminOverview />;
  return <AthleteHome />;
}

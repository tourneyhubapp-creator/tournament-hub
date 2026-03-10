import { FlatList, Text, View, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const MOCK_TRANSACTIONS = [
  { id: 1, team: "Team Velocity 16U", tournament: "Spring Classic 7v7", amount: "$350", date: "Mar 8, 2026", status: "completed" },
  { id: 2, team: "ATX Lightning 14U", tournament: "Spring Classic 7v7", amount: "$350", date: "Mar 7, 2026", status: "completed" },
  { id: 3, team: "Gulf Coast Warriors", tournament: "Gulf Coast Showcase", amount: "$400", date: "Mar 6, 2026", status: "pending" },
  { id: 4, team: "Lone Star Ballers", tournament: "Spring Classic 7v7", amount: "$350", date: "Mar 5, 2026", status: "completed" },
  { id: 5, team: "Bayou City 7v7", tournament: "Gulf Coast Showcase", amount: "$400", date: "Mar 4, 2026", status: "refunded" },
  { id: 6, team: "Panhandle Pride", tournament: "Spring Classic 7v7", amount: "$350", date: "Mar 3, 2026", status: "completed" },
];

const MONTHLY_DATA = [30, 55, 45, 70, 60, 85, 75];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HostPaymentsScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<"overview" | "transactions">("overview");

  const totalRevenue = 4820;
  const pendingRevenue = 800;
  const platformFee = Math.round(totalRevenue * 0.05);
  const netRevenue = totalRevenue - platformFee;

  return (
    <ScreenContainer>
      <ScreenHeader title="Revenue" subtitle="Payments & financial overview" />

      {/* Tab Toggle */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {[{ key: "overview", label: "Overview" }, { key: "transactions", label: "Transactions" }].map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key as any)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              flex: 1,
              paddingVertical: 10,
              borderRadius: 14,
              backgroundColor: tab === t.key ? colors.primary : colors.surface,
              alignItems: "center",
              borderWidth: 1,
              borderColor: tab === t.key ? colors.primary : colors.border,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: tab === t.key ? "#FFFFFF" : colors.muted }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === "overview" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Revenue Summary Card */}
          <View style={{ backgroundColor: colors.primary, borderRadius: 24, padding: 22 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Total Revenue (MTD)</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 36, fontWeight: "800", marginTop: 6 }}>${totalRevenue.toLocaleString()}</Text>
            <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Pending</Text>
                <Text style={{ color: "#FBBF24", fontSize: 16, fontWeight: "700" }}>${pendingRevenue}</Text>
              </View>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Platform Fee (5%)</Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: "700" }}>-${platformFee}</Text>
              </View>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Net Revenue</Text>
                <Text style={{ color: "#4ADE80", fontSize: 16, fontWeight: "700" }}>${netRevenue.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Bar Chart */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 14 }}>Daily Revenue This Week</Text>
            <View style={{ height: 100, flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
              {MONTHLY_DATA.map((h, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                  <View style={{ width: "100%", height: h, backgroundColor: i === 6 ? colors.primary : colors.primary + "50", borderRadius: 6 }} />
                  <Text style={{ fontSize: 10, color: colors.muted }}>{DAYS[i]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* By Tournament */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>Revenue by Tournament</Text>
            {[
              { name: "Spring Classic 7v7", amount: "$8,400", teams: 24, pct: 65 },
              { name: "Gulf Coast Showcase", amount: "$6,300", teams: 18, pct: 49 },
              { name: "Summer Invitational", amount: "$0", teams: 0, pct: 0 },
            ].map((t, i) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{t.name}</Text>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.success }}>{t.amount}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                  <View style={{ height: 6, backgroundColor: colors.primary, borderRadius: 3, width: `${t.pct}%` }} />
                </View>
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>{t.teams} teams registered</Text>
              </View>
            ))}
          </View>

          {/* Payout */}
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.success,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            })}
          >
            <IconSymbol name="dollarsign.circle.fill" size={20} color="#FFFFFF" />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>Request Payout — ${netRevenue.toLocaleString()}</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <FlatList
          data={MOCK_TRANSACTIONS}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.status === "refunded" ? colors.error + "15" : colors.success + "15", alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name={item.status === "refunded" ? "arrow.uturn.left" : "checkmark.circle.fill"} size={20} color={item.status === "refunded" ? colors.error : colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{item.team}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{item.tournament} · {item.date}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: item.status === "refunded" ? colors.error : colors.foreground }}>{item.status === "refunded" ? `-${item.amount}` : item.amount}</Text>
                <Badge
                  label={item.status === "completed" ? "Paid" : item.status === "pending" ? "Pending" : "Refunded"}
                  variant={item.status === "completed" ? "success" : item.status === "pending" ? "warning" : "error"}
                />
              </View>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

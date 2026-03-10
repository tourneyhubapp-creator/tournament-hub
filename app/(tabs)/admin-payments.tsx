import { FlatList, Text, View, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const MOCK_TRANSACTIONS = [
  { id: 1, from: "Team Velocity 16U", to: "Coach Rivera (Host)", amount: "$350", fee: "$17.50", date: "Mar 8, 2026", status: "completed", type: "registration" },
  { id: 2, from: "ATX Lightning 14U", to: "Coach Martinez (Host)", amount: "$350", fee: "$17.50", date: "Mar 7, 2026", status: "completed", type: "registration" },
  { id: 3, from: "Gulf Coast Warriors", to: "Coach Thompson (Host)", amount: "$400", fee: "$20.00", date: "Mar 6, 2026", status: "pending", type: "registration" },
  { id: 4, from: "Bayou City 7v7", to: "Coach Rivera (Host)", amount: "$350", fee: "$17.50", date: "Mar 5, 2026", status: "disputed", type: "registration" },
  { id: 5, from: "Passport Fee", to: "Platform", amount: "$25", fee: "$0", date: "Mar 4, 2026", status: "completed", type: "passport" },
];

const DISPUTES = MOCK_TRANSACTIONS.filter((t) => t.status === "disputed");

const WEEK_DATA = [42, 68, 55, 80, 72, 95, 88];

export default function AdminPaymentsScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<"overview" | "transactions" | "disputes">("overview");

  const totalRevenue = 18400;
  const platformFees = 920;
  const pendingPayouts = 3200;

  return (
    <ScreenContainer>
      <ScreenHeader title="Payment Oversight" subtitle="Platform financial management" />

      {/* Tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 6 }}>
        {[{ key: "overview", label: "Overview" }, { key: "transactions", label: "Transactions" }, { key: "disputes", label: `Disputes (${DISPUTES.length})` }].map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key as any)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              flex: 1,
              paddingVertical: 9,
              borderRadius: 12,
              backgroundColor: tab === t.key ? colors.primary : colors.surface,
              alignItems: "center",
              borderWidth: 1,
              borderColor: tab === t.key ? colors.primary : colors.border,
            })}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: tab === t.key ? "#FFFFFF" : colors.muted }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === "overview" && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Platform Revenue Card */}
          <View style={{ backgroundColor: colors.primary, borderRadius: 24, padding: 22 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Platform Revenue (MTD)</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 36, fontWeight: "800", marginTop: 6 }}>${totalRevenue.toLocaleString()}</Text>
            <View style={{ flexDirection: "row", gap: 20, marginTop: 16 }}>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Platform Fees</Text>
                <Text style={{ color: "#4ADE80", fontSize: 16, fontWeight: "700" }}>${platformFees.toLocaleString()}</Text>
              </View>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Pending Payouts</Text>
                <Text style={{ color: "#FBBF24", fontSize: 16, fontWeight: "700" }}>${pendingPayouts.toLocaleString()}</Text>
              </View>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Disputes</Text>
                <Text style={{ color: "#F87171", fontSize: 16, fontWeight: "700" }}>{DISPUTES.length}</Text>
              </View>
            </View>
          </View>

          {/* Revenue Chart */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 14 }}>Weekly Transaction Volume</Text>
            <View style={{ height: 100, flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
              {WEEK_DATA.map((h, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                  <View style={{ width: "100%", height: h, backgroundColor: i === 6 ? colors.primary : colors.primary + "50", borderRadius: 6 }} />
                  <Text style={{ fontSize: 10, color: colors.muted }}>
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Payment Type Breakdown */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>Revenue Breakdown</Text>
            {[
              { type: "Tournament Registrations", amount: "$15,200", pct: 82, color: colors.primary },
              { type: "Passport Fees", amount: "$2,100", pct: 11, color: colors.success },
              { type: "Late Fees & Misc", amount: "$1,100", pct: 7, color: colors.warning },
            ].map((item) => (
              <View key={item.type} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                  <Text style={{ fontSize: 13, color: colors.foreground }}>{item.type}</Text>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: item.color }}>{item.amount}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                  <View style={{ height: 6, backgroundColor: item.color, borderRadius: 3, width: `${item.pct}%` }} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {tab === "transactions" && (
        <FlatList
          data={MOCK_TRANSACTIONS}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4, gap: 10 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.from}</Text>
                <Badge
                  label={item.status}
                  variant={item.status === "completed" ? "success" : item.status === "pending" ? "warning" : "error"}
                />
              </View>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>→ {item.to}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <Text style={{ fontSize: 11, color: colors.muted }}>Amount</Text>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>{item.amount}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: colors.muted }}>Platform Fee</Text>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.success }}>{item.fee}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: colors.muted }}>Date</Text>
                  <Text style={{ fontSize: 13, color: colors.foreground }}>{item.date}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {tab === "disputes" && (
        <FlatList
          data={DISPUTES}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4, gap: 12 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.error + "30" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>Payment Dispute</Text>
                <Badge label="Open" variant="error" />
              </View>
              <Text style={{ fontSize: 13, color: colors.foreground, marginBottom: 4 }}>From: {item.from}</Text>
              <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>Amount: {item.amount} · {item.date}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, flex: 1, backgroundColor: colors.success, borderRadius: 12, paddingVertical: 11, alignItems: "center" })}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFFFFF" }}>Resolve</Text>
                </Pressable>
                <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, flex: 1, backgroundColor: colors.error + "15", borderRadius: 12, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: colors.error + "30" })}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.error }}>Issue Refund</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

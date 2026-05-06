import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Badge } from "@/components/ui/badge";
import { RoleSelector } from "@/components/role-selector";
import { useColors } from "@/hooks/use-colors";
import { useTournament } from "@/lib/tournament-context";
import { useRouter } from "expo-router";

function ProfileStat({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function MenuItem({ icon, label, value, onPress, danger }: { icon: any; label: string; value?: string; onPress?: () => void; danger?: boolean }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      })}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: danger ? colors.error + "15" : colors.surface, alignItems: "center", justifyContent: "center" }}>
        <IconSymbol name={icon} size={18} color={danger ? colors.error : colors.primary} />
      </View>
      <Text style={{ flex: 1, fontSize: 15, color: danger ? colors.error : colors.foreground, fontWeight: "500" }}>{label}</Text>
      {value && <Text style={{ fontSize: 13, color: colors.muted }}>{value}</Text>}
      <IconSymbol name="chevron.right" size={16} color={colors.muted} />
    </Pressable>
  );
}

function IDCardSelector({ type, icon, title, price, isActive, onSelect }: { type: "player" | "coach"; icon: any; title: string; price: string; isActive: boolean; onSelect: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        flex: 1,
        marginHorizontal: 8,
      })}
    >
      <View
        style={{
          backgroundColor: isActive ? colors.primary : colors.surface,
          borderWidth: 2,
          borderColor: isActive ? colors.primary : colors.border,
          borderRadius: 16,
          padding: 14,
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: isActive ? colors.background : colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSymbol name={icon} size={24} color={isActive ? colors.primary : colors.muted} />
        </View>
        <Text style={{ fontSize: 13, fontWeight: "700", color: isActive ? "white" : colors.foreground, textAlign: "center" }}>
          {title}
        </Text>
        <Text style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.8)" : colors.muted, textAlign: "center" }}>
          {price}
        </Text>
        {isActive && (
          <View style={{ marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 6 }}>
            <Text style={{ fontSize: 10, color: "white", fontWeight: "600" }}>Active</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const { activeRole } = useTournament();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeIDCard, setActiveIDCard] = useState<"player" | "coach">("player");

  const roleLabel = activeRole === "athlete" ? "Athlete" : activeRole === "coach" ? "Coach" : activeRole === "host" ? "Tournament Host" : "Platform Admin";
  const roleBadgeVariant = activeRole === "admin" ? "accent" : activeRole === "host" ? "primary" : activeRole === "coach" ? "warning" : "success";

  return (
    <ScreenContainer>
      <ScreenHeader 
        title="Profile" 
        rightIcon2="bell.fill" 
        onRightPress2={() => router.push("/(tabs)/notifications")}
        rightIcon="gearshape.fill" 
        onRightPress={() => {}} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile Header */}
        <View style={{ alignItems: "center", paddingVertical: 28, paddingHorizontal: 16 }}>
          <View style={{ position: "relative", marginBottom: 14 }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.primary }}>
              <IconSymbol name="person.crop.circle.fill" size={56} color={colors.primary} />
            </View>
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.background,
              })}
            >
              <IconSymbol name="camera.fill" size={14} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground }}>Marcus Johnson</Text>
          <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>Dallas, TX</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
            <Badge label={roleLabel} variant={roleBadgeVariant} size="md" />
            {activeRole === "athlete" && <Badge label="Verified" variant="success" size="md" />}
          </View>

          {/* Role Switcher */}
          <View style={{ marginTop: 14 }}>
            <RoleSelector />
          </View>
        </View>

        {/* Athlete: Your Credentials - Player ID Card Only */}
        {activeRole === "athlete" && (
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Your Credentials
            </Text>
            <View style={{ flexDirection: "row", gap: 0 }}>
              <IDCardSelector
                type="player"
                icon="person.fill"
                title="Player ID"
                price="$15/year"
                isActive={activeIDCard === "player"}
                onSelect={() => setActiveIDCard("player")}
              />
            </View>
          </View>
        )}

        {/* Coach: Your Credentials - Coach ID Card Only */}
        {activeRole === "coach" && (
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Your Credentials
            </Text>
            <View style={{ flexDirection: "row", gap: 0 }}>
              <IDCardSelector
                type="coach"
                icon="person.fill"
                title="Coach ID"
                price="$15/year"
                isActive={activeIDCard === "coach"}
                onSelect={() => setActiveIDCard("coach")}
              />
            </View>
          </View>
        )}

        {/* Stats Row */}
        {activeRole === "athlete" && (
          <View style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, flexDirection: "row", marginBottom: 20 }}>
            <ProfileStat label="Rank" value="#14" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Tournaments" value="8" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Followers" value="234" />
          </View>
        )}

        {activeRole === "coach" && (
          <View style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, flexDirection: "row", marginBottom: 20 }}>
            <ProfileStat label="Team" value="14" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Players" value="28" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Tournaments" value="6" />
          </View>
        )}

        {activeRole === "host" && (
          <View style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, flexDirection: "row", marginBottom: 20 }}>
            <ProfileStat label="Tournaments" value="12" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Teams Hosted" value="284" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Revenue" value="$24K" />
          </View>
        )}

        {activeRole === "admin" && (
          <View style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, flexDirection: "row", marginBottom: 20 }}>
            <ProfileStat label="Tournaments" value="247" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Users" value="12.4K" />
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <ProfileStat label="Revenue" value="$2.1M" />
          </View>
        )}

        {/* COACH CONSOLE */}
        {activeRole === "coach" && (
          <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Coach Console</Text>
            <MenuItem icon="person.2.fill" label="Team Roster" onPress={() => router.push("/(tabs)/coach-roster")} />
            <MenuItem icon="dollarsign.circle.fill" label="Payments" onPress={() => router.push("/(tabs)/coach-payments")} />
            <MenuItem icon="doc.fill" label="Waivers" onPress={() => router.push("/(tabs)/waiver-management")} />
            <MenuItem icon="bell.fill" label="Check-In Summary" onPress={() => router.push("/(tabs)/checkin-analytics")} />
          </View>
        )}

        {/* HOST CONSOLE */}
        {activeRole === "host" && (
          <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Host Console</Text>
            <MenuItem icon="camera.fill" label="Facial Recognition Check-In" onPress={() => router.push("/(tabs)/facial-recognition-checkin")} />
            <MenuItem icon="chart.bar.fill" label="Check-In Analytics" onPress={() => router.push("/(tabs)/checkin-analytics")} />
            <MenuItem icon="dollarsign.circle.fill" label="Payments" onPress={() => router.push("/(tabs)/host-payments")} />
            <MenuItem icon="doc.fill" label="Waivers" onPress={() => router.push("/(tabs)/waiver-management")} />
            <MenuItem icon="bell.fill" label="Notification Templates" onPress={() => router.push("/(tabs)/notification-templates")} />
          </View>
        )}

        {/* ADMIN CONSOLE */}
        {activeRole === "admin" && (
          <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Admin Console</Text>
            <MenuItem icon="dollarsign.circle.fill" label="Payments" onPress={() => router.push("/(tabs)/admin-payments")} />
            <MenuItem icon="gearshape.fill" label="Platform Fee Configuration" onPress={() => router.push("/(tabs)/admin-fee-dashboard")} />
            <MenuItem icon="doc.fill" label="Payment Reconciliation Reports" onPress={() => router.push("/(tabs)/admin-reconciliation-reports")} />
            <MenuItem icon="bell.fill" label="Notification Templates" onPress={() => router.push("/(tabs)/notification-templates")} />
          </View>
        )}

        {/* Athlete-specific */}
        {activeRole === "athlete" && (
          <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Athlete</Text>
            <MenuItem icon="qrcode" label="Player Passport" value="Active" />
            <MenuItem icon="person.fill" label="Edit Athlete Profile" />
            <MenuItem icon="video.fill" label="Highlight Videos" />
            <MenuItem icon="chart.line.uptrend.xyaxis" label="My Stats" />
          </View>
        )}

        {/* Account Settings */}
        <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Account</Text>
          <MenuItem icon="person.fill" label="Edit Profile" />
          <MenuItem icon="creditcard.fill" label="Payment Methods" />
          <MenuItem icon="doc.fill" label="My Receipts" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="bell.fill" size={18} color={colors.primary} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, color: colors.foreground, fontWeight: "500" }}>Notifications</Text>
            <Pressable onPress={() => {}}>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <View style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          <MenuItem icon="lock.fill" label="Sign Out" danger />
        </View>

        <Text style={{ textAlign: "center", fontSize: 12, color: colors.muted, marginTop: 24 }}>Tournament Hub v1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

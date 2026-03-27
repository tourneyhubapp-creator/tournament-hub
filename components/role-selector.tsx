import { View, Text, Pressable, Modal } from "react-native";
import { useState } from "react";
import { useTournament, type UserRole } from "@/lib/tournament-context";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const ROLES: { role: UserRole; label: string; icon: "figure.run" | "person.fill" | "building.2.fill" | "crown.fill"; description: string }[] = [
  { role: "athlete", label: "Athlete", icon: "figure.run", description: "View profile, passport & rankings" },
  { role: "coach", label: "Coach", icon: "person.fill", description: "Manage roster & tournaments" },
  { role: "host", label: "Host", icon: "building.2.fill", description: "Manage tournaments & teams" },
  { role: "admin", label: "Admin", icon: "crown.fill", description: "Platform management & oversight" },
];

export function RoleSelector() {
  const { activeRole, setActiveRole } = useTournament();
  const [visible, setVisible] = useState(false);
  const colors = useColors();

  const current = ROLES.find((r) => r.role === activeRole) ?? ROLES[0];

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.surface,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
        })}
      >
        <IconSymbol name={current.icon} size={14} color={colors.primary} />
        <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>{current.label}</Text>
        <IconSymbol name="chevron.down" size={14} color={colors.muted} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
          onPress={() => setVisible(false)}
        >
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>Switch Role</Text>
            {ROLES.map((item) => (
              <Pressable
                key={item.role}
                onPress={() => { setActiveRole(item.role); setVisible(false); }}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: activeRole === item.role ? colors.primary + "15" : colors.surface,
                  borderWidth: 1.5,
                  borderColor: activeRole === item.role ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" }}>
                  <IconSymbol name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>{item.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{item.description}</Text>
                </View>
                {activeRole === item.role && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                )}
              </Pressable>
            ))}
            <View style={{ height: 16 }} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

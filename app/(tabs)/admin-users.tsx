import { FlatList, Text, View, Pressable, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";

type UserRole = "athlete" | "host" | "admin";
type PassportStatus = "approved" | "pending" | "rejected" | "none";

const MOCK_USERS = [
  { id: 1, name: "Marcus Johnson", email: "marcus@example.com", role: "athlete" as UserRole, city: "Dallas, TX", joinedAt: "Jan 2026", passportStatus: "approved" as PassportStatus, status: "active" },
  { id: 2, name: "Coach Rivera", email: "rivera@example.com", role: "host" as UserRole, city: "Lubbock, TX", joinedAt: "Feb 2026", passportStatus: "none" as PassportStatus, status: "active" },
  { id: 3, name: "DeShawn Williams", email: "deshawn@example.com", role: "athlete" as UserRole, city: "Houston, TX", joinedAt: "Jan 2026", passportStatus: "pending" as PassportStatus, status: "active" },
  { id: 4, name: "Coach Martinez", email: "martinez@example.com", role: "host" as UserRole, city: "Austin, TX", joinedAt: "Mar 2026", passportStatus: "none" as PassportStatus, status: "active" },
  { id: 5, name: "Tyler Brooks", email: "tyler@example.com", role: "athlete" as UserRole, city: "San Antonio, TX", joinedAt: "Feb 2026", passportStatus: "rejected" as PassportStatus, status: "suspended" },
  { id: 6, name: "Jordan Smith", email: "jordan@example.com", role: "athlete" as UserRole, city: "Austin, TX", joinedAt: "Mar 2026", passportStatus: "pending" as PassportStatus, status: "active" },
];

const PASSPORT_QUEUE = MOCK_USERS.filter((u) => u.passportStatus === "pending");

export default function AdminUsersScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<"users" | "passports">("users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <ScreenContainer>
      <ScreenHeader title="User Management" subtitle="Manage users & passports" />

      {/* Tab Toggle */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {[{ key: "users", label: "All Users" }, { key: "passports", label: `Passport Queue (${PASSPORT_QUEUE.length})` }].map((t) => (
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
            <Text style={{ fontSize: 13, fontWeight: "700", color: tab === t.key ? "#FFFFFF" : colors.muted }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === "users" ? (
        <>
          {/* Search + Filter */}
          <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
              <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search users..."
                placeholderTextColor={colors.muted}
                style={{ flex: 1, fontSize: 14, color: colors.foreground }}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["all", "athlete", "host", "admin"] as const).map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRoleFilter(r)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: roleFilter === r ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: roleFilter === r ? colors.primary : colors.border,
                  })}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: roleFilter === r ? "#FFFFFF" : colors.muted, textTransform: "capitalize" }}>{r}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8, gap: 10 }}
            ListEmptyComponent={<EmptyState icon="person.2.fill" title="No users found" />}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" }}>
                  <IconSymbol name="person.crop.circle.fill" size={26} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.name}</Text>
                    {item.status === "suspended" && <Badge label="Suspended" variant="error" />}
                  </View>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{item.email}</Text>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                    <Badge label={item.role} variant={item.role === "admin" ? "accent" : item.role === "host" ? "primary" : "muted"} />
                    {item.passportStatus !== "none" && (
                      <Badge
                        label={item.passportStatus}
                        variant={item.passportStatus === "approved" ? "success" : item.passportStatus === "pending" ? "warning" : "error"}
                      />
                    )}
                  </View>
                </View>
                <View style={{ gap: 6 }}>
                  <Pressable
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: colors.primary + "15",
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                    })}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>View</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: item.status === "suspended" ? colors.success + "15" : colors.error + "15",
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                    })}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600", color: item.status === "suspended" ? colors.success : colors.error }}>
                      {item.status === "suspended" ? "Restore" : "Suspend"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <FlatList
          data={PASSPORT_QUEUE}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8, gap: 12 }}
          ListEmptyComponent={<EmptyState icon="qrcode" title="No pending passports" description="All passport applications have been reviewed" />}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.warning + "20", alignItems: "center", justifyContent: "center" }}>
                  <IconSymbol name="person.crop.circle.fill" size={28} color={colors.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{item.city} · Joined {item.joinedAt}</Text>
                </View>
                <Badge label="Pending Review" variant="warning" />
              </View>

              {/* Document checklist */}
              <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, marginBottom: 14, gap: 8 }}>
                {["Birth Certificate", "State ID", "Report Card", "Headshot"].map((doc, i) => (
                  <View key={doc} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <IconSymbol name={i < 3 ? "checkmark.circle.fill" : "xmark.circle.fill"} size={16} color={i < 3 ? colors.success : colors.error} />
                    <Text style={{ fontSize: 13, color: colors.foreground }}>{doc}</Text>
                    {i < 3 && <Text style={{ fontSize: 11, color: colors.muted, marginLeft: "auto" }}>Uploaded</Text>}
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                    backgroundColor: colors.success,
                    borderRadius: 12,
                    paddingVertical: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  })}
                >
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#FFFFFF" />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>Approve</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                    backgroundColor: colors.error + "15",
                    borderRadius: 12,
                    paddingVertical: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    borderWidth: 1,
                    borderColor: colors.error + "30",
                  })}
                >
                  <IconSymbol name="xmark.circle.fill" size={16} color={colors.error} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.error }}>Reject</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

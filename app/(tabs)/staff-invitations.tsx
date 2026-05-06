import { ScrollView, Text, View, Pressable, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  status: "invited" | "active" | "pending";
  invitedDate: string;
}

export default function StaffInvitationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: "1", name: "John Smith", email: "john@example.com", status: "active", invitedDate: "2024-01-15" },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", status: "active", invitedDate: "2024-01-10" },
    { id: "3", name: "Mike Davis", email: "mike@example.com", status: "pending", invitedDate: "2024-01-20" },
  ]);

  const handleInviteStaff = () => {
    // Mock invitation logic
    alert("Staff invitation sent to: " + searchText);
    setSearchText("");
  };

  const handleRevokeAccess = (id: string) => {
    setStaffMembers(staffMembers.filter(member => member.id !== id));
    alert("Staff access revoked");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success;
      case "pending":
        return colors.warning;
      case "invited":
        return colors.primary;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Invite Staff Members" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Search & Invite Section */}
        <View style={{ marginHorizontal: 16, marginVertical: 16, gap: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground }}>Find & Invite Staff</Text>
          
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              placeholder="Search by name or email..."
              value={searchText}
              onChangeText={setSearchText}
              style={{
                flex: 1,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                color: colors.foreground,
                fontSize: 14,
              }}
              placeholderTextColor={colors.muted}
            />
            <Pressable
              onPress={handleInviteStaff}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <IconSymbol name="plus" size={20} color="white" />
            </Pressable>
          </View>

          <Text style={{ fontSize: 12, color: colors.muted }}>
            Staff members will receive an invitation to access facial recognition check-in for your events only.
          </Text>
        </View>

        {/* Active Staff List */}
        <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Staff Members ({staffMembers.length})
          </Text>

          {staffMembers.length === 0 ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 24, alignItems: "center" }}>
              <IconSymbol name="person.slash.fill" size={40} color={colors.muted} />
              <Text style={{ fontSize: 14, color: colors.muted, marginTop: 12, textAlign: "center" }}>
                No staff members invited yet
              </Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={staffMembers}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: index < staffMembers.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.primary + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSymbol name="person.fill" size={20} color={colors.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                      {item.email}
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 6,
                      backgroundColor: getStatusColor(item.status) + "20",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: getStatusColor(item.status),
                        textTransform: "capitalize",
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleRevokeAccess(item.id)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      padding: 8,
                    })}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>

        {/* Permissions Info */}
        <View style={{ marginHorizontal: 16, backgroundColor: colors.primary + "10", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.primary + "30" }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground, marginBottom: 6 }}>
                Staff Permissions
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
                Staff members can only access events they have been invited to. They cannot view financial data, host settings, or other private information.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

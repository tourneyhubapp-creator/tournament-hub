import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  status: "pending" | "accepted" | "revoked";
  invitedAt: string;
}

interface Tournament {
  id: number;
  name: string;
  date: string;
  location: string;
  teams: number;
  status: "draft" | "open" | "in_progress" | "completed";
}

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: "Spring Classic 7v7",
    date: "Apr 12-13, 2026",
    location: "Dallas, TX",
    teams: 24,
    status: "in_progress",
  },
  {
    id: 2,
    name: "Gulf Coast Showcase",
    date: "May 3-4, 2026",
    location: "Houston, TX",
    teams: 18,
    status: "open",
  },
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    status: "accepted",
    invitedAt: "Mar 20, 2026",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "pending",
    invitedAt: "Mar 24, 2026",
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@example.com",
    status: "revoked",
    invitedAt: "Mar 15, 2026",
  },
];

export default function HostDashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(MOCK_TOURNAMENTS[0]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);

  const handleRevokeAccess = (memberId: number) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: "revoked" as const } : member
      )
    );
  };

  const handleSendInvitation = () => {
    if (searchQuery.trim()) {
      const newMember: TeamMember = {
        id: teamMembers.length + 1,
        name: searchQuery,
        email: `${searchQuery.toLowerCase().replace(" ", ".")}@example.com`,
        status: "pending",
        invitedAt: new Date().toLocaleDateString(),
      };
      setTeamMembers([...teamMembers, newMember]);
      setSearchQuery("");
      setShowInviteModal(false);
    }
  };

  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#333" }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF", marginBottom: 4 }}>
            Host Dashboard
          </Text>
          <Text style={{ fontSize: 13, color: "#AAA" }}>
            Manage tournaments and team access
          </Text>
        </View>

        {/* Tournament Selection */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#333" }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
            Active Tournament
          </Text>
          <FlatList
            data={MOCK_TOURNAMENTS}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedTournament(item)}
                style={{
                  backgroundColor: selectedTournament?.id === item.id ? "#39FF14" : "#1a1a1a",
                  borderWidth: selectedTournament?.id === item.id ? 0 : 1,
                  borderColor: "#333",
                  borderRadius: 12,
                  padding: 12,
                  marginRight: 10,
                  minWidth: 160,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: selectedTournament?.id === item.id ? "#000" : "#FFF",
                    marginBottom: 4,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: selectedTournament?.id === item.id ? "rgba(0, 0, 0, 0.7)" : "#AAA",
                  }}
                >
                  {item.teams} / {item.teams + 8} teams
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Facial Recognition Check-In Button */}
        {selectedTournament && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#333" }}>
            <Pressable
              onPress={() => router.push({ pathname: "/facial-recognition-checkin", params: { tournamentId: selectedTournament.id } })}
              style={{
                backgroundColor: "#39FF14",
                borderRadius: 12,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconSymbol name="face.smiling.fill" size={20} color="#000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 2 }}>
                  Facial Recognition Check-In
                </Text>
                <Text style={{ fontSize: 11, color: "rgba(0, 0, 0, 0.7)" }}>
                  Fast athlete verification
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#000" />
            </Pressable>
          </View>
        )}

        {/* Invite Team Members Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Team Members
            </Text>
            <Pressable
              onPress={() => setShowInviteModal(true)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: "#39FF14",
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#000" }}>
                + Invite
              </Text>
            </Pressable>
          </View>

          {/* Team Members List */}
          <View style={{ gap: 10 }}>
            {teamMembers.map((member) => (
              <View
                key={member.id}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#333",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#39FF14" }}>
                    {member.name.charAt(0)}
                  </Text>
                </View>

                {/* Member Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFF", marginBottom: 2 }}>
                    {member.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#AAA" }}>
                    {member.email}
                  </Text>
                </View>

                {/* Status Badge */}
                <View
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    backgroundColor:
                      member.status === "accepted"
                        ? "rgba(57, 255, 20, 0.1)"
                        : member.status === "pending"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(255, 107, 107, 0.1)",
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color:
                        member.status === "accepted"
                          ? "#39FF14"
                          : member.status === "pending"
                            ? "#FFC107"
                            : "#FF6B6B",
                    }}
                  >
                    {member.status === "accepted"
                      ? "✓ Accepted"
                      : member.status === "pending"
                        ? "⏳ Pending"
                        : "✕ Revoked"}
                  </Text>
                </View>

                {/* Revoke Button (only for accepted members) */}
                {member.status === "accepted" && (
                  <Pressable
                    onPress={() => handleRevokeAccess(member.id)}
                    style={{ paddingHorizontal: 8 }}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color="#FF6B6B" />
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View
            style={{
              backgroundColor: "rgba(57, 255, 20, 0.05)",
              borderWidth: 1,
              borderColor: "rgba(57, 255, 20, 0.2)",
              borderRadius: 12,
              padding: 12,
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 12, color: "#39FF14", fontWeight: "600", marginBottom: 6 }}>
              ℹ️ Facial Recognition Access
            </Text>
            <Text style={{ fontSize: 11, color: "#AAA", lineHeight: 16 }}>
              Invited team members gain access to the Facial Recognition Check-In tool for this tournament. They can verify athlete credentials at check-in.
            </Text>
          </View>
        </View>

        {/* Invite Modal */}
        {showInviteModal && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              justifyContent: "flex-end",
              zIndex: 1000,
            }}
          >
            <View
              style={{
                backgroundColor: "#1a1a1a",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                gap: 16,
              }}
            >
              {/* Header */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFF" }}>
                  Invite Team Member
                </Text>
                <Pressable onPress={() => setShowInviteModal(false)}>
                  <IconSymbol name="xmark.circle.fill" size={24} color="#666" />
                </Pressable>
              </View>

              {/* Search Input */}
              <View
                style={{
                  backgroundColor: "#0a0a0a",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconSymbol name="magnifyingglass" size={18} color="#666" />
                <TextInput
                  placeholder="Search by name or email..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{
                    flex: 1,
                    color: "#FFF",
                    fontSize: 14,
                  }}
                />
              </View>

              {/* Send Button */}
              <Pressable
                onPress={handleSendInvitation}
                disabled={!searchQuery.trim()}
                style={{
                  paddingVertical: 12,
                  backgroundColor: searchQuery.trim() ? "#39FF14" : "#39FF1466",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#000" }}>
                  Send Invitation
                </Text>
              </Pressable>

              {/* Cancel Button */}
              <Pressable
                onPress={() => setShowInviteModal(false)}
                style={{
                  paddingVertical: 12,
                  backgroundColor: "#333",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF" }}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

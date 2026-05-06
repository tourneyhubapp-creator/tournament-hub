import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface InvitedEvent {
  id: number;
  name: string;
  host: string;
  date: string;
  location: string;
  status: "upcoming" | "in-progress" | "completed";
  checkInStatus: "pending" | "checked-in" | "completed";
  teamsCount: number;
  playersCount: number;
}

export default function StaffHomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [invitedEvents, setInvitedEvents] = useState<InvitedEvent[]>([
    {
      id: 1,
      name: "Spring Classic 7v7",
      host: "Coach Rivera",
      date: "Apr 12-13, 2026",
      location: "Dallas, TX",
      status: "upcoming",
      checkInStatus: "pending",
      teamsCount: 24,
      playersCount: 168,
    },
    {
      id: 2,
      name: "Gulf Coast Showcase",
      host: "Coach Martinez",
      date: "May 3-5, 2026",
      location: "Houston, TX",
      status: "upcoming",
      checkInStatus: "pending",
      teamsCount: 18,
      playersCount: 126,
    },
    {
      id: 3,
      name: "Summer Elite Cup",
      host: "Coach Thompson",
      date: "Jun 15-17, 2026",
      location: "San Antonio, TX",
      status: "upcoming",
      checkInStatus: "pending",
      teamsCount: 32,
      playersCount: 224,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return colors.primary;
      case "in-progress":
        return colors.warning;
      case "completed":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const renderEventItem = ({ item }: { item: InvitedEvent }) => (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        marginBottom: 12,
        paddingHorizontal: 16,
      })}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: getStatusColor(item.status),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>
              Hosted by {item.host}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              📍 {item.location}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: getStatusColor(item.status) + "20",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "600", color: getStatusColor(item.status) }}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <View>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>
                Teams
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
                {item.teamsCount}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>
                Players
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
                {item.playersCount}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>
                Date
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
                {item.date.split(",")[0]}
              </Text>
            </View>
          </View>

          {/* Check-In Status */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
            <IconSymbol 
              name={item.checkInStatus === "checked-in" ? "checkmark.circle.fill" : "circle"} 
              size={16} 
              color={item.checkInStatus === "checked-in" ? colors.success : colors.muted} 
            />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              Check-In: {item.checkInStatus === "pending" ? "Not Started" : item.checkInStatus === "checked-in" ? "In Progress" : "Completed"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Invited Events" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Welcome Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
            Welcome, Staff Member
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>
            You have access to {invitedEvents.length} events. Use Facial Recognition to check in teams and players.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: colors.primary + "15", borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
                Upcoming Events
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "700", color: colors.primary }}>
                {invitedEvents.filter(e => e.status === "upcoming").length}
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.success + "15", borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
                Total Teams
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "700", color: colors.success }}>
                {invitedEvents.reduce((sum, e) => sum + e.teamsCount, 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Events List */}
        <View style={{ paddingVertical: 16 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
              Your Assigned Events
            </Text>
          </View>

          {invitedEvents.length === 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 24, alignItems: "center" }}>
                <IconSymbol name="calendar" size={32} color={colors.muted} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 12 }}>
                  No Events Yet
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4, textAlign: "center" }}>
                  Wait for a tournament host to invite you to events
                </Text>
              </View>
            </View>
          ) : (
            <FlatList
              data={invitedEvents}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Facial Recognition CTA */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            })}
          >
            <IconSymbol name="camera.fill" size={20} color="white" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              Open Facial Recognition Check-In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

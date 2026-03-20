import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, Animated } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

interface StatHighlight {
  icon: any;
  label: string;
  value: string;
  trend?: string;
}

export default function PremiumHomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const statHighlights: StatHighlight[] = [
    { icon: "person.fill", label: "Your Rank", value: "#14", trend: "↑ 2 spots" },
    { icon: "trophy.fill", label: "Tournaments", value: "8", trend: "2 this month" },
    { icon: "flame.fill", label: "Hot Streak", value: "3W", trend: "Games" },
  ];

  const upcomingTournaments = [
    {
      id: 1,
      name: "Spring Classic 7v7",
      date: "Apr 12-13",
      location: "Dallas, TX",
      status: "Open",
    },
    {
      id: 2,
      name: "Gulf Coast Showcase",
      date: "May 3-4",
      location: "Houston, TX",
      status: "Open",
    },
  ];

  const topPlayers = [
    { rank: 1, name: "Marcus Johnson", stat: "2,840 Pass Yards" },
    { rank: 2, name: "Jake Williams", stat: "2,650 Pass Yards" },
    { rank: 3, name: "Tyler Brown", stat: "2,520 Pass Yards" },
  ];

  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Hero Section with Branding */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 16,
            paddingVertical: 24,
            backgroundColor: "rgba(57, 255, 20, 0.05)",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(57, 255, 20, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#39FF14",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="flame.fill" size={28} color="#000" />
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#39FF14" }}>
                Mississippi Heat
              </Text>
              <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                7on7 Football Elite
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 28, fontWeight: "700", color: "#FFF", lineHeight: 36 }}>
            Welcome back, Marcus
          </Text>
          <Text style={{ fontSize: 13, color: "#AAA", marginTop: 8 }}>
            You're ranked #14 nationally. Keep pushing to the top.
          </Text>
        </Animated.View>

        {/* Dynamic Stat Highlights */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Your Stats
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {statHighlights.map((stat, idx) => (
              <View
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: "#1a1a1a",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 16,
                  padding: 14,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#39FF14",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <IconSymbol name={stat.icon} size={18} color="#000" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#39FF14" }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, color: "#AAA", marginTop: 4, textAlign: "center" }}>
                  {stat.label}
                </Text>
                {stat.trend && (
                  <Text style={{ fontSize: 10, color: "#39FF14", marginTop: 4, fontWeight: "600" }}>
                    {stat.trend}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Leaderboards Quick Access */}
        <Pressable
          onPress={() => router.push("/(tabs)/leaderboards-unified")}
          style={({ pressed }) => ({
            marginHorizontal: 16,
            marginBottom: 20,
            backgroundColor: "#39FF14",
            borderRadius: 16,
            padding: 16,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#000" }}>
                View Rankings
              </Text>
              <Text style={{ fontSize: 12, color: "#000", marginTop: 2, opacity: 0.7 }}>
                See top 50 national leaders
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#000" />
          </View>
        </Pressable>

        {/* Upcoming Tournaments */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Upcoming Events
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/tournaments")}>
              <Text style={{ fontSize: 12, color: "#39FF14", fontWeight: "600" }}>See All</Text>
            </Pressable>
          </View>

          {upcomingTournaments.map((tournament) => (
            <Pressable
              key={tournament.id}
              style={({ pressed }) => ({
                backgroundColor: "#1a1a1a",
                borderWidth: 1,
                borderColor: "#333",
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF" }}>
                    {tournament.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>
                    {tournament.date} • {tournament.location}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#39FF14",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginLeft: 12,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#000" }}>
                    {tournament.status}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Top Players Preview */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Top National Players
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/leaderboards-unified")}>
              <Text style={{ fontSize: 12, color: "#39FF14", fontWeight: "600" }}>View All</Text>
            </Pressable>
          </View>

          {topPlayers.map((player) => (
            <View
              key={player.rank}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: player.rank === 1 ? "#FFD700" : player.rank === 2 ? "#C0C0C0" : "#CD7F32",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontWeight: "700", color: "#000", fontSize: 12 }}>
                  {player.rank}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFF" }}>
                  {player.name}
                </Text>
                <Text style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>
                  {player.stat}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#666" />
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: "#1a1a1a",
              borderWidth: 2,
              borderColor: "#39FF14",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#39FF14" }}>
              Upgrade to Premium
            </Text>
            <Text style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>
              Unlock advanced analytics & coaching tools
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, Animated, Image } from "react-native";
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

export default function HomeScreen() {
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
    { rank: 1, name: "Dakota Gooden", stat: "2,840 Pass Yards" },
    { rank: 2, name: "Jake Williams", stat: "2,650 Pass Yards" },
    { rank: 3, name: "Tyler Brown", stat: "2,520 Pass Yards" },
  ];

  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Hero Section with Official Logo */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 16,
            paddingVertical: 24,
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(239, 68, 68, 0.2)",
            alignItems: "center",
          }}
        >
          {/* Official TourneyHub Logo - Full Width */}
          <Image
            source={require("@/assets/images/logo-full.png")}
            style={{
              width: "100%",
              height: 120,
              marginBottom: 24,
            }}
            resizeMode="contain"
          />

          <Text style={{ fontSize: 24, fontWeight: "700", color: "#FFF", lineHeight: 32, textAlign: "center" }}>
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
                backgroundColor: "#EF4444",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <IconSymbol name={stat.icon} size={18} color="#FFF" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#EF4444" }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, color: "#AAA", marginTop: 4, textAlign: "center" }}>
                  {stat.label}
                </Text>
                {stat.trend && (
                  <Text style={{ fontSize: 10, color: "#EF4444", marginTop: 4, fontWeight: "600" }}>
                    {stat.trend}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Leaderboards Quick Access */}
        <Pressable
          onPress={() => router.push("./leaderboards-unified")}
          style={({ pressed }) => ({
            marginHorizontal: 16,
            marginVertical: 12,
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: "#EF4444",
            borderRadius: 16,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFF", marginBottom: 4 }}>
            View Rankings
          </Text>
          <Text style={{ fontSize: 13, color: "#000", opacity: 0.8 }}>
            See top 50 national leaders
          </Text>
        </Pressable>

        {/* Upcoming Events */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Upcoming Events
            </Text>
            <Pressable onPress={() => router.push("./tournaments")}>
              <Text style={{ fontSize: 13, color: "#EF4444", fontWeight: "600" }}>
                See All
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: 10 }}>
            {upcomingTournaments.map((tournament) => (
              <View
                key={tournament.id}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFF", marginBottom: 4 }}>
                    {tournament.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#AAA" }}>
                    {tournament.date} • {tournament.location}
                  </Text>
                </View>
                <Pressable
                  style={{
                    backgroundColor: "#EF4444",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFF" }}>
                    {tournament.status}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>


        {/* Top National Players */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Top National Players
            </Text>
            <Pressable onPress={() => router.push("./leaderboards-unified")}>
              <Text style={{ fontSize: 13, color: "#EF4444", fontWeight: "600" }}>
                View All
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: 10 }}>
            {topPlayers.map((player) => (
              <Pressable
                key={player.rank}
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
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: player.rank === 1 ? "#FFD700" : player.rank === 2 ? "#C0C0C0" : "#CD7F32",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontWeight: "700", color: "#000", fontSize: 14 }}>
                    {player.rank}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF" }}>
                    {player.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>
                    {player.stat}
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#666" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

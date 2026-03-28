import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTournament } from "@/lib/tournament-context";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { activeRole } = useTournament();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  const tabBarStyle = {
    paddingTop: 8,
    paddingBottom: bottomPadding,
    height: tabBarHeight,
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
  };

  if (activeRole === "coach") {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} /> }} />
        <Tabs.Screen name="host-tournaments" options={{ title: "Tournaments", tabBarIcon: ({ color }) => <IconSymbol size={26} name="trophy.fill" color={color} /> }} />
        <Tabs.Screen name="leaderboards-unified" options={{ title: "Leaderboards", tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.number" color={color} /> }} />
        <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} /> }} />
        {/* Hide all other tabs */}
        <Tabs.Screen name="feed" options={{ href: null }} />
        <Tabs.Screen name="rankings" options={{ href: null }} />
        <Tabs.Screen name="tournaments" options={{ href: null }} />
        <Tabs.Screen name="passport" options={{ href: null }} />
        <Tabs.Screen name="leaderboards" options={{ href: null }} />
        <Tabs.Screen name="player-id-card" options={{ href: null }} />
        <Tabs.Screen name="coach-id-card" options={{ href: null }} />
        <Tabs.Screen name="host-teams" options={{ href: null }} />
        <Tabs.Screen name="host-payments" options={{ href: null }} />
        <Tabs.Screen name="admin-dashboard" options={{ href: null }} />
        <Tabs.Screen name="admin-users" options={{ href: null }} />
        <Tabs.Screen name="admin-payments" options={{ href: null }} />
        <Tabs.Screen name="admin-content" options={{ href: null }} />
        <Tabs.Screen name="facial-recognition-checkin" options={{ href: null }} />
        <Tabs.Screen name="team-rankings" options={{ href: null }} />
      </Tabs>
    );
  }

  if (activeRole === "host") {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle,
        }}
      >
        <Tabs.Screen name="leaderboards-unified" options={{ title: "Leaderboards", tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.number" color={color} /> }} />
        <Tabs.Screen name="host-tournaments" options={{ title: "Tournaments", tabBarIcon: ({ color }) => <IconSymbol size={26} name="trophy.fill" color={color} /> }} />
        <Tabs.Screen name="team-rankings" options={{ title: "Teams", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.2.fill" color={color} /> }} />
        <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} /> }} />
        {/* Hide all other tabs */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="feed" options={{ href: null }} />
        <Tabs.Screen name="rankings" options={{ href: null }} />
        <Tabs.Screen name="tournaments" options={{ href: null }} />
        <Tabs.Screen name="passport" options={{ href: null }} />
      <Tabs.Screen name="leaderboards" options={{ href: null }} />
      <Tabs.Screen name="player-id-card" options={{ href: null }} />
        <Tabs.Screen name="coach-id-card" options={{ href: null }} />
        <Tabs.Screen name="host-teams" options={{ href: null }} />
        <Tabs.Screen name="host-payments" options={{ href: null }} />
        <Tabs.Screen name="admin-dashboard" options={{ href: null }} />
        <Tabs.Screen name="admin-users" options={{ href: null }} />
        <Tabs.Screen name="admin-payments" options={{ href: null }} />
        <Tabs.Screen name="admin-content" options={{ href: null }} />
        <Tabs.Screen name="facial-recognition-checkin" options={{ href: null }} />
      </Tabs>
    );
  }

  if (activeRole === "admin") {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Overview", tabBarIcon: ({ color }) => <IconSymbol size={26} name="chart.bar.fill" color={color} /> }} />
        <Tabs.Screen name="admin-users" options={{ title: "Users", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.2.fill" color={color} /> }} />
        <Tabs.Screen name="admin-payments" options={{ title: "Payments", tabBarIcon: ({ color }) => <IconSymbol size={26} name="dollarsign.circle.fill" color={color} /> }} />
        <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} /> }} />
        {/* Hide all other tabs */}
        <Tabs.Screen name="feed" options={{ href: null }} />
        <Tabs.Screen name="rankings" options={{ href: null }} />
        <Tabs.Screen name="tournaments" options={{ href: null }} />
        <Tabs.Screen name="passport" options={{ href: null }} />
        <Tabs.Screen name="leaderboards" options={{ href: null }} />
        <Tabs.Screen name="player-id-card" options={{ href: null }} />
        <Tabs.Screen name="coach-id-card" options={{ href: null }} />
        <Tabs.Screen name="host-tournaments" options={{ href: null }} />
        <Tabs.Screen name="host-teams" options={{ href: null }} />
        <Tabs.Screen name="host-payments" options={{ href: null }} />
        <Tabs.Screen name="admin-content" options={{ href: null }} />
        <Tabs.Screen name="facial-recognition-checkin" options={{ href: null }} />
        <Tabs.Screen name="team-rankings" options={{ href: null }} />
      </Tabs>
    );
  }

  // Default: Athlete - SIMPLIFIED to core tabs only
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} /> }} />
      <Tabs.Screen name="tournaments" options={{ title: "Tournaments", tabBarIcon: ({ color }) => <IconSymbol size={26} name="trophy.fill" color={color} /> }} />
      <Tabs.Screen name="team-rankings" options={{ title: "Teams", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.2.fill" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} /> }} />
      {/* Hide all other tabs */}
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="rankings" options={{ href: null }} />
      <Tabs.Screen name="passport" options={{ href: null }} />
      <Tabs.Screen name="player-id-card" options={{ href: null }} />
      <Tabs.Screen name="coach-id-card" options={{ href: null }} />
      <Tabs.Screen name="leaderboards" options={{ href: null }} />
      <Tabs.Screen name="leaderboards-unified" options={{ href: null }} />
      <Tabs.Screen name="host-tournaments" options={{ href: null }} />
      <Tabs.Screen name="host-teams" options={{ href: null }} />
      <Tabs.Screen name="host-payments" options={{ href: null }} />
      <Tabs.Screen name="admin-dashboard" options={{ href: null }} />
      <Tabs.Screen name="admin-users" options={{ href: null }} />
      <Tabs.Screen name="admin-payments" options={{ href: null }} />
      <Tabs.Screen name="admin-content" options={{ href: null }} />
      <Tabs.Screen name="facial-recognition-checkin" options={{ href: null }} />
    </Tabs>
  );
}

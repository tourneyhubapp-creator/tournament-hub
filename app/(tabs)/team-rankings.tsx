import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { TeamRankingsCalculator, MOCK_TOURNAMENTS, TeamRankingData } from "@/lib/team-rankings";
import { useState, useMemo } from "react";
import { useColors } from "@/hooks/use-colors";

export default function TeamRankingsScreen() {
  const colors = useColors();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  // Calculate rankings from mock tournament data
  const calculator = useMemo(
    () => new TeamRankingsCalculator(MOCK_TOURNAMENTS),
    []
  );

  const allRankings = useMemo(() => calculator.getTeamRankings(), [calculator]);

  // Filter rankings based on selected tier
  const displayedRankings = useMemo(() => {
    if (selectedTier === null) return allRankings;
    return allRankings.filter(team => team.tournamentTier === selectedTier);
  }, [allRankings, selectedTier]);

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1:
        return "Tier 1 (OT7, Battle 7's, The Sevens)";
      case 2:
        return "Tier 2 (Pylon 7v7, ShockDoctor, Prep Redzone)";
      default:
        return "Tier 3 (All Others)";
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      default:
        return "#CD7F32"; // Bronze
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">
              Team Rankings
            </Text>
            <Text className="text-sm text-muted">
              2026 Season Rankings (Jan 1 - Mar 28)
            </Text>
          </View>

          {/* Tier Filter Buttons */}
          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={() => setSelectedTier(null)}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedTier === null ? colors.primary : colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedTier === null
                    ? "text-background"
                    : "text-foreground"
                }`}
              >
                All Teams
              </Text>
            </Pressable>

            {[1, 2, 3].map((tier) => (
              <Pressable
                key={tier}
                onPress={() => setSelectedTier(tier)}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      selectedTier === tier ? getTierColor(tier) : colors.surface,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selectedTier === tier
                      ? "text-black"
                      : "text-foreground"
                  }`}
                >
                  Tier {tier}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Rankings Table Header */}
          <View className="bg-surface rounded-lg p-3 mb-2">
            <View className="flex-row gap-2 justify-between">
              <Text className="text-xs font-bold text-muted flex-1">Rank</Text>
              <Text className="text-xs font-bold text-muted flex-4">Team</Text>
              <Text className="text-xs font-bold text-muted flex-2">Points</Text>
              <Text className="text-xs font-bold text-muted flex-2">W-L-T</Text>
            </View>
          </View>

          {/* Rankings List */}
          {displayedRankings.length > 0 ? (
            displayedRankings.map((team, index) => (
              <View
                key={team.teamId}
                className="bg-surface rounded-lg p-3 border border-border"
              >
                <View className="flex-row gap-2 items-center justify-between">
                  {/* Rank */}
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: getTierColor(team.tournamentTier),
                    }}
                  >
                    <Text className="text-xs font-bold text-black">
                      {team.rank}
                    </Text>
                  </View>

                  {/* Team Name */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {team.teamName}
                    </Text>
                    <Text className="text-xs text-muted">
                      {getTierLabel(team.tournamentTier)}
                    </Text>
                  </View>

                  {/* Points */}
                  <View className="items-center">
                    <Text className="text-sm font-bold text-primary">
                      {team.totalRankingPoints}
                    </Text>
                    <Text className="text-xs text-muted">pts</Text>
                  </View>

                  {/* Record */}
                  <View className="items-center">
                    <Text className="text-sm font-semibold text-foreground">
                      {team.wins}-{team.losses}-{team.ties}
                    </Text>
                    <Text className="text-xs text-muted">
                      {team.winPercentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>

                {/* Additional Stats */}
                <View className="flex-row gap-4 mt-2 pt-2 border-t border-border">
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Games</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {team.gamesPlayed}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Points For</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {team.pointsFor}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Point Diff</Text>
                    <Text
                      className={`text-sm font-semibold ${
                        team.pointDifferential > 0
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {team.pointDifferential > 0 ? "+" : ""}
                      {team.pointDifferential}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-muted">No teams found for this tier</Text>
            </View>
          )}

          {/* Ranking Methodology */}
          <View className="bg-surface rounded-lg p-4 mt-6 mb-4">
            <Text className="text-sm font-bold text-foreground mb-2">
              Ranking Methodology
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              Rankings are calculated based on wins (10 pts each), ties (5 pts
              each), tournament tier multiplier (Tier 1: 3x, Tier 2: 2x, Tier
              3: 1x), win percentage bonus, and point differential.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

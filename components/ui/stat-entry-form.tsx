import React from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface StatEntryFormProps {
  position: "QB" | "Receiver" | "Defense" | "Team";
  onSubmit: (stats: Record<string, number>) => void;
  onCancel: () => void;
}

export function StatEntryForm({ position, onSubmit, onCancel }: StatEntryFormProps) {
  const colors = useColors();
  const [stats, setStats] = React.useState<Record<string, number>>({});

  const getFieldsForPosition = () => {
    switch (position) {
      case "QB":
        return [
          { key: "passingYards", label: "Passing Yards", icon: "📊" },
          { key: "passingTouchdowns", label: "Passing TDs", icon: "🎯" },
          { key: "interceptions", label: "Interceptions", icon: "🚫" },
          { key: "completions", label: "Completions", icon: "✓" },
          { key: "attempts", label: "Attempts", icon: "📈" },
        ];
      case "Receiver":
        return [
          { key: "receptions", label: "Receptions", icon: "🤚" },
          { key: "receivingYards", label: "Receiving Yards", icon: "📊" },
          { key: "receivingTouchdowns", label: "Receiving TDs", icon: "🎯" },
        ];
      case "Defense":
        return [
          { key: "tackles", label: "Tackles", icon: "🛡️" },
          { key: "passBreakups", label: "Pass Breakups", icon: "🚫" },
          { key: "defensiveInterceptions", label: "Interceptions", icon: "🎯" },
        ];
      case "Team":
        return [
          { key: "pointsScored", label: "Points Scored", icon: "🏈" },
          { key: "pointsAllowed", label: "Points Allowed", icon: "⚠️" },
        ];
    }
  };

  const fields = getFieldsForPosition();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
        Enter {position} Stats
      </Text>

      {fields.map((field) => (
        <View key={field.key} style={{ gap: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted }}>
            {field.icon} {field.label}
          </Text>
          <TextInput
            placeholder="0"
            keyboardType="number-pad"
            value={String(stats[field.key] ?? "")}
            onChangeText={(val) => setStats({ ...stats, [field.key]: parseInt(val) || 0 })}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: colors.foreground,
              backgroundColor: colors.surface,
            }}
          />
        </View>
      ))}

      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : 1,
            alignItems: "center",
          })}
        >
          <Text style={{ color: colors.foreground, fontWeight: "600" }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => onSubmit(stats)}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
            alignItems: "center",
          })}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Submit Stats</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

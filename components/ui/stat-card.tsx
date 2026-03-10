import { Text, View } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { SymbolViewProps } from "expo-symbols";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: SymbolViewProps["name"];
  color?: string;
  subtitle?: string;
}

export function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  const colors = useColors();
  return (
    <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
      {icon && (
        <IconSymbol name={icon} size={20} color={color ?? colors.primary} />
      )}
      <Text className="text-2xl font-bold text-foreground mt-1">{value}</Text>
      <Text className="text-xs text-muted mt-0.5">{label}</Text>
      {subtitle && <Text className="text-xs text-muted">{subtitle}</Text>}
    </View>
  );
}

import { Text, View } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { SymbolViewProps } from "expo-symbols";

interface EmptyStateProps {
  icon: SymbolViewProps["name"];
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <IconSymbol name={icon} size={48} color={colors.muted} />
      <Text className="text-lg font-semibold text-foreground mt-4 text-center">{title}</Text>
      {description && (
        <Text className="text-sm text-muted text-center mt-2 leading-5">{description}</Text>
      )}
    </View>
  );
}

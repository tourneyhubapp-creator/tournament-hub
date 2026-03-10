import { Text, View, Pressable } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: SymbolViewProps["name"];
  onRightPress?: () => void;
}

export function ScreenHeader({ title, subtitle, showBack, rightIcon, onRightPress }: ScreenHeaderProps) {
  const colors = useColors();
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
      <View className="flex-row items-center gap-3 flex-1">
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </Pressable>
        )}
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{title}</Text>
          {subtitle && <Text className="text-xs text-muted">{subtitle}</Text>}
        </View>
      </View>
      {rightIcon && onRightPress && (
        <Pressable
          onPress={onRightPress}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <IconSymbol name={rightIcon} size={24} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

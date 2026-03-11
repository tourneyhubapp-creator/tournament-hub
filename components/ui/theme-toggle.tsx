import { Pressable, View } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { useTheme } from "@/lib/theme-provider";
import { useColors } from "@/hooks/use-colors";

export function ThemeToggle() {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = useColors();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.border,
      })}
    >
      <IconSymbol
        name={colorScheme === "light" ? "moon.fill" : "sun.max.fill"}
        size={20}
        color={colors.primary}
      />
    </Pressable>
  );
}

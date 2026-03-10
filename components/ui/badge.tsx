import { Text, View } from "react-native";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "error" | "muted" | "accent";
  size?: "sm" | "md";
}

export function Badge({ label, variant = "primary", size = "sm" }: BadgeProps) {
  const bgMap = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    muted: "bg-surface",
    accent: "bg-accent",
  };
  const textMap = {
    primary: "text-white",
    success: "text-white",
    warning: "text-white",
    error: "text-white",
    muted: "text-muted",
    accent: "text-white",
  };
  return (
    <View className={cn("rounded-full px-2 py-0.5", bgMap[variant], size === "md" && "px-3 py-1")}>
      <Text className={cn("font-semibold", textMap[variant], size === "sm" ? "text-xs" : "text-sm")}>
        {label}
      </Text>
    </View>
  );
}

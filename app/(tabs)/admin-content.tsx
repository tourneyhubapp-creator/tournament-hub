import { FlatList, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";

type ContentStatus = "pending" | "approved" | "removed";
type ContentType = "post" | "video" | "comment";

const MOCK_CONTENT = [
  { id: 1, user: "Marcus Johnson", type: "video" as ContentType, caption: "Big W at the Spring Classic! 3 TDs and a game-winning drive 🏈", reportCount: 2, reportReason: "Inappropriate language", status: "pending" as ContentStatus, time: "2h ago" },
  { id: 2, user: "Unknown User", type: "comment" as ContentType, caption: "This team is trash and shouldn't be allowed in the tournament", reportCount: 5, reportReason: "Harassment", status: "pending" as ContentStatus, time: "4h ago" },
  { id: 3, user: "Team Velocity", type: "post" as ContentType, caption: "Practice highlights from today. Getting ready for Gulf Coast Showcase!", reportCount: 1, reportReason: "Spam", status: "approved" as ContentStatus, time: "1d ago" },
  { id: 4, user: "Anonymous", type: "video" as ContentType, caption: "Check out this play from last weekend", reportCount: 3, reportReason: "Inappropriate content", status: "removed" as ContentStatus, time: "2d ago" },
];

const PENDING = MOCK_CONTENT.filter((c) => c.status === "pending");

export default function AdminContentScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<"queue" | "all">("queue");
  const [content, setContent] = useState(MOCK_CONTENT);

  const handleAction = (id: number, action: "approve" | "remove") => {
    setContent((prev) => prev.map((c) => c.id === id ? { ...c, status: action === "approve" ? "approved" : "removed" } : c));
  };

  const displayData = tab === "queue" ? content.filter((c) => c.status === "pending") : content;

  const typeIcon = { post: "photo.fill" as const, video: "play.fill" as const, comment: "bubble.left.fill" as const };

  return (
    <ScreenContainer>
      <ScreenHeader title="Content Moderation" subtitle="Review flagged content" />

      {/* Stats */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10 }}>
        {[
          { label: "Pending", value: content.filter((c) => c.status === "pending").length, color: colors.warning },
          { label: "Approved", value: content.filter((c) => c.status === "approved").length, color: colors.success },
          { label: "Removed", value: content.filter((c) => c.status === "removed").length, color: colors.error },
        ].map((stat) => (
          <View key={stat.label} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: stat.color }}>{stat.value}</Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Tab Toggle */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        {[{ key: "queue", label: `Review Queue (${content.filter((c) => c.status === "pending").length})` }, { key: "all", label: "All Content" }].map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key as any)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              flex: 1,
              paddingVertical: 10,
              borderRadius: 14,
              backgroundColor: tab === t.key ? colors.primary : colors.surface,
              alignItems: "center",
              borderWidth: 1,
              borderColor: tab === t.key ? colors.primary : colors.border,
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: tab === t.key ? "#FFFFFF" : colors.muted }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={displayData}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
        ListEmptyComponent={<EmptyState icon="checkmark.shield.fill" title="Queue is clear!" description="All content has been reviewed" />}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: item.status === "pending" ? colors.warning + "40" : item.status === "removed" ? colors.error + "30" : colors.border,
          }}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name={typeIcon[item.type]} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.user}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{item.type} · {item.time}</Text>
              </View>
              <Badge
                label={item.status === "pending" ? "Pending" : item.status === "approved" ? "Approved" : "Removed"}
                variant={item.status === "pending" ? "warning" : item.status === "approved" ? "success" : "error"}
              />
            </View>

            {/* Content Preview */}
            <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 18 }}>{item.caption}</Text>
            </View>

            {/* Report Info */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, backgroundColor: colors.error + "10", borderRadius: 10, padding: 10 }}>
              <IconSymbol name="flag.fill" size={14} color={colors.error} />
              <Text style={{ fontSize: 12, color: colors.error, flex: 1 }}>
                {item.reportCount} report{item.reportCount > 1 ? "s" : ""} · {item.reportReason}
              </Text>
            </View>

            {/* Actions */}
            {item.status === "pending" && (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => handleAction(item.id, "approve")}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                    backgroundColor: colors.success,
                    borderRadius: 12,
                    paddingVertical: 11,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  })}
                >
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#FFFFFF" />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFFFFF" }}>Approve</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleAction(item.id, "remove")}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                    backgroundColor: colors.error + "15",
                    borderRadius: 12,
                    paddingVertical: 11,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    borderWidth: 1,
                    borderColor: colors.error + "30",
                  })}
                >
                  <IconSymbol name="trash.fill" size={16} color={colors.error} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.error }}>Remove</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
    </ScreenContainer>
  );
}

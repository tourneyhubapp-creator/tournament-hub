import { FlatList, Text, View, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Badge } from "@/components/ui/badge";
import { useColors } from "@/hooks/use-colors";

const MOCK_POSTS = [
  { id: 1, user: "Marcus Johnson", handle: "@mjohnson_qb", time: "2h ago", caption: "Big W at the Spring Classic! 3 TDs and a game-winning drive 🏈", likes: 142, comments: 18, isTopPlay: true, mediaType: "video" },
  { id: 2, user: "Team Velocity 16U", handle: "@teamvelocity", time: "4h ago", caption: "Practice highlights from today. Getting ready for Gulf Coast Showcase!", likes: 87, comments: 9, isTopPlay: false, mediaType: "video" },
  { id: 3, user: "DeShawn Williams", handle: "@deshawn_wr", time: "1d ago", caption: "Ranked #8 nationally after this weekend's performance 🔥", likes: 231, comments: 34, isTopPlay: true, mediaType: "photo" },
  { id: 4, user: "Coach Rivera", handle: "@coach_rivera", time: "1d ago", caption: "Proud of our boys. 5-0 in pool play. Bracket starts tomorrow!", likes: 56, comments: 7, isTopPlay: false, mediaType: "photo" },
];

const TOP_PLAYS = MOCK_POSTS.filter((p) => p.isTopPlay);

function PostCard({ item }: { item: typeof MOCK_POSTS[0] }) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes);

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
      {/* User Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" }}>
          <IconSymbol name="person.crop.circle.fill" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{item.user}</Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>{item.handle} · {item.time}</Text>
        </View>
        {item.isTopPlay && <Badge label="Top Play" variant="accent" />}
      </View>

      {/* Media Placeholder */}
      <View style={{ height: 200, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <IconSymbol name={item.mediaType === "video" ? "play.fill" : "photo.fill"} size={40} color={colors.primary} />
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>{item.mediaType === "video" ? "Video Highlight" : "Photo"}</Text>
      </View>

      {/* Caption */}
      <View style={{ padding: 14 }}>
        <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 19 }}>{item.caption}</Text>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 14, gap: 20 }}>
        <Pressable
          onPress={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, flexDirection: "row", alignItems: "center", gap: 6 })}
        >
          <IconSymbol name={liked ? "heart.fill" : "heart"} size={20} color={liked ? colors.error : colors.muted} />
          <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "600" }}>{likes}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, flexDirection: "row", alignItems: "center", gap: 6 })}>
          <IconSymbol name="bubble.left.fill" size={20} color={colors.muted} />
          <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "600" }}>{item.comments}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, flexDirection: "row", alignItems: "center", gap: 6 })}>
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<"feed" | "top_plays">("feed");

  return (
    <ScreenContainer>
      <ScreenHeader title="Highlights" subtitle="Top plays & community" />

      {/* Tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {[{ key: "feed", label: "Feed" }, { key: "top_plays", label: "Top Plays 🔥" }].map((t) => (
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
            <Text style={{ fontSize: 14, fontWeight: "700", color: tab === t.key ? "#FFFFFF" : colors.muted }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={tab === "top_plays" ? TOP_PLAYS : MOCK_POSTS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard item={item} />}
        ListHeaderComponent={
          tab === "top_plays" ? (
            <View style={{ backgroundColor: colors.accent + "15", borderRadius: 16, padding: 14, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <IconSymbol name="flame.fill" size={24} color={colors.accent} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>Top Plays This Week</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Best highlights voted by the community</Text>
              </View>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

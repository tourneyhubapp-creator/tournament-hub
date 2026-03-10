import { ScrollView, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Badge } from "@/components/ui/badge";
import { useColors } from "@/hooks/use-colors";

type PassportStatus = "none" | "pending" | "approved" | "rejected";

const MOCK_PASSPORT = {
  status: "approved" as PassportStatus,
  playerId: "TH-2026-00847",
  name: "Marcus Johnson",
  position: "QB",
  graduationYear: 2027,
  teamName: "Team Velocity 16U",
  expiresAt: "Dec 31, 2026",
  qrCode: "TH-2026-00847-QR",
};

const DOCUMENTS = [
  { type: "birth_certificate", label: "Birth Certificate", uploaded: true, verified: true },
  { type: "state_id", label: "State ID / School ID", uploaded: true, verified: true },
  { type: "report_card", label: "Report Card / Transcript", uploaded: true, verified: false },
  { type: "headshot", label: "Player Headshot", uploaded: false, verified: false },
];

export default function PassportScreen() {
  const colors = useColors();
  const [passport] = useState(MOCK_PASSPORT);

  return (
    <ScreenContainer>
      <ScreenHeader title="Player Passport" subtitle="Your digital player ID" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>

        {/* Passport Card */}
        <View style={{
          backgroundColor: colors.primary,
          borderRadius: 24,
          padding: 24,
          overflow: "hidden",
        }}>
          {/* Background decoration */}
          <View style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.08)" }} />
          <View style={{ position: "absolute", right: 20, bottom: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.05)" }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" }}>Tournament Hub</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 4 }}>Player Passport</Text>
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 10 }}>
              <IconSymbol name="checkmark.seal.fill" size={24} color="#4ADE80" />
            </View>
          </View>

          {/* Player Info */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="person.crop.circle.fill" size={40} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>{passport.name}</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 2 }}>{passport.position} · Class of {passport.graduationYear}</Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>{passport.teamName}</Text>
            </View>
          </View>

          {/* Player ID */}
          <View style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Player ID</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginTop: 2, fontFamily: "monospace" }}>{passport.playerId}</Text>
            </View>
            <View style={{ width: 56, height: 56, backgroundColor: "#FFFFFF", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="qrcode" size={36} color={colors.primary} />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Valid through</Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "600" }}>{passport.expiresAt}</Text>
          </View>
        </View>

        {/* Status Banner */}
        {passport.status === "approved" && (
          <View style={{ backgroundColor: colors.success + "15", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: colors.success + "30" }}>
            <IconSymbol name="checkmark.circle.fill" size={22} color={colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>Passport Verified</Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>Your player ID has been approved and is active</Text>
            </View>
          </View>
        )}

        {/* Documents */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>Required Documents</Text>
          {DOCUMENTS.map((doc) => (
            <View
              key={doc.type}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 14,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: doc.verified ? colors.success + "15" : doc.uploaded ? colors.warning + "15" : colors.border,
                alignItems: "center", justifyContent: "center"
              }}>
                <IconSymbol
                  name={doc.verified ? "checkmark.circle.fill" : doc.uploaded ? "clock.fill" : "plus.circle.fill"}
                  size={20}
                  color={doc.verified ? colors.success : doc.uploaded ? colors.warning : colors.muted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{doc.label}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  {doc.verified ? "Verified" : doc.uploaded ? "Under review" : "Not uploaded"}
                </Text>
              </View>
              {!doc.uploaded && (
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                  })}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>Upload</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* Scan QR */}
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            borderWidth: 1,
            borderColor: colors.border,
          })}
        >
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
            <IconSymbol name="qrcode.viewfinder" size={26} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>Scan Player Passport</Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>Verify another player's passport at check-in</Text>
          </View>
          <IconSymbol name="chevron.right" size={18} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

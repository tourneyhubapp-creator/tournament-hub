import { View, Text, ScrollView, Pressable, Alert, Modal, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Waiver {
  id: string;
  playerId: string;
  playerName: string;
  tournament: string;
  status: "signed" | "unsigned" | "pending";
  signedDate?: string;
  signedBy?: string;
  parentalConsent?: boolean;
}

export default function WaiverManagementScreen() {
  const colors = useColors();
  const [waivers, setWaivers] = useState<Waiver[]>([
    {
      id: "1",
      playerId: "TH-001",
      playerName: "Marcus Johnson",
      tournament: "Spring Classic 7v7",
      status: "signed",
      signedDate: new Date().toLocaleDateString(),
      signedBy: "Marcus Johnson",
      parentalConsent: true,
    },
    {
      id: "2",
      playerId: "TH-002",
      playerName: "Jake Williams",
      tournament: "Spring Classic 7v7",
      status: "signed",
      signedDate: new Date().toLocaleDateString(),
      signedBy: "Jake Williams",
      parentalConsent: true,
    },
    {
      id: "3",
      playerId: "TH-003",
      playerName: "Tyler Brown",
      tournament: "Spring Classic 7v7",
      status: "unsigned",
      parentalConsent: false,
    },
    {
      id: "4",
      playerId: "TH-004",
      playerName: "Alex Rodriguez",
      tournament: "Spring Classic 7v7",
      status: "pending",
      parentalConsent: false,
    },
  ]);

  const [showSigningModal, setShowSigningModal] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState<Waiver | null>(null);
  const [playerSignature, setPlayerSignature] = useState("");
  const [parentalConsent, setParentalConsent] = useState(false);

  const signedCount = waivers.filter((w) => w.status === "signed").length;
  const unsignedCount = waivers.filter((w) => w.status === "unsigned").length;
  const pendingCount = waivers.filter((w) => w.status === "pending").length;
  const totalWaivers = waivers.length;
  const signedPercentage = totalWaivers > 0 ? ((signedCount / totalWaivers) * 100).toFixed(0) : "0";

  const handleSignWaiver = (waiver: Waiver) => {
    setSelectedWaiver(waiver);
    setShowSigningModal(true);
  };

  const confirmSignature = () => {
    if (!playerSignature.trim()) {
      Alert.alert("Error", "Please enter your name to sign the waiver");
      return;
    }

    if (selectedWaiver) {
      setWaivers(
        waivers.map((w) =>
          w.id === selectedWaiver.id
            ? {
                ...w,
                status: "signed",
                signedDate: new Date().toLocaleDateString(),
                signedBy: playerSignature,
                parentalConsent,
              }
            : w
        )
      );

      Alert.alert(
        "✓ Waiver Signed",
        `${selectedWaiver.playerName}'s waiver has been signed and recorded.`
      );

      setShowSigningModal(false);
      setPlayerSignature("");
      setParentalConsent(false);
      setSelectedWaiver(null);
    }
  };

  const handleDownloadWaiver = (waiver: Waiver) => {
    Alert.alert("Download", `Waiver for ${waiver.playerName} downloaded successfully`);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Waiver Management</Text>
            <Text className="text-sm text-muted">Tournament participation waivers</Text>
          </View>

          {/* Summary Stats */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Summary</Text>
            <View className="flex-row gap-3">
              {/* Signed */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#22C55E" }}
                  >
                    <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Signed</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{signedPercentage}%</Text>
                <Text className="text-xs text-muted mt-1">
                  {signedCount} of {totalWaivers}
                </Text>
              </View>

              {/* Unsigned */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#F87171" }}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Unsigned</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{unsignedCount}</Text>
                <Text className="text-xs text-muted mt-1">Action required</Text>
              </View>

              {/* Pending */}
              <View
                className="flex-1 bg-surface rounded-xl p-4 border border-border"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#FBBF24" }}
                  >
                    <IconSymbol name="clock.fill" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs text-muted">Pending</Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">{pendingCount}</Text>
                <Text className="text-xs text-muted mt-1">Awaiting approval</Text>
              </View>
            </View>
          </View>

          {/* Waiver List */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-foreground">Waivers</Text>
              <Pressable
                onPress={() => Alert.alert("Bulk Action", "Send signing reminders to unsigned")}
              >
                <Text className="text-sm font-semibold text-red-500">Send Reminders</Text>
              </Pressable>
            </View>

            <FlatList
              scrollEnabled={false}
              data={waivers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  className="bg-surface rounded-xl p-4 border border-border mb-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  {/* Player Info */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{item.playerName}</Text>
                      <Text className="text-xs text-muted mt-1">{item.tournament}</Text>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          item.status === "signed"
                            ? "#22C55E"
                            : item.status === "unsigned"
                              ? "#F87171"
                              : "#FBBF24",
                      }}
                    >
                      <Text className="text-xs font-bold text-white capitalize">
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Status Details */}
                  {item.status === "signed" && (
                    <View className="bg-green-50 rounded-lg p-3 mb-3 border border-green-200">
                      <Text className="text-xs text-green-700">
                        ✓ Signed by {item.signedBy} on {item.signedDate}
                      </Text>
                      {item.parentalConsent && (
                        <Text className="text-xs text-green-700 mt-1">
                          ✓ Parental consent confirmed
                        </Text>
                      )}
                    </View>
                  )}

                  {item.status === "unsigned" && (
                    <View className="bg-red-50 rounded-lg p-3 mb-3 border border-red-200">
                      <Text className="text-xs text-red-700">
                        ⚠ Waiver not yet signed - player cannot participate
                      </Text>
                    </View>
                  )}

                  {item.status === "pending" && (
                    <View className="bg-yellow-50 rounded-lg p-3 mb-3 border border-yellow-200">
                      <Text className="text-xs text-yellow-700">
                        ⏳ Pending parental approval for minor
                      </Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    {item.status !== "signed" && (
                      <Pressable
                        className="flex-1 bg-red-500 rounded-lg py-2 items-center"
                        onPress={() => handleSignWaiver(item)}
                      >
                        <Text className="text-white text-sm font-semibold">Sign Now</Text>
                      </Pressable>
                    )}
                    <Pressable
                      className="flex-1 border border-red-500 rounded-lg py-2 items-center"
                      onPress={() => handleDownloadWaiver(item)}
                    >
                      <Text className="text-red-500 text-sm font-semibold">Download</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Waiver Template Info */}
          <View
            className="bg-surface rounded-xl p-4 border border-border gap-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="font-semibold text-foreground">Tournament Waiver</Text>
            <Text className="text-xs text-muted leading-relaxed">
              This waiver covers all standard tournament risks and liability. Players under 18
              require parental/guardian consent. All waivers are securely stored and can be
              downloaded at any time.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pb-6">
            <Pressable
              className="bg-red-500 rounded-xl py-4 items-center"
              onPress={() => Alert.alert("Bulk Sign", "Bulk signing workflow initiated")}
            >
              <Text className="text-white font-semibold">Bulk Sign Waivers</Text>
            </Pressable>
            <Pressable
              className="border border-red-500 rounded-xl py-4 items-center"
              onPress={() => Alert.alert("Export", "Waiver records exported successfully")}
            >
              <Text className="text-red-500 font-semibold">Export Records</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Signing Modal */}
      <Modal visible={showSigningModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-background rounded-t-3xl p-6 gap-4"
            style={{ backgroundColor: colors.background }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-foreground">Sign Waiver</Text>
              <Pressable onPress={() => setShowSigningModal(false)}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.muted} />
              </Pressable>
            </View>

            {selectedWaiver && (
              <View className="gap-4">
                <View className="bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted">Player</Text>
                  <Text className="text-lg font-semibold text-foreground">
                    {selectedWaiver.playerName}
                  </Text>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Full Name</Text>
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.muted}
                    value={playerSignature}
                    onChangeText={setPlayerSignature}
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    style={{
                      color: colors.foreground,
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  />
                </View>

                <Pressable
                  className="flex-row items-center gap-3 bg-surface rounded-lg p-4 border border-border"
                  onPress={() => setParentalConsent(!parentalConsent)}
                >
                  <View
                    className="w-6 h-6 rounded border-2 items-center justify-center"
                    style={{
                      borderColor: parentalConsent ? "#EF4444" : colors.border,
                      backgroundColor: parentalConsent ? "#EF4444" : "transparent",
                    }}
                  >
                    {parentalConsent && (
                      <IconSymbol name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      Parental Consent
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      I confirm I am the parent/guardian and consent to participation
                    </Text>
                  </View>
                </Pressable>

                <View className="flex-row gap-3">
                  <Pressable
                    className="flex-1 border border-red-500 rounded-lg py-3 items-center"
                    onPress={() => setShowSigningModal(false)}
                  >
                    <Text className="text-red-500 font-semibold">Cancel</Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 bg-red-500 rounded-lg py-3 items-center"
                    onPress={confirmSignature}
                  >
                    <Text className="text-white font-semibold">Sign & Confirm</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

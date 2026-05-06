import { View, Text, ScrollView, Pressable, Modal, TextInput, FlatList, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface Advertisement {
  id: string;
  companyName: string;
  contactEmail: string;
  adType: "banner" | "featured" | "sponsor";
  duration: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "pending" | "active" | "expired" | "rejected";
  description: string;
  imageUrl?: string;
  approvalDate?: string;
}

export default function AdminAdvertisementsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: "1",
      companyName: "Nike Sports",
      contactEmail: "partnerships@nike.com",
      adType: "featured",
      duration: "3 months",
      startDate: "2026-05-01",
      endDate: "2026-07-31",
      price: 5000,
      status: "active",
      description: "Featured sponsor for summer tournaments",
      approvalDate: "2026-04-15",
    },
    {
      id: "2",
      companyName: "Adidas Performance",
      contactEmail: "marketing@adidas.com",
      adType: "banner",
      duration: "1 month",
      startDate: "2026-05-15",
      endDate: "2026-06-15",
      price: 2000,
      status: "pending",
      description: "Banner advertisement on home page",
    },
  ]);

  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newAd, setNewAd] = useState({
    companyName: "",
    contactEmail: "",
    adType: "banner" as "banner" | "featured" | "sponsor",
    duration: "",
    price: "",
    description: "",
  });

  const handleAddAdvertisement = () => {
    if (!newAd.companyName || !newAd.contactEmail || !newAd.price) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    const ad: Advertisement = {
      id: Date.now().toString(),
      companyName: newAd.companyName,
      contactEmail: newAd.contactEmail,
      adType: newAd.adType,
      duration: newAd.duration,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      price: parseFloat(newAd.price),
      status: "pending",
      description: newAd.description,
    };

    setAdvertisements([...advertisements, ad]);
    setNewAd({ companyName: "", contactEmail: "", adType: "banner", duration: "", price: "", description: "" });
    setShowNewAdModal(false);
    Alert.alert("Success", "Advertisement request submitted for review");
  };

  const handleApproveAd = (id: string) => {
    setAdvertisements(
      advertisements.map((ad) =>
        ad.id === id ? { ...ad, status: "active", approvalDate: new Date().toISOString().split("T")[0] } : ad
      )
    );
    Alert.alert("Approved", "Advertisement has been approved and is now active");
  };

  const handleRejectAd = (id: string) => {
    setAdvertisements(advertisements.map((ad) => (ad.id === id ? { ...ad, status: "rejected" } : ad)));
    Alert.alert("Rejected", "Advertisement request has been rejected");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success;
      case "pending":
        return colors.warning;
      case "expired":
        return colors.muted;
      case "rejected":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getAdTypeLabel = (type: string) => {
    switch (type) {
      case "banner":
        return "Banner Ad";
      case "featured":
        return "Featured Sponsor";
      case "sponsor":
        return "Event Sponsor";
      default:
        return type;
    }
  };

  const renderAdCard = ({ item }: { item: Advertisement }) => (
    <Pressable
      onPress={() => {
        setSelectedAd(item);
        setShowDetailsModal(true);
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
      })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{item.companyName}</Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>{getAdTypeLabel(item.adType)}</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: getStatusColor(item.status) + "20",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: getStatusColor(item.status), textTransform: "capitalize" }}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 12, color: colors.muted }}>Duration</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 2 }}>{item.duration}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Investment</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary, marginTop: 2 }}>${item.price.toLocaleString()}</Text>
        </View>
      </View>

      <IconSymbol name="chevron.right" size={16} color={colors.muted} style={{ marginTop: 12, alignSelf: "flex-end" }} />
    </Pressable>
  );

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScreenHeader title="Advertisements" />

      <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
        {/* Summary Stats */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, marginBottom: 20, gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 11, color: colors.muted, fontWeight: "600" }}>Active Ads</Text>
            <Text style={{ fontSize: 24, fontWeight: "800", color: colors.foreground, marginTop: 4 }}>
              {advertisements.filter((a) => a.status === "active").length}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 11, color: colors.muted, fontWeight: "600" }}>Total Revenue</Text>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.success, marginTop: 4 }}>
              ${advertisements.filter((a) => a.status === "active").reduce((sum, a) => sum + a.price, 0).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Add New Advertisement Button */}
        <Pressable
          onPress={() => setShowNewAdModal(true)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            marginHorizontal: 16,
            marginBottom: 20,
            backgroundColor: colors.primary,
            borderRadius: 14,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          })}
        >
          <IconSymbol name="plus.circle.fill" size={20} color="white" />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>New Advertisement</Text>
        </Pressable>

        {/* Advertisements List */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, paddingHorizontal: 16, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            All Advertisements
          </Text>
          <FlatList
            data={advertisements}
            renderItem={renderAdCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* New Advertisement Modal */}
      <Modal visible={showNewAdModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: "90%" }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>New Advertisement</Text>
                <Pressable onPress={() => setShowNewAdModal(false)}>
                  <IconSymbol name="xmark.circle.fill" size={24} color={colors.muted} />
                </Pressable>
              </View>

              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>Company Name *</Text>
              <TextInput
                placeholder="Enter company name"
                placeholderTextColor={colors.muted}
                value={newAd.companyName}
                onChangeText={(text) => setNewAd({ ...newAd, companyName: text })}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.foreground,
                  marginBottom: 16,
                  fontSize: 15,
                }}
              />

              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>Contact Email *</Text>
              <TextInput
                placeholder="partnerships@company.com"
                placeholderTextColor={colors.muted}
                value={newAd.contactEmail}
                onChangeText={(text) => setNewAd({ ...newAd, contactEmail: text })}
                keyboardType="email-address"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.foreground,
                  marginBottom: 16,
                  fontSize: 15,
                }}
              />

              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>Advertisement Type</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                {(["banner", "featured", "sponsor"] as const).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setNewAd({ ...newAd, adType: type })}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: newAd.adType === type ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: newAd.adType === type ? colors.primary : colors.border,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600", color: newAd.adType === type ? "white" : colors.foreground, textTransform: "capitalize" }}>
                      {getAdTypeLabel(type)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>Investment Amount *</Text>
              <TextInput
                placeholder="$5,000"
                placeholderTextColor={colors.muted}
                value={newAd.price}
                onChangeText={(text) => setNewAd({ ...newAd, price: text })}
                keyboardType="decimal-pad"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.foreground,
                  marginBottom: 16,
                  fontSize: 15,
                }}
              />

              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>Duration</Text>
              <TextInput
                placeholder="e.g., 3 months"
                placeholderTextColor={colors.muted}
                value={newAd.duration}
                onChangeText={(text) => setNewAd({ ...newAd, duration: text })}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.foreground,
                  marginBottom: 16,
                  fontSize: 15,
                }}
              />

              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>Description</Text>
              <TextInput
                placeholder="Describe the advertisement"
                placeholderTextColor={colors.muted}
                value={newAd.description}
                onChangeText={(text) => setNewAd({ ...newAd, description: text })}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.foreground,
                  marginBottom: 20,
                  fontSize: 15,
                  textAlignVertical: "top",
                }}
              />

              <Pressable
                onPress={handleAddAdvertisement}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  marginBottom: 12,
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>Submit Advertisement</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowNewAdModal(false)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Advertisement Details Modal */}
      <Modal visible={showDetailsModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: "90%" }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>Advertisement Details</Text>
                <Pressable onPress={() => setShowDetailsModal(false)}>
                  <IconSymbol name="xmark.circle.fill" size={24} color={colors.muted} />
                </Pressable>
              </View>

              {selectedAd && (
                <>
                  <View style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 16 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{selectedAd.companyName}</Text>
                        <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>{selectedAd.contactEmail}</Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          backgroundColor: getStatusColor(selectedAd.status) + "20",
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: "700", color: getStatusColor(selectedAd.status), textTransform: "capitalize" }}>
                          {selectedAd.status}
                        </Text>
                      </View>
                    </View>

                    <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }}>
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 12, color: colors.muted }}>Type</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 4 }}>{getAdTypeLabel(selectedAd.adType)}</Text>
                      </View>
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 12, color: colors.muted }}>Duration</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 4 }}>{selectedAd.duration}</Text>
                      </View>
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 12, color: colors.muted }}>Investment</Text>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary, marginTop: 4 }}>${selectedAd.price.toLocaleString()}</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: colors.muted }}>Description</Text>
                        <Text style={{ fontSize: 14, color: colors.foreground, marginTop: 4, lineHeight: 20 }}>{selectedAd.description}</Text>
                      </View>
                    </View>
                  </View>

                  {selectedAd.status === "pending" && (
                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                      <Pressable
                        onPress={() => handleApproveAd(selectedAd.id)}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.8 : 1,
                          flex: 1,
                          backgroundColor: colors.success,
                          borderRadius: 12,
                          paddingVertical: 14,
                          alignItems: "center",
                        })}
                      >
                        <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>Approve</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleRejectAd(selectedAd.id)}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.8 : 1,
                          flex: 1,
                          backgroundColor: colors.error,
                          borderRadius: 12,
                          paddingVertical: 14,
                          alignItems: "center",
                        })}
                      >
                        <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>Reject</Text>
                      </Pressable>
                    </View>
                  )}

                  <Pressable
                    onPress={() => setShowDetailsModal(false)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.8 : 1,
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: "center",
                    })}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>Close</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

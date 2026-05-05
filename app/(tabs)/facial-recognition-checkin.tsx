import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
interface DetectedFace {
  id: string;
  name: string;
  confidence: number;
  playerId: string;
  verified: boolean;
  checkInTime?: string;
  idCardUrl?: string;
}

interface CheckInRecord {
  playerId: string;
  playerName: string;
  checkInTime: string;
  timestamp: number;
  mode: "individual" | "group" | "manual" | "override";
  confidence: number;
  verified: boolean;
  staffName?: string;
  notes?: string;
}

interface Player {
  id: string;
  name: string;
  idCardUrl: string;
  age: number;
  position: string;
}

// Mock player database with ID card photos (using S3 URLs)
const MOCK_PLAYERS: Player[] = [
  {
    id: "TH-001",
    name: "Marcus Johnson",
    idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-1-HfGaF6HKfeg9Cpw4J5Apnr.webp",
    age: 16,
    position: "QB",
  },
  {
    id: "TH-002",
    name: "Jake Williams",
    idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-2-KWqCzeHH3WXEZbaXVXmiRH.webp",
    age: 17,
    position: "WR",
  },
  {
    id: "TH-003",
    name: "Tyler Brown",
    idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-3-d2tJXrcy4vNKR8AWRZJ3Ss.webp",
    age: 16,
    position: "DB",
  },
];

export default function FacialRecognitionCheckInScreen() {
  const colors = useColors();
  const router = useRouter();

  const [mode, setMode] = useState<"individual" | "group">("individual");
  const [isScanning, setIsScanning] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStaffOverride, setShowStaffOverride] = useState(false);
  const [selectedFaceForOverride, setSelectedFaceForOverride] = useState<DetectedFace | null>(null);
  const [staffName, setStaffName] = useState("");
  const [overrideNotes, setOverrideNotes] = useState("");

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    setCameraPermission(true);
  };

  // Simulate facial recognition with confidence scoring
  const startScan = async () => {
    if (!cameraPermission) {
      Alert.alert("Permission Denied", "Camera access is required for facial recognition.");
      return;
    }

    setIsScanning(true);
    setDetectedFaces([]);

    // Simulate facial recognition scan with realistic confidence scores
    setTimeout(() => {
      if (mode === "individual") {
        // Simulate single face detection
        setDetectedFaces([
          {
            id: "face_1",
            name: "Marcus Johnson",
            confidence: 0.94, // 94% confidence
            playerId: "TH-001",
            verified: false,
            checkInTime: new Date().toLocaleTimeString(),
            idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-1-HfGaF6HKfeg9Cpw4J5Apnr.webp",
          },
        ]);
      } else {
        // Simulate group photo detection (multiple faces)
        setDetectedFaces([
          {
            id: "face_1",
            name: "Marcus Johnson",
            confidence: 0.94,
            playerId: "TH-001",
            verified: false,
            checkInTime: new Date().toLocaleTimeString(),
            idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-1-HfGaF6HKfeg9Cpw4J5Apnr.webp",
          },
          {
            id: "face_2",
            name: "Jake Williams",
            confidence: 0.91,
            playerId: "TH-002",
            verified: false,
            checkInTime: new Date().toLocaleTimeString(),
            idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-2-KWqCzeHH3WXEZbaXVXmiRH.webp",
          },
          {
            id: "face_3",
            name: "Tyler Brown",
            confidence: 0.78, // Low confidence - below 85% threshold
            playerId: "TH-003",
            verified: false,
            checkInTime: new Date().toLocaleTimeString(),
            idCardUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663422454992/e5zs2TyygFZrCB6WqhLLfz/player-id-card-3-d2tJXrcy4vNKR8AWRZJ3Ss.webp",
          },
        ]);
      }
      setIsScanning(false);
    }, 2000);
  };

  // Validate confidence score (85% threshold)
  const validateConfidence = (confidence: number): boolean => {
    return confidence >= 0.85;
  };

  // Confirm check-in with validation
  const confirmCheckIn = (face: DetectedFace) => {
    const isValid = validateConfidence(face.confidence);

    if (!isValid) {
      Alert.alert(
        "Low Confidence Score",
        `Confidence level is ${(face.confidence * 100).toFixed(0)}%. Below 85% threshold.\n\nOptions:\n• Try scanning again\n• Use Manual Search\n• Staff Override`,
        [
          { text: "Cancel", onPress: () => {} },
          { text: "Manual Search", onPress: () => setShowManualSearch(true) },
          {
            text: "Staff Override",
            onPress: () => {
              setSelectedFaceForOverride(face);
              setShowStaffOverride(true);
            },
          },
        ]
      );
      return;
    }

    const record: CheckInRecord = {
      playerId: face.playerId,
      playerName: face.name,
      checkInTime: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      mode: "individual",
      confidence: face.confidence,
      verified: true,
    };

    setCheckInRecords([...checkInRecords, record]);
    setDetectedFaces(detectedFaces.filter((f: DetectedFace) => f.id !== face.id));
    Alert.alert("✓ Check-In Successful", `${face.name} checked in at ${record.checkInTime}\nConfidence: ${(face.confidence * 100).toFixed(0)}%`);
  };

  // Manual player search fallback
  const handleManualSearch = () => {
    const player = MOCK_PLAYERS.find((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!player) {
      Alert.alert("Not Found", "Player not found in database. Verify they have an active profile and ID card.");
      return;
    }

    const record: CheckInRecord = {
      playerId: player.id,
      playerName: player.name,
      checkInTime: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      mode: "manual",
      confidence: 0,
      verified: true,
      notes: "Manual search - no facial recognition",
    };

    setCheckInRecords([...checkInRecords, record]);
    setShowManualSearch(false);
    setSearchQuery("");
    Alert.alert("✓ Check-In Successful", `${player.name} checked in manually at ${record.checkInTime}`);
  };

  // Staff override for low confidence
  const handleStaffOverride = () => {
    if (!selectedFaceForOverride || !staffName.trim()) {
      Alert.alert("Error", "Please enter staff name");
      return;
    }

    const record: CheckInRecord = {
      playerId: selectedFaceForOverride.playerId,
      playerName: selectedFaceForOverride.name,
      checkInTime: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      mode: "override",
      confidence: selectedFaceForOverride.confidence,
      verified: true,
      staffName: staffName,
      notes: overrideNotes || "Staff override - low confidence score",
    };

    setCheckInRecords([...checkInRecords, record]);
    setDetectedFaces(detectedFaces.filter((f: DetectedFace) => f.id !== selectedFaceForOverride.id));
    setShowStaffOverride(false);
    setStaffName("");
    setOverrideNotes("");
    setSelectedFaceForOverride(null);

    Alert.alert(
      "✓ Override Check-In Complete",
      `${selectedFaceForOverride.name} checked in by ${staffName}\nOriginal confidence: ${(selectedFaceForOverride.confidence * 100).toFixed(0)}%`
    );
  };

  const rejectFace = (faceId: string) => {
    setDetectedFaces(detectedFaces.filter((f: DetectedFace) => f.id !== faceId));
  };

  const renderDetectedFace = ({ item }: { item: DetectedFace }) => {
    const isHighConfidence = item.confidence >= 0.9;
    const isMediumConfidence = item.confidence >= 0.85 && item.confidence < 0.9;
    const isLowConfidence = item.confidence < 0.85;

    let borderColor = "#EF4444"; // Red for low
    let statusColor = "#EF4444";
    let statusText = "Low Confidence";

    if (isHighConfidence) {
      borderColor = "#22C55E"; // Green for high
      statusColor = "#22C55E";
      statusText = "High Confidence";
    } else if (isMediumConfidence) {
      borderColor = "#F59E0B"; // Amber for medium
      statusColor = "#F59E0B";
      statusText = "Medium Confidence";
    }

    return (
      <View
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: borderColor,
        }}
      >
        {/* Player Info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFF", marginBottom: 4 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: "#AAA" }}>
              ID: {item.playerId}
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: statusColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#000" }}>
              {(item.confidence * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View
          style={{
            backgroundColor: statusColor + "20",
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginBottom: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "600", color: statusColor }}>
            {statusText}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => confirmCheckIn(item)}
            style={{
              flex: 1,
              backgroundColor: isLowConfidence ? "#666" : "#EF4444",
              borderRadius: 8,
              padding: 10,
              alignItems: "center",
              opacity: isLowConfidence ? 0.5 : 1,
            }}
            disabled={isLowConfidence}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFF" }}>
              {isLowConfidence ? "Confirm (Disabled)" : "Confirm"}
            </Text>
          </Pressable>

          {isLowConfidence && (
            <Pressable
              onPress={() => {
                setSelectedFaceForOverride(item);
                setShowStaffOverride(true);
              }}
              style={{
                flex: 1,
                backgroundColor: "#F59E0B",
                borderRadius: 8,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#000" }}>
                Override
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => rejectFace(item.id)}
            style={{
              flex: 1,
              backgroundColor: "#333",
              borderRadius: 8,
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFF" }}>
              Reject
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderCheckInRecord = ({ item }: { item: CheckInRecord }) => (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: item.mode === "override" ? "#F59E0B" : "#EF4444",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFF", marginBottom: 4 }}>
            {item.playerName}
          </Text>
          <Text style={{ fontSize: 11, color: "#AAA", marginBottom: 4 }}>
            {item.checkInTime} • {item.mode === "individual" ? "Facial Recognition" : item.mode === "manual" ? "Manual Search" : "Staff Override"}
          </Text>
          {item.staffName && (
            <Text style={{ fontSize: 10, color: "#F59E0B" }}>
              Staff: {item.staffName}
            </Text>
          )}
          {item.notes && (
            <Text style={{ fontSize: 10, color: "#AAA", marginTop: 2 }}>
              {item.notes}
            </Text>
          )}
        </View>
        <View style={{ alignItems: "center" }}>
          <IconSymbol name="checkmark.circle.fill" size={20} color="#EF4444" />
          {item.confidence > 0 && (
            <Text style={{ fontSize: 10, color: "#AAA", marginTop: 2 }}>
              {(item.confidence * 100).toFixed(0)}%
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#333" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Pressable onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color="#EF4444" />
            </Pressable>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFF" }}>
                Facial Recognition Check-In
              </Text>
              <Text style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>
                85% confidence threshold • Staff override available
              </Text>
            </View>
          </View>

          {/* Mode Selection */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => setMode("individual")}
              style={{
                flex: 1,
                backgroundColor: mode === "individual" ? "#EF4444" : "#333",
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: mode === "individual" ? "#000" : "#FFF" }}>
                Single Scan
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("group")}
              style={{
                flex: 1,
                backgroundColor: mode === "group" ? "#EF4444" : "#333",
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: mode === "group" ? "#000" : "#FFF" }}>
                Group Photo
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Main Content */}
        <View style={{ padding: 16 }}>
          {/* Scan Button */}
          <Pressable
            onPress={startScan}
            disabled={isScanning}
            style={{
              backgroundColor: "#EF4444",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 20,
              opacity: isScanning ? 0.6 : 1,
            }}
          >
            {isScanning ? (
              <ActivityIndicator color="#000" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <IconSymbol name="camera.fill" size={20} color="#000" />
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#000" }}>
                  Start Scan
                </Text>
              </View>
            )}
          </Pressable>

          {/* Detected Faces */}
          {detectedFaces.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF", marginBottom: 12 }}>
                Detected Faces ({detectedFaces.length})
              </Text>
              <FlatList
                data={detectedFaces}
                renderItem={renderDetectedFace}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Check-In Records */}
          {checkInRecords.length > 0 && (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF" }}>
                  Check-In Records ({checkInRecords.length})
                </Text>
                <Pressable
                  onPress={() => setCheckInRecords([])}
                  style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                >
                  <Text style={{ fontSize: 11, color: "#AAA" }}>Clear</Text>
                </Pressable>
              </View>
              <FlatList
                data={checkInRecords}
                renderItem={renderCheckInRecord}
                keyExtractor={(item, idx) => `${item.playerId}-${idx}`}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Fallback Options */}
          {detectedFaces.length === 0 && checkInRecords.length === 0 && !isScanning && (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <IconSymbol name="camera.fill" size={48} color="#666" />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#AAA", marginTop: 12 }}>
                No faces detected
              </Text>
              <Pressable
                onPress={() => setShowManualSearch(true)}
                style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8 }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#EF4444" }}>
                  Use Manual Search →
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Manual Search Modal */}
      <Modal visible={showManualSearch} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#0a0a0a", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFF", marginBottom: 16 }}>
              Manual Player Search
            </Text>

            <TextInput
              placeholder="Search player name..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: "#FFF",
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#333",
              }}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => {
                  setShowManualSearch(false);
                  setSearchQuery("");
                }}
                style={{ flex: 1, backgroundColor: "#333", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFF" }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleManualSearch}
                style={{ flex: 1, backgroundColor: "#EF4444", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#000" }}>Check In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Staff Override Modal */}
      <Modal visible={showStaffOverride} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#0a0a0a", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFF", marginBottom: 12 }}>
              Staff Override
            </Text>
            <Text style={{ fontSize: 12, color: "#AAA", marginBottom: 16 }}>
              {selectedFaceForOverride?.name} • Confidence: {selectedFaceForOverride ? (selectedFaceForOverride.confidence * 100).toFixed(0) : 0}%
            </Text>

            <TextInput
              placeholder="Staff member name..."
              placeholderTextColor="#666"
              value={staffName}
              onChangeText={setStaffName}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: "#FFF",
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#333",
              }}
            />

            <TextInput
              placeholder="Notes (optional)..."
              placeholderTextColor="#666"
              value={overrideNotes}
              onChangeText={setOverrideNotes}
              multiline
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: "#FFF",
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#333",
                height: 80,
              }}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => {
                  setShowStaffOverride(false);
                  setStaffName("");
                  setOverrideNotes("");
                }}
                style={{ flex: 1, backgroundColor: "#333", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFF" }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleStaffOverride}
                style={{ flex: 1, backgroundColor: "#F59E0B", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#000" }}>Confirm Override</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

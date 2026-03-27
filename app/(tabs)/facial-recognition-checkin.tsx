import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
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
}

interface CheckInRecord {
  playerId: string;
  playerName: string;
  checkInTime: string;
  mode: "individual" | "group";
  confidence: number;
  verified: boolean;
}

export default function FacialRecognitionCheckInScreen() {
  const colors = useColors();
  const router = useRouter();
  
  const [mode, setMode] = useState<"individual" | "group">("individual");
  const [isScanning, setIsScanning] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check camera permissions
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    // Placeholder for camera permission check
    // In production, use expo-camera or react-native-camera
    setCameraPermission(true);
  };

  const startScan = async () => {
    if (!cameraPermission) {
      Alert.alert("Permission Denied", "Camera access is required for facial recognition.");
      return;
    }

    setIsScanning(true);
    setDetectedFaces([]);

    // Simulate facial recognition scan
    setTimeout(() => {
      if (mode === "individual") {
        // Simulate single face detection
        setDetectedFaces([
          {
            id: "face_1",
            name: "Dakota Gooden",
            confidence: 0.98,
            playerId: "PLAYER_001",
            verified: true,
            checkInTime: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        // Simulate group photo detection (multiple faces)
        setDetectedFaces([
          {
            id: "face_1",
            name: "Dakota Gooden",
            confidence: 0.98,
            playerId: "PLAYER_001",
            verified: true,
            checkInTime: new Date().toLocaleTimeString(),
          },
          {
            id: "face_2",
            name: "Jake Williams",
            confidence: 0.95,
            playerId: "PLAYER_002",
            verified: true,
            checkInTime: new Date().toLocaleTimeString(),
          },
          {
            id: "face_3",
            name: "Tyler Brown",
            confidence: 0.92,
            playerId: "PLAYER_003",
            verified: true,
            checkInTime: new Date().toLocaleTimeString(),
          },
        ]);
      }
      setIsScanning(false);
    }, 2000);
  };

  const confirmCheckIn = (face: DetectedFace) => {
    if (face.confidence < 0.85) {
      Alert.alert(
        "Low Confidence",
        `Confidence level is ${(face.confidence * 100).toFixed(0)}%. Please try again or verify manually.`
      );
      return;
    }

    const record: CheckInRecord = {
      playerId: face.playerId,
      playerName: face.name,
      checkInTime: new Date().toLocaleTimeString(),
      mode,
      confidence: face.confidence,
      verified: true,
    };

    setCheckInRecords([...checkInRecords, record]);
    setDetectedFaces(detectedFaces.filter((f) => f.id !== face.id));
    Alert.alert("Success", `${face.name} checked in successfully!`);
  };

  const rejectFace = (faceId: string) => {
    setDetectedFaces(detectedFaces.filter((f) => f.id !== faceId));
  };

  const renderDetectedFace = ({ item }: { item: DetectedFace }) => (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: item.confidence > 0.9 ? "#39FF14" : "#FFB800",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFF", marginBottom: 4 }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#AAA" }}>
            Confidence: {(item.confidence * 100).toFixed(0)}%
          </Text>
        </View>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: item.confidence > 0.9 ? "#39FF14" : "#FFB800",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSymbol name="checkmark.circle.fill" size={24} color="#000" />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => confirmCheckIn(item)}
          style={{
            flex: 1,
            backgroundColor: "#39FF14",
            borderRadius: 8,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#000" }}>
            Confirm
          </Text>
        </Pressable>
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

  const renderCheckInRecord = ({ item }: { item: CheckInRecord }) => (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFF", marginBottom: 4 }}>
          {item.playerName}
        </Text>
        <Text style={{ fontSize: 11, color: "#AAA" }}>
          {item.checkInTime} • {item.mode === "individual" ? "Single Scan" : "Group Photo"}
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <IconSymbol name="checkmark.circle.fill" size={20} color="#39FF14" />
        <Text style={{ fontSize: 10, color: "#39FF14", marginTop: 2 }}>
          {(item.confidence * 100).toFixed(0)}%
        </Text>
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
              <IconSymbol name="chevron.left" size={24} color="#39FF14" />
            </Pressable>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFF" }}>
                Facial Recognition Check-In
              </Text>
              <Text style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>
                Verify player identity in real-time
              </Text>
            </View>
          </View>

          {/* Mode Selector */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => setMode("individual")}
              style={{
                flex: 1,
                backgroundColor: mode === "individual" ? "#39FF14" : "#333",
                borderRadius: 8,
                padding: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: mode === "individual" ? "#000" : "#FFF",
                }}
              >
                Individual Scan
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("group")}
              style={{
                flex: 1,
                backgroundColor: mode === "group" ? "#39FF14" : "#333",
                borderRadius: 8,
                padding: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: mode === "group" ? "#000" : "#FFF",
                }}
              >
                Group Photo
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Camera/Scan Area */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#39FF14",
              borderStyle: "dashed",
              padding: 24,
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            {isScanning ? (
              <>
                <ActivityIndicator size="large" color="#39FF14" />
                <Text style={{ fontSize: 14, color: "#AAA", marginTop: 16 }}>
                  Scanning for faces...
                </Text>
              </>
            ) : (
              <>
                <IconSymbol name="camera.fill" size={48} color="#39FF14" />
                <Text style={{ fontSize: 14, color: "#FFF", marginTop: 12, fontWeight: "600" }}>
                  {mode === "individual" ? "Position face in frame" : "Position group in frame"}
                </Text>
                <Text style={{ fontSize: 12, color: "#AAA", marginTop: 8, textAlign: "center" }}>
                  {mode === "individual"
                    ? "Ensure good lighting and face is clearly visible"
                    : "All players should be visible and facing camera"}
                </Text>
              </>
            )}
          </View>

          <Pressable
            onPress={startScan}
            disabled={isScanning}
            style={{
              backgroundColor: isScanning ? "#666" : "#39FF14",
              borderRadius: 12,
              padding: 14,
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
              {isScanning ? "Scanning..." : "Start Scan"}
            </Text>
          </Pressable>
        </View>

        {/* Detected Faces */}
        {detectedFaces.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#333" }}>
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
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#333" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF" }}>
                Checked In ({checkInRecords.length})
              </Text>
              <View
                style={{
                  backgroundColor: "#39FF14",
                  borderRadius: 20,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#000" }}>
                  {checkInRecords.length}
                </Text>
              </View>
            </View>
            <FlatList
              data={checkInRecords}
              renderItem={renderCheckInRecord}
              keyExtractor={(item, index) => `${item.playerId}_${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Empty State */}
        {detectedFaces.length === 0 && checkInRecords.length === 0 && !isScanning && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 32, alignItems: "center" }}>
            <IconSymbol name="face.smiling.fill" size={48} color="#39FF14" />
            <Text style={{ fontSize: 14, color: "#AAA", marginTop: 16, textAlign: "center" }}>
              No faces detected yet. Start a scan to begin check-in.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

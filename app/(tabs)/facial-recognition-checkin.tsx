import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter, useLocalSearchParams } from "expo-router";

type CheckInMode = "player_by_player" | "group_photo";

interface CheckInResult {
  athleteId: number;
  athleteName: string;
  team: string;
  matchConfidence: number;
  status: "confirmed" | "unrecognized";
  timestamp: string;
}

export default function FacialRecognitionCheckinScreen() {
  const colors = useColors();
  const router = useRouter();
  const { tournamentId } = useLocalSearchParams();
  
  const [mode, setMode] = useState<CheckInMode>("player_by_player");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [checkInResults, setCheckInResults] = useState<CheckInResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock data for demonstration
  const mockAthletes = [
    { id: 1, name: "Marcus Johnson", team: "Texas Elite 7v7", confidence: 0.98 },
    { id: 2, name: "Jake Williams", team: "Lone Star Ballers", confidence: 0.95 },
    { id: 3, name: "Tyler Brown", team: "Gulf Coast Warriors", confidence: 0.92 },
  ];

  const handleStartScan = () => {
    setIsCameraActive(true);
    setIsScanning(true);
    
    // Simulate facial recognition scanning
    setTimeout(() => {
      if (mode === "player_by_player") {
        const result: CheckInResult = {
          athleteId: mockAthletes[0].id,
          athleteName: mockAthletes[0].name,
          team: mockAthletes[0].team,
          matchConfidence: mockAthletes[0].confidence,
          status: "confirmed",
          timestamp: new Date().toLocaleTimeString(),
        };
        setCheckInResults([result]);
        setShowResults(true);
        setIsScanning(false);
      }
    }, 2000);
  };

  const handleGroupPhotoCapture = () => {
    setIsScanning(true);
    
    // Simulate group photo facial recognition
    setTimeout(() => {
      const results: CheckInResult[] = mockAthletes.map((athlete) => ({
        athleteId: athlete.id,
        athleteName: athlete.name,
        team: athlete.team,
        matchConfidence: athlete.confidence,
        status: athlete.confidence > 0.9 ? "confirmed" : "unrecognized",
        timestamp: new Date().toLocaleTimeString(),
      }));
      setCheckInResults(results);
      setShowResults(true);
      setIsScanning(false);
      setIsCameraActive(false);
    }, 2500);
  };

  const handleCancel = () => {
    setIsCameraActive(false);
    setShowResults(false);
    setCheckInResults([]);
    setIsScanning(false);
  };

  const handleRetry = () => {
    setShowResults(false);
    setCheckInResults([]);
    handleStartScan();
  };

  if (isCameraActive && !showResults) {
    return (
      <ScreenContainer className="bg-black flex-1 p-0">
        <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
          {/* Camera Viewfinder Placeholder */}
          <View
            style={{
              width: "100%",
              height: "70%",
              backgroundColor: "#1a1a1a",
              borderWidth: 2,
              borderColor: "#39FF14",
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            {isScanning ? (
              <View style={{ alignItems: "center", gap: 16 }}>
                <ActivityIndicator size={48} color="#39FF14" />
                <Text style={{ color: "#39FF14", fontSize: 14, fontWeight: "600" }}>
                  {mode === "player_by_player" ? "Scanning face..." : "Detecting faces..."}
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderWidth: 3,
                    borderColor: "#39FF14",
                  }}
                />
                <Text style={{ color: "#AAA", fontSize: 12, textAlign: "center" }}>
                  {mode === "player_by_player"
                    ? "Position face in circle"
                    : "Frame entire team in view"}
                </Text>
              </View>
            )}
          </View>

          {/* Mode Indicator */}
          <Text style={{ color: "#39FF14", fontSize: 13, fontWeight: "600", marginBottom: 16 }}>
            {mode === "player_by_player" ? "Player-by-Player Scan" : "Team Group Photo"}
          </Text>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, width: "100%", paddingHorizontal: 16 }}>
            <Pressable
              onPress={handleCancel}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: "#333",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={mode === "player_by_player" ? handleStartScan : handleGroupPhotoCapture}
              disabled={isScanning}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: isScanning ? "#39FF1466" : "#39FF14",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#000", fontWeight: "700" }}>
                {isScanning ? "Scanning..." : mode === "player_by_player" ? "Scan" : "Capture"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (showResults) {
    return (
      <ScreenContainer className="bg-black flex-1 p-0">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
          {/* Header */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#333" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Pressable onPress={handleCancel}>
                <IconSymbol name="chevron.left" size={24} color="#39FF14" />
              </Pressable>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF", flex: 1 }}>
                Check-In Results
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#AAA" }}>
              {checkInResults.length} athlete{checkInResults.length !== 1 ? "s" : ""} detected
            </Text>
          </View>

          {/* Results List */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
            {checkInResults.map((result, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderWidth: 1,
                  borderColor: result.status === "confirmed" ? "#39FF14" : "#FF6B6B",
                  borderRadius: 12,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Status Indicator */}
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: result.status === "confirmed" ? "#39FF14" : "#FF6B6B",
                  }}
                />

                {/* Athlete Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF", marginBottom: 4 }}>
                    {result.athleteName}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#AAA", marginBottom: 4 }}>
                    {result.team}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontSize: 11, color: "#39FF14", fontWeight: "600" }}>
                      {(result.matchConfidence * 100).toFixed(0)}% match
                    </Text>
                    <Text style={{ fontSize: 11, color: "#666" }}>
                      • {result.timestamp}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    backgroundColor: result.status === "confirmed" ? "rgba(57, 255, 20, 0.1)" : "rgba(255, 107, 107, 0.1)",
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: result.status === "confirmed" ? "#39FF14" : "#FF6B6B",
                    }}
                  >
                    {result.status === "confirmed" ? "✓ Confirmed" : "? Unrecognized"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Unrecognized Athletes */}
          {checkInResults.some((r) => r.status === "unrecognized") && (
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#AAA", textTransform: "uppercase" }}>
                Unrecognized Athletes
              </Text>
              {checkInResults
                .filter((r) => r.status === "unrecognized")
                .map((result, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: "#1a1a1a",
                      borderWidth: 1,
                      borderColor: "#333",
                      borderRadius: 10,
                      padding: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFF", marginBottom: 4 }}>
                        {result.athleteName}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#AAA" }}>
                        {result.team}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Pressable
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          backgroundColor: "#333",
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: "600", color: "#FFF" }}>
                          Retry
                        </Text>
                      </Pressable>
                      <Pressable
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          backgroundColor: "#39FF14",
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: "600", color: "#000" }}>
                          Manual
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 10 }}>
            <Pressable
              onPress={handleRetry}
              style={{
                paddingVertical: 12,
                backgroundColor: "#333",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFF" }}>
                Scan Another
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCancel}
              style={{
                paddingVertical: 12,
                backgroundColor: "#39FF14",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#000" }}>
                ✓ Complete Check-In
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 11, color: "#666" }}>
              Powered by Facial Recognition
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Main Screen - Mode Selection
  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#333" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Pressable onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color="#39FF14" />
            </Pressable>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF", flex: 1 }}>
              Facial Recognition Check-In
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: "#AAA" }}>
            Tournament ID: {tournamentId || "N/A"}
          </Text>
        </View>

        {/* Mode Selection */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Select Check-In Mode
          </Text>

          {/* Player-by-Player Mode */}
          <Pressable
            onPress={() => {
              setMode("player_by_player");
              handleStartScan();
            }}
            style={{
              backgroundColor: mode === "player_by_player" ? "#39FF14" : "#1a1a1a",
              borderWidth: mode === "player_by_player" ? 0 : 1,
              borderColor: "#333",
              borderRadius: 14,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: mode === "player_by_player" ? "rgba(0, 0, 0, 0.2)" : "#333",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol
                name="person.fill"
                size={24}
                color={mode === "player_by_player" ? "#000" : "#39FF14"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: mode === "player_by_player" ? "#000" : "#FFF",
                  marginBottom: 4,
                }}
              >
                Player-by-Player Scan
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: mode === "player_by_player" ? "rgba(0, 0, 0, 0.7)" : "#AAA",
                }}
              >
                Scan individual athletes one at a time
              </Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={20}
              color={mode === "player_by_player" ? "#000" : "#666"}
            />
          </Pressable>

          {/* Team Group Photo Mode */}
          <Pressable
            onPress={() => {
              setMode("group_photo");
              handleStartScan();
            }}
            style={{
              backgroundColor: mode === "group_photo" ? "#39FF14" : "#1a1a1a",
              borderWidth: mode === "group_photo" ? 0 : 1,
              borderColor: "#333",
              borderRadius: 14,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: mode === "group_photo" ? "rgba(0, 0, 0, 0.2)" : "#333",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol
                name="person.2.fill"
                size={24}
                color={mode === "group_photo" ? "#000" : "#39FF14"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: mode === "group_photo" ? "#000" : "#FFF",
                  marginBottom: 4,
                }}
              >
                Team Group Photo
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: mode === "group_photo" ? "rgba(0, 0, 0, 0.7)" : "#AAA",
                }}
              >
                Scan entire team in one photo
              </Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={20}
              color={mode === "group_photo" ? "#000" : "#666"}
            />
          </Pressable>
        </View>

        {/* Info Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
          <View
            style={{
              backgroundColor: "rgba(57, 255, 20, 0.05)",
              borderWidth: 1,
              borderColor: "rgba(57, 255, 20, 0.2)",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#39FF14", marginBottom: 8 }}>
              ℹ️ How It Works
            </Text>
            <Text style={{ fontSize: 12, color: "#AAA", lineHeight: 18 }}>
              Athletes must have a verified Player ID Card with a headshot on file. Our facial recognition system will instantly match faces to stored photos for fast, secure check-in.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 11, color: "#666" }}>
            Powered by Facial Recognition
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function PlayerIDCardScreen() {
  const handlePurchase = () => {
    // TODO: Implement purchase flow
    alert("Purchase Player ID Card - $15 for 365 days");
  };

  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Header with Icon and Title */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-4 mb-2">
            {/* Green Person Icon Square */}
            <View className="w-16 h-16 rounded-2xl bg-[#39FF14] items-center justify-center">
              <IconSymbol size={40} name="person.fill" color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-4xl font-bold text-white">Player ID Card</Text>
            </View>
          </View>
          <Text className="text-gray-400 text-base mt-2">
            Official player identification for tournaments and events
          </Text>
        </View>

        {/* Horizontal Info Bar - Price Display */}
        <View className="mx-6 mb-6 px-4 py-4 rounded-2xl bg-gray-900 border border-gray-800">
          <Text className="text-gray-400 text-sm font-semibold mb-1">ANNUAL MEMBERSHIP</Text>
          <Text className="text-[#39FF14] text-3xl font-bold">$15 / 365 days</Text>
        </View>

        {/* Central Content Area */}
        <View className="px-6 mb-8 flex-1">
          {/* Large Icon */}
          <View className="w-24 h-24 rounded-3xl bg-[#39FF14] items-center justify-center mx-auto mb-8">
            <IconSymbol size={60} name="person.fill" color="#000000" />
          </View>

          {/* Benefits List */}
          <View className="gap-5">
            {/* Benefit 1 */}
            <View className="flex-row items-start gap-4">
              <View className="w-8 h-8 rounded-full bg-[#39FF14] items-center justify-center mt-1">
                <Text className="text-black font-bold text-lg">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Verified player identity</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Secure digital verification for all tournaments
                </Text>
              </View>
            </View>

            {/* Benefit 2 */}
            <View className="flex-row items-start gap-4">
              <View className="w-8 h-8 rounded-full bg-[#39FF14] items-center justify-center mt-1">
                <Text className="text-black font-bold text-lg">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Valid at all TourneyHub events</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Access to every tournament on the platform
                </Text>
              </View>
            </View>

            {/* Benefit 3 */}
            <View className="flex-row items-start gap-4">
              <View className="w-8 h-8 rounded-full bg-[#39FF14] items-center justify-center mt-1">
                <Text className="text-black font-bold text-lg">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Digital + printable format</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Show your ID on your phone or print it out
                </Text>
              </View>
            </View>
          </View>

          {/* Description Text */}
          <Text className="text-gray-400 text-sm mt-8 leading-relaxed">
            Your Player ID Card is your official credential for participating in TourneyHub tournaments. Valid for one year from purchase date. Renew anytime to maintain continuous access.
          </Text>
        </View>

        {/* Purchase Button */}
        <View className="px-6 pb-8">
          <Pressable
            onPress={handlePurchase}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View className="bg-[#39FF14] rounded-2xl py-4 px-6 flex-row items-center justify-center gap-3">
              <IconSymbol size={24} name="cart.fill" color="#000000" />
              <Text className="text-black font-bold text-lg">Purchase for $15</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

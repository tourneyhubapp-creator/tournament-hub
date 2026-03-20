import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function CoachIDCardScreen() {
  const handlePurchase = () => {
    // TODO: Implement purchase flow
    alert("Purchase Coach ID Card - $15 for 365 days");
  };

  return (
    <ScreenContainer className="bg-black flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        {/* Header with Icon and Title */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-4 mb-2">
            {/* Orange Whistle Icon Square */}
            <View className="w-16 h-16 rounded-2xl bg-orange-500 items-center justify-center">
              <Text className="text-4xl">🏆</Text>
            </View>
            <View className="flex-1">
              <Text className="text-4xl font-bold text-white">Coach ID Card</Text>
            </View>
          </View>
          <Text className="text-gray-400 text-base mt-2">
            Official coaching credential for sideline access and team management
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
          <View className="w-24 h-24 rounded-3xl bg-orange-500 items-center justify-center mx-auto mb-8">
            <Text className="text-5xl">🏆</Text>
          </View>

          {/* Benefits List */}
          <View className="gap-5">
            {/* Benefit 1 */}
            <View className="flex-row items-start gap-4">
              <View className="w-8 h-8 rounded-full bg-[#39FF14] items-center justify-center mt-1">
                <Text className="text-black font-bold text-lg">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Verified coach credential</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Official recognition as a certified coach
                </Text>
              </View>
            </View>

            {/* Benefit 2 */}
            <View className="flex-row items-start gap-4">
              <View className="w-8 h-8 rounded-full bg-[#39FF14] items-center justify-center mt-1">
                <Text className="text-black font-bold text-lg">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Sideline access at events</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Full access to coaching areas during tournaments
                </Text>
              </View>
            </View>

            {/* Benefit 3 */}
            <View className="flex-row items-start gap-4">
              <View className="w-8 h-8 rounded-full bg-[#39FF14] items-center justify-center mt-1">
                <Text className="text-black font-bold text-lg">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Team management tools</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Manage rosters, stats, and team communications
                </Text>
              </View>
            </View>
          </View>

          {/* Description Text */}
          <Text className="text-gray-400 text-sm mt-8 leading-relaxed">
            Your Coach ID Card grants you official coaching credentials and full sideline access at all TourneyHub events. Valid for one year from purchase date. Renew anytime to maintain continuous access and coaching privileges.
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

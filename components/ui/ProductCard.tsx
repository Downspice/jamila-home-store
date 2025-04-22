import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { COLORS, FONTS, SHADOWS, SPACING } from "@/constants/theme";
import GlassmorphicCard from "./GlassmorphicCard";

interface ProductCardProps {
  id: string;
  name: string;
  images: string[];
  likeCount: number;
  isLiked?: boolean;
  onPress: () => void;
  onLike?: () => void;
  style?: any;
  index?: number;
}

export default function ProductCard({
  id,
  name,
  images,
  likeCount,
  isLiked = false,
  onPress,
  onLike,
  style,
  index = 0,
}: ProductCardProps) {
  // Ensure we have a valid image URL
  const imageUrl =
    images?.length > 0
      ? images[0]
      : "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg";

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[styles.container, style]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.touchable}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
      </TouchableOpacity>
      <GlassmorphicCard style={styles.infoCard}>
        <Text style={styles.name} numberOfLines={1}>
          {name} 
        </Text>

        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={onLike}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.heartButton}
          >
            <Heart
              size={18}
              color={isLiked ? COLORS.error : COLORS.white}
              fill={isLiked ? COLORS.error : "transparent"}
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likeCount}</Text>
        </View>
      </GlassmorphicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    ...SHADOWS.medium,
    margin: SPACING.xs,
  },
  touchable: {
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  infoCard: {
    // position: "absolute",
    bottom: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  name: {
    color: COLORS.black,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    flexShrink: 1,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartButton: {
    padding: 4,
  },
  likeCount: {
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    marginLeft: 4,
  },
});

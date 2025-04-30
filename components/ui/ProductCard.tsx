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
          cachePolicy="memory-disk"
          placeholder={COLORS.black10}
        />
      </TouchableOpacity>
      <View style={styles.infoCard}>
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
              color={isLiked ? COLORS.error : COLORS.black10}
              fill={isLiked ? COLORS.error : COLORS.black10}
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likeCount}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  touchable: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  infoCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    borderRadius: 0,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white + "90",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  name: {
    color: COLORS.black,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    flex: 1,
    marginRight: SPACING.sm,
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
    fontSize: 14,
    marginLeft: 4,
  },
});

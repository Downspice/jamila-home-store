import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { COLORS, SHADOWS, SPACING } from "@/constants/theme";

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
  disabled?: boolean;
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
  disabled,
}: ProductCardProps) {
  const imageUrl =
    images?.length > 0
      ? images[0]
      : "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg";

  const [isProcessing, setIsProcessing] = React.useState(disabled);

  const handleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await onLike?.(); // Call the like logic passed from parent
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[styles.container, style]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.touchable}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />

        <TouchableOpacity onPress={handleLike} style={styles.heart}>
          <Heart
            size={20}
            color={isLiked ? COLORS.error : COLORS.white}
            // color={disabled ? COLORS.error : ''}
            fill={isLiked ? COLORS.error : "transparent"}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Name and Like Info Below Image */}
      <View style={styles.infoCard}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.likeRow}>
          <Heart
            size={14}
            color={isLiked ? COLORS.error : COLORS.black10}
            fill={isLiked ? COLORS.error : "transparent"}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: "48%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.white,
     
  },
  touchable: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  heart: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: COLORS.black + "99",
    padding: 6,
    borderRadius: 999,
  },
  infoCard: {
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    color: COLORS.black,
    fontFamily: "Poppins-small",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    marginLeft: 4,
  },
});

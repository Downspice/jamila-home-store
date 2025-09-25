import React, { useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  Platform,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useProductsByCategory } from "@/hooks/useProducts";
import { useCategoryDetail } from "@/hooks/useCategories";
import { useLikes } from "@/hooks/useLikes";
import ProductCard from "@/components/ui/ProductCard";
import Header from "@/components/shared/Header";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { category } = useCategoryDetail(id as string);
  const { products } = useProductsByCategory(id);
  const { toggleLike, isLiked, fetchLikedProducts } = useLikes();
  const { width: screenWidth } = useWindowDimensions();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleLikePress = async (productId: string) => {
    await toggleLike(productId);
  };

  // Responsive Grid Logic
  const minCardWidth = 200;
  const cardSpacing = SPACING.md;
  const horizontalPadding = SPACING.lg * 2;
  const availableWidth = screenWidth - horizontalPadding;
  const numColumns = Math.max(
    2,
    Math.floor(availableWidth / (minCardWidth + cardSpacing))
  );
  const cardWidth =
    (availableWidth - cardSpacing * (numColumns - 1)) / numColumns;

  useFocusEffect(
    useCallback(() => {
      fetchLikedProducts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        title={category?.name || "Category"}
        showBackButton
        showSearch
        onSearchPress={() => router.push("/search")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        overScrollMode="never"
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     tintColor={COLORS.primary}
        //   />
        // }
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify().damping(15).stiffness(100)}
          style={styles.content}
        >
          <View style={styles.productsGrid}>
            {products.map((product, index) => (
              <View
                key={product.id + index}
                style={{
                  width: cardWidth,
                  marginBottom: SPACING.md,
                  marginRight:
                    (index + 1) % numColumns === 0 ? 0 : cardSpacing,
                  marginHorizontal: cardSpacing / 2,
                }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  images={product.images}
                  likeCount={product.like_count}
                  isLiked={isLiked(product.id)}
                  onPress={() => handleProductPress(product.id)}
                  onLike={() => handleLikePress(product.id)}
                  index={index}
                />
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5ed" ,
  },
  content: {
    flex: 1,
  },
  description: {
    fontFamily: Platform.OS === 'android' ? "Poppins-Regular" : "Poppins",
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  list: {
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxl,
  },
  emptyText: {
    fontFamily: Platform.OS === 'android' ? "Poppins-Medium" : "Poppins",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    marginHorizontal: -SPACING.md / 2, // to balance horizontal spacing
    alignContent: "flex-start", // helps Android wrap like iOS
  },
});

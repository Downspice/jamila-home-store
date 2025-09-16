import React, { useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useProducts, useProductsByCategory } from "@/hooks/useProducts";
import { useCategoryDetail } from "@/hooks/useCategories";
import { useLikes } from "@/hooks/useLikes";
import ProductCard from "@/components/ui/ProductCard";
import Header from "@/components/shared/Header";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { category, loading: categoryLoading } = useCategoryDetail(
    id as string
  );
  const { products, loading: productsLoading } = useProductsByCategory(id);
  const { toggleLike, isLiked, fetchLikedProducts } = useLikes();
  const { width: screenWidth } = useWindowDimensions();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleLikePress = async (productId: string) => {
    await toggleLike(productId);
  };

  // const renderItem = ({ item, index }: any) => (
  //   <ProductCard
  //     id={item.id}
  //     name={item.name}
  //     images={item.images}
  //     likeCount={item.like_count}
  //     isLiked={isLiked(item.id)}
  //     onPress={() => handleProductPress(item.id)}
  //     onLike={() => handleLikePress(item.id)}
  //     style={styles.productCard}
  //     index={index}
  //   />
  // );

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
      // refreshControl={
      // <RefreshControl
      //   refreshing={refreshing}
      //   onRefresh={onRefresh}
      //   tintColor={COLORS.primary}
      // />
      // }
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.content}
        >
          <View style={styles.productsGrid}>
            {products.map((product, index) => (
              <View
                key={product.id + index}
                style={{
                  width: cardWidth,
                  marginBottom: SPACING.md,
                  marginRight: (index + 1) % numColumns === 0 ? 0 : cardSpacing,
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

          {/* <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            category?.description ? (
              <Text style={styles.description}>
                {/* {category.description} */}
          {/* </Text>
            ) : null
          }
          ListEmptyComponent={
            !productsLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No products found in this category
                </Text>
              </View>
            ) : null
          }
        /> */}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  content: {
    flex: 1,
    // padding: SPACING.lg,
  },
  description: {
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
  },
});

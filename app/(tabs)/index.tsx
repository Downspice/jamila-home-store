import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLikes } from "@/hooks/useLikes";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import CategorySkeleton from "@/components/ui/CategorySkeleton";
import { CategorySection } from "@/components/CategorySection";
import Header from "@/components/shared/Header";
import Animated, { FadeInDown } from "react-native-reanimated";
import AllProducts from "@/components/sections/allProducts";

const imageCache = new Map<string, string>();

export default function HomeScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const {
    products,
    loading,
    refreshing,
    onRefresh,
    loadMore,
    hasMore,
    refetch,
  } = useProducts();

  const { categories, loading: categoriesLoading } = useCategories();
  const {
    isLiked,
    getLikeCount,
    toggleLike,
    isProcessing,
    fetchLikedProducts,
  } = useLikes();

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

  const handleProductPress = (id: string) => router.push(`/product/${id}`);
  const handleCategoryPress = (id: string) => router.push(`/category/${id}`);

  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikedProducts();
    }, [])
  );

  useEffect(() => {
    if (products) {
      products.forEach((product) => {
        if (product.images && product.images.length > 0) {
          const imageUrl = product.images[0];
          if (!imageCache.has(imageUrl)) {
            imageCache.set(imageUrl, imageUrl);
          }
        }
      });
    }
  }, [products]);

  const renderCategoryItem = ({ item, index }: any) => (
    <CategoryCard
      id={item.id}
      name={item.name}
      image={item.image_url}
      onPress={() => handleCategoryPress(item.id)}
      index={index}
    />
  );

  const renderItem = ({ item, index }: any) => (
    <View
      key={item.id}
      style={{
        width: cardWidth,
        marginBottom: SPACING.md,
        marginRight: (index + 1) % numColumns === 0 ? 0 : cardSpacing,
      }}
    >
      <ProductCard
        id={item.id}
        name={item.name}
        images={item.images}
        likeCount={getLikeCount(item.id)}
        isLiked={isLiked(item.id)}
        onPress={() => handleProductPress(item.id)}
        onLike={() => toggleLike(item.id)}
        disabled={isProcessing(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title=""
        showBackButton={false}
        transparent={false}
        showSearchBar={true}
        showProfile={true}
        onSearchPress={() => router.push("/search")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            {categoriesLoading ? (
              <CategorySkeleton count={2} />
            ) : (
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
            )}
          </Animated.View>

          {!categoriesLoading &&
            categories.map((category) => (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(400).springify()}
                style={styles.section}
              >
                <CategorySection category={category} />
              </Animated.View>
            ))}

          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Products</Text>
            </View>
            <AllProducts />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: Platform.OS === "android" ? SPACING.sm : SPACING.xs,
    paddingTop: Platform.OS === "android" ? 4 : 0,
  },
  sectionTitle: {
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    lineHeight: 26,
    color: COLORS.textPrimary,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
});

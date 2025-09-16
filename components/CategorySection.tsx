import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Category, Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { useLikes } from "@/hooks/useLikes";
import { COLORS, SPACING } from "@/constants/theme";
import { ArrowBigRightDash } from "lucide-react-native";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const router = useRouter();
  const { products, loading } = useProductsByCategory(category.id);
  const {
    toggleLike,
    isLiked,
    getLikeCount,
    isProcessing,
    fetchLikedProducts,
  } = useLikes();

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikedProducts();
    }, [])
  );

  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <ProductCard
      key={item.id}
      id={item.id}
      name={item.name}
      images={item.images}
      isLiked={isLiked(item.id)}
      onPress={() => handleProductPress(item.id)}
      style={styles.card}
      index={index}
      likeCount={getLikeCount(item.id)}
      onLike={() => handleLikePress(item.id)}
      disabled={isProcessing(item.id)}
    />
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonLineWide} />
        <View style={styles.skeletonLineShort} />
      </View>
    </View>
  );

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{category.name}</Text>
        <Link href={`/category/${category.id}`} asChild>
          <Pressable style={styles.seeMore}>
            <Text style={styles.seeAllButton}>See More</Text>
            <ArrowBigRightDash color={COLORS.primary} size={18} />
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={loading ? [1, 2, 3, 4] : products}
        renderItem={loading ? renderSkeleton : renderProduct}
        keyExtractor={(item, index) =>
          typeof item === "object" ? item.id : `skeleton-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Playfair-Bold",
    color: COLORS.textPrimary,
  },
  seeMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: COLORS.primary,
    marginRight: 4,
  },
  flatListContent: {
    paddingHorizontal: SPACING.md,
  },
  card: {
    width: 200,
    marginRight: SPACING.md,
  },
  skeletonCard: {
    width: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    marginRight: SPACING.md,
  },
  skeletonImage: {
    height: 180,
    backgroundColor: "#e0e0e0",
  },
  skeletonTextContainer: {
    padding: 10,
  },
  skeletonLineWide: {
    height: 14,
    backgroundColor: "#e0e0e0",
    width: "80%",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: "#e0e0e0",
    width: "50%",
    borderRadius: 4,
  },
});

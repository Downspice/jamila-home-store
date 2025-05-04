import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Category, Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { useLikes } from "@/hooks/useLikes";
import { COLORS, SPACING } from "@/constants/theme";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const router = useRouter();
  const { products, loading } = useProductsByCategory(category.id);
  const { toggleLike, isLiked } = useLikes();

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <ProductCard
      key={item.id}
      id={item.id}
      name={item.name}
      images={item.images}
      likeCount={item.like_count}
      isLiked={isLiked(item.id)}
      onPress={() => handleProductPress(item.id)}
      onLike={() => handleLikePress(item.id)}
      style={styles.card}
      index={index}
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
    <View style={{ marginBottom: SPACING.xl }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{category.name}</Text>
        <Link href={`/category/${category.id}`} asChild>
          <Pressable>
            <Text style={styles.seeAllButton}>See More</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={loading ? [1, 2, 3, 4, 5] : products}
        renderItem={loading ? renderSkeleton : renderProduct}
        horizontal
        keyExtractor={(item, index) =>
          typeof item === "object" ? item.id : index.toString()
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  seeAllButton: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.primary,
  },
  card: {
    width: 200,
    marginRight: 16,
  },
  skeletonCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  skeletonImage: {
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  skeletonTextContainer: {
    padding: 10,
  },
  skeletonLineWide: {
    height: 14,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    width: "80%",
    borderRadius: 4,
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: "#e0e0e0",
    width: "50%",
    borderRadius: 4,
  },
});

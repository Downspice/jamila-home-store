import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Category, Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { useLikes } from "@/hooks/useLikes";
import { COLORS, SPACING } from "@/constants/theme";
import { useRouter } from "expo-router";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
}) => {
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
      style={{ width: 200, marginRight: 16 }}
      index={index}
    />
  );

  const renderSkeleton = () => (
    <View className="w-[200px] mr-4">
      <View className="bg-gray-200 rounded-lg h-40 animate-pulse" />
      <View className="p-2">
        <View className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
        <View className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </View>
    </View>
  );

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3 px-4">
        <Text className="text-lg font-bold"></Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{category.name}</Text>

        <Link href={`/category/${category.id}`} asChild>
          <Pressable>
            <Text style={styles.seeAllButton}>See More</Text>
          </Pressable>
        </Link>
      </View>

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={renderSkeleton}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
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
    marginBottom: SPACING.sm,
  },
  seeAllButton: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.primary,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
});
import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Category, Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { useLikes } from "@/hooks/useLikes";
import { COLORS, SPACING } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { ArrowBigRightDash } from "lucide-react-native";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
}) => {
  const router = useRouter();
  const { products, loading } = useProductsByCategory(category.id);
  const { toggleLike, isLiked, getLikeCount, isProcessing } = useLikes();

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
      isLiked={isLiked(item.id)}
      onPress={() => handleProductPress(item.id)}
      style={styles.card}
      index={index}
      likeCount={getLikeCount(item.id)}
      onLike={() => toggleLike(item.id)}
      disabled={isProcessing(item.id)} // optional if you want to block spam
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
    <View style={styles.row}>
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{category.name}</Text>
          <Link href={`/category/${category.id}`} asChild>
            <Pressable
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.seeAllButton}>See More</Text>
              <ArrowBigRightDash color={COLORS.primary} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    // backgroundColor: COLORS.white, // or another color; must be non-transparent
    // borderColor: COLORS.screenBackground,
    // borderWidth: 1,
    // borderRadius: 12,
    // padding: 16, // ensures the content is not flush with edges
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // Android shadow
  },
  container: {
    marginBottom: SPACING.sm,
    // backgroundColor: COLORS.primary + "20",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xs,
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

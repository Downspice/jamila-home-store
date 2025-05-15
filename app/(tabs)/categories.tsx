import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useCategories } from "@/hooks/useCategories";
import Header from "@/components/shared/Header";
import GlassmorphicCard from "@/components/ui/GlassmorphicCard";
import Animated, { FadeInDown } from "react-native-reanimated";
import CategoryCard from "@/components/ui/CategoryCard";
import CategorySkeleton from "@/components/ui/CategorySkeleton";

export default function CategoriesScreen() {
  const router = useRouter();
  const {
    categories,
    loading: categoriesLoading,
    error,
    refreshing,
    onRefresh,
  } = useCategories();

  const handleCategoryPress = (id: string) => {
    router.push(`/category/${id}`);
  };

  const renderCategoryItem = ({ item, index }: any) => (
    <CategoryCard
      id={item.id}
      name={item.name}
      image={item.image_url}
      onPress={() => handleCategoryPress(item.id)}
      index={index}
      style={{ margin: 10 }}
    />
  );
  const { width: screenWidth } = useWindowDimensions();

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

  return (
    <View style={styles.container}>
      <Header title="Categories" />
      <View style={styles.productsGrid}>
        {categories.map((category, index) => (
          <View
            key={category.id}
            style={{
              width: cardWidth,
              marginBottom: SPACING.md,
              marginRight: (index + 1) % numColumns === 0 ? 0 : cardSpacing,
            }}
          >
            <CategoryCard
              id={category.id}
              name={category.name}
              image={category.image_url}
              onPress={() => handleCategoryPress(category.id)}
              index={index}
              style={{ margin: 10 }}
            />
          </View>
        ))}
        {categoriesLoading ? <CategorySkeleton count={4} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5ed",
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
  },
  description: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  list: {
    paddingBottom: 120, // Space for tab bar
  },
  categoryCard: {
    flex: 1,
    margin: SPACING.xs,
    height: 150,
    maxWidth: "50%",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    margin: SPACING.xs,
    height: 150,
    maxWidth: "50%",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: SPACING.sm,
  },
  name: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  categoriesList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: SPACING.xxl,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, //
  },
});

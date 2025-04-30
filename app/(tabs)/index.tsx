import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLikes } from "@/hooks/useLikes";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import CategorySkeleton from "@/components/ui/CategorySkeleton";
import { CategorySection } from "@/components/CategorySection";
import SearchBar from "@/components/shared/SearchBar";
import Header from "@/components/shared/Header";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Search } from "lucide-react-native";
import { Image as ExpoImage } from 'expo-image';

// Cache for product images
const imageCache = new Map<string, string>();

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {
    products,
    loading: productsLoading,
    error,
    refreshing,
    onRefresh,
  } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { toggleLike, isLiked } = useLikes();

  // Preload and cache images
  useEffect(() => {
    if (products) {
      products.forEach(product => {
        if (product.images && product.images.length > 0) {
          const imageUrl = product.images[0];
          if (!imageCache.has(imageUrl)) {
            imageCache.set(imageUrl, imageUrl);
          }
        }
      });
    }
  }, [products]);

  const handleSearch = () => {
    router.push("/search");
  };

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleCategoryPress = (id: string) => {
    router.push(`/category/${id}`);
  };

  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  const renderCategoryItem = ({ item, index }: any) => (
    <CategoryCard
      id={item.id}
      name={item.name}
      image={item.image_url}
      onPress={() => handleCategoryPress(item.id)}
      index={index}
    />
  );

  return (
    <View style={styles.container}>
      
      <Header title="" 
      showBackButton={false} 
      transparent = {false}
      showSearchBar = {true}
      showProfile = {true}

      onSearchPress={handleSearch}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
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
              <CategorySkeleton count={4} />
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

          {!categoriesLoading && categories.map((category) => (
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
              <TouchableOpacity onPress={() => router.push("/search")}>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productsGrid}>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  images={product.images}
                  likeCount={product.like_count}
                  isLiked={isLiked(product.id)}
                  onPress={() => handleProductPress(product.id)}
                  onLike={() => handleLikePress(product.id)}
                  index={index}
                />
              ))}
            </View>
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
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
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
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  }
});

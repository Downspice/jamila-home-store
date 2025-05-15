import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { Product, useProducts } from "@/hooks/useProducts";
import { useLikes } from "@/hooks/useLikes";
import ProductCard from "@/components/ui/ProductCard";
import Header from "@/components/shared/Header";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import UnAuthenticatedScreen from "@/components/ui/UnauthenticatedScreen";

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchAllProducts, loading } = useProducts();
  const {
    likedProducts,
    loading: likesLoading,
    error,
    refreshing,
    onRefresh,
    isLiked,
    getLikeCount,
    toggleLike,
    isProcessing,
  } = useLikes();

const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchAllProducts();
      if (data) setProducts(data);
    };

    loadProducts();
  }, []);

  let likedProductsList: typeof products = [];

if (products && likedProducts && Array.isArray(likedProducts)) {
  // console.log("all products:", products);
  likedProductsList = products.filter((product) => {
    const isLiked = likedProducts.includes(product.id);
    // console.log(`Product ${product.id} is liked: ${isLiked}`);
    return isLiked;
  });
}


  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Favorites" showBackButton={false} />
        <UnAuthenticatedScreen page={"Favorites"} />
      </View>
    );
  }

  // if (likedProductsList.length === 0) {
  //   return (
  //     <View style={styles.container}>
  //       <Header title="Favorites" showBackButton={false} />
  //       <ScrollView
  //         style={styles.content}
  //         showsVerticalScrollIndicator={false}
  //         refreshControl={
  //           <RefreshControl
  //             refreshing={refreshing}
  //             onRefresh={onRefresh}
  //             tintColor={COLORS.primary}
  //           />
  //         }
  //       >
  //         <Text style={styles.message}>No favorites yet</Text>
  //       </ScrollView>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <Header title="Favorites" />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.grid}>
          {likesLoading ?? <ProductSkeleton />}
          {likedProductsList? likedProductsList.map((product, index) => (
            <Animated.View
              key={product.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                images={product.images}
                isLiked={true}
                onPress={() => handleProductPress(product.id)}
                style={styles.productCard}
                index={index}
                likeCount={getLikeCount(product.id)}
                onLike={() => toggleLike(product.id)}
                disabled={isProcessing(product.id)} // optional if you want to block spam
              />
            </Animated.View>
          )): null}
        </View>
      </ScrollView>
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
    padding: SPACING.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    flex: 1,
    margin: SPACING.xs,
    width: 160,
    maxWidth: "100%",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  loginMessage: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  loginButton: {
    width: 150,
  },
  message: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
});

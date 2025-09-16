import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
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
  const { products, loading } = useProducts();
  const {
    likedProducts,
    loading: likesLoading,
    error,
    refreshing,
    onRefresh,
    isLiked,
    getLikeCount,
    toggleLike,
    isProcessing, fetchLikedProducts
  } = useLikes();

  const { width: screenWidth } = useWindowDimensions();
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


  useFocusEffect(
    useCallback(() => {
      fetchLikedProducts();
    }, [])
  );

  const renderItem = ({ item, index }: any) => (
    <Animated.View
      key={item.id + index}
      entering={FadeInDown.delay(index * 100).springify()}
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
        isLiked={true}
        onPress={() => handleProductPress(item.id)}
        onLike={() => toggleLike(item.id)}
        disabled={isProcessing(item.id)}
      />
    </Animated.View>
  )

  return (
    <View style={styles.container}>
      <Header title="Favorites" />
      <FlatList
        data={likedProductsList || []}
        keyExtractor={(item, index) => item.id + index}
        numColumns={numColumns}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          likesLoading ? (
            <ProductSkeleton />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No liked products yet.
            </Text>
          )
        }
        // onEndReached={() => {
        //   if (hasMore && !loading) {
        //     loadMore()
        //   }
        // }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <Text style={{ textAlign: "center", padding: 16 }}>Loading...</Text>
          ) : null
        }
      />
    </View>
  )
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
    margin: SPACING.sm,
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

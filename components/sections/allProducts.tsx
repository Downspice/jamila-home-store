import React from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLikes } from "@/hooks/useLikes";
import ProductCard from "@/components/ui/ProductCard";

export default function AllProducts() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { products, loading, refreshing, onRefresh, loadMore, hasMore } =
    useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { isLiked, getLikeCount, toggleLike, isProcessing } = useLikes();
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
        id={item.id + index }
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
    <View style={{ flex: 1 }}> 
      <FlatList
        data={products}
        keyExtractor={(item,index) => item.id + index}
        numColumns={numColumns}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingBottom: SPACING.xl,
        }}
        onEndReached={() => {
          if (hasMore && !loading) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListFooterComponent={
          loading ? (
            <Text style={{ textAlign: "center", padding: 16 }}>Loading...</Text>
          ) : null
        }
        // ListHeaderComponent={ 
        // }
      />
    </View>
  );
}


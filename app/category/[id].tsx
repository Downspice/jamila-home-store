import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryDetail } from '@/hooks/useCategories';
import { useLikes } from '@/hooks/useLikes';
import ProductCard from '@/components/ui/ProductCard';
import Header from '@/components/shared/Header';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { category, loading: categoryLoading } = useCategoryDetail(id as string);
  const { products, loading: productsLoading } = useProducts(id as string);
  const { toggleLike, isLiked } = useLikes();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleLikePress = async (productId: string) => {
    await toggleLike(productId);
  };

  const renderItem = ({ item, index }: any) => (
    <ProductCard
      id={item.id}
      name={item.name}
      images={item.images}
      likeCount={item.like_count}
      isLiked={isLiked(item.id)}
      onPress={() => handleProductPress(item.id)}
      onLike={() => handleLikePress(item.id)}
      style={styles.productCard}
      index={index}
    />
  );

  return (
    <View style={styles.container}>
      <Header 
        title={category?.name || 'Category'} 
        showBackButton 
        showSearch
        onSearchPress={() => router.push('/search')}
      />
      
      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.content}
      >
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            category?.description ? (
              <Text style={styles.description}>
                {/* {category.description} */}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !productsLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No products found in this category
                </Text>
              </View>
            ) : null
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  list: {
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
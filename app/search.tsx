import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useLikes } from '@/hooks/useLikes';
import SearchBar from '@/components/shared/SearchBar';
import Header from '@/components/shared/Header';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialQuery = typeof params.query === 'string' ? params.query : '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { products, loading } = useProducts(activeCategory || undefined, debouncedQuery);
  const { categories } = useCategories();
  const { toggleLike, isLiked } = useLikes();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  const toggleCategory = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
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
      <Header title="Search" showBackButton />
      
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search furniture..."
          autoFocus={!initialQuery}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => toggleCategory(item.id)}
              variant={activeCategory === item.id ? 'primary' : 'outline'}
              size="small"
              style={styles.categoryButton}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(500)} style={styles.resultsContainer}>
            {products.length > 0 ? (
              <>
                <Text style={styles.resultsText}>
                  {products.length} {products.length === 1 ? 'result' : 'results'} found
                </Text>
                <FlatList
                  data={products}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={styles.list}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No products found for "{debouncedQuery}"
                </Text>
                <Text style={styles.emptySubText}>
                  Try searching with different keywords or browse categories
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  filtersContainer: {
    paddingVertical: SPACING.sm,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryButton: {
    marginRight: SPACING.sm,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  list: {
    paddingBottom: SPACING.xxl,
  },
  productCard: {
    flex: 1,
    margin: SPACING.xs,
    maxWidth: '50%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useSearch } from '@/hooks/useSearch';
import Header from '@/components/shared/Header';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Search, X } from 'lucide-react-native';
import ProductCard from '@/components/ui/ProductCard';
import { useLikes } from '@/hooks/useLikes';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { 
    results, 
    loading, 
    error, 
    refreshing, 
    onRefresh 
  } = useSearch(query);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const clearSearch = () => {
    setQuery('');
  };
  const { toggleLike, isLiked } = useLikes();
  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  return (
    <View style={styles.container}>
      <Header title="Search" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
          
        </View>
      </View>

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
          {results.map((product, index) => (
            <Animated.View
              key={product.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handleProductPress(product.id)}
              >
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
              </TouchableOpacity>
            </Animated.View>
          ))}
          {results.length === 0 && (
            <Text style={styles.noResults}>Oh sorry, we couldn't find what you were looking for.</Text>
          )}
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
  searchContainer: {
    padding: SPACING.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    margin: SPACING.xs,
    height: 150,
    maxWidth: '50%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: SPACING.sm,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  noResults: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  }
});
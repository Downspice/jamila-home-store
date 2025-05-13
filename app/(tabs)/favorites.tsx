import React from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useProducts } from '@/hooks/useProducts';
import { useLikes } from '@/hooks/useLikes';
import ProductCard from '@/components/ui/ProductCard';
import Header from '@/components/shared/Header';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import UnAuthenticatedScreen from '@/components/ui/UnauthenticatedScreen';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const { likedProducts, toggleLike, isLiked, loading: likesLoading, error, refreshing, onRefresh } = useLikes();
  
  // Filter products to only show liked ones
  const likedProductsList = products.filter(product => 
    likedProducts.includes(product.id)
  );

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
        <UnAuthenticatedScreen/>
      </View>
    );
  }

  if (loading) {
    return <ProductSkeleton />;
  }

  if (likedProductsList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No favorites yet</Text>
      </View>
    );
  }

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
          {likedProductsList.map((product, index) => (
            <Animated.View
              key={product.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                images={product.images}
                likeCount={product.like_count}
                isLiked={true}
                onPress={() => handleProductPress(product.id)}
                onLike={() => handleLikePress(product.id)}
                style={styles.productCard}
                index={index}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f5ed',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    margin: SPACING.xs,
    width: 160,
    maxWidth: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loginMessage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  loginButton: {
    width: 150,
  },
  message: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});
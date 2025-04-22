import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useProducts } from '@/hooks/useProducts';
import { useLikes } from '@/hooks/useLikes';
import ProductCard from '@/components/ui/ProductCard';
import Header from '@/components/shared/Header';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const { likedProducts, toggleLike, isLiked } = useLikes();
  
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

  const renderItem = ({ item, index }: any) => (
    <ProductCard
      id={item.id}
      name={item.name}
      images={item.images}
      likeCount={item.like_count}
      isLiked={true} // All products here are liked
      onPress={() => handleProductPress(item.id)}
      onLike={() => handleLikePress(item.id)}
      style={styles.productCard}
      index={index}
    />
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Favorites" showBackButton={false} />
        <View style={styles.centerContent}>
          <Text style={styles.loginMessage}>Please sign in to view your favorites</Text>
          <Button 
            title="Sign In" 
            onPress={() => router.push('/login')} 
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Favorites" showBackButton={false} />
      
      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.content}
      >
        <FlatList
          data={likedProductsList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            likedProductsList.length > 0 ? (
              <Text style={styles.description}>
                Your favorite furniture items
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You haven't liked any products yet.
                </Text>
                <Text style={styles.emptySubText}>
                  Browse our collection and heart items you love!
                </Text>
                <Button 
                  title="Browse Products" 
                  onPress={() => router.push('/')} 
                  style={styles.browseButton}
                  variant="primary"
                />
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
    textAlign: 'center',
  },
  list: {
    paddingBottom: 120, // Space for tab bar
  },
  productCard: {
    flex: 1,
    margin: SPACING.xs,
    maxWidth: '50%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
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
    marginBottom: SPACING.xl,
  },
  browseButton: {
    marginTop: SPACING.md,
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
});
import React from 'react';
import { StyleSheet, View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useCatalogDetail } from '@/hooks/useCatalogs';
import ProductCard from '@/components/ui/ProductCard';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Edit, Trash2 } from 'lucide-react-native';

export default function CatalogDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { 
    catalog, 
    loading, 
    removeProductFromCatalog,
    renameCatalog 
  } = useCatalogDetail(id as string);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleRemoveProduct = async (productId: string) => {
    Alert.alert(
      'Remove Product',
      'Are you sure you want to remove this product from your catalog?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            const result = await removeProductFromCatalog(productId);
            if (result.error) {
              Alert.alert('Error', 'Failed to remove product');
            }
          }
        },
      ]
    );
  };

  const handleRenameCatalog = () => {
    if (!catalog) return;
    
    // This would show a modal or form for renaming in a real app
    Alert.alert(
      'Rename Catalog',
      'Enter a new name for your catalog',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rename',
          onPress: async () => {
            const result = await renameCatalog('My Updated Catalog');
            if (result.error) {
              Alert.alert('Error', 'Failed to rename catalog');
            }
          }
        },
      ]
    );
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.productContainer}>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveProduct(item.id)}
      >
        <Trash2 size={18} color={COLORS.error} />
      </TouchableOpacity>
      
      <ProductCard
        id={item.id}
        name={item.name}
        images={item.images}
        likeCount={0} // Not relevant in catalog view
        onPress={() => handleProductPress(item.id)}
        style={styles.productCard}
        index={index}
      />
    </View>
  );

  if (!catalog && !loading) {
    return (
      <View style={styles.container}>
        <Header showBackButton title="Catalog Not Found" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Catalog not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={catalog?.name || 'Catalog'} 
        showBackButton 
      />
      
      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.headerActions}
      >
        <Button
          title="Rename Catalog"
          onPress={handleRenameCatalog}
          variant="outline"
          icon={<Edit size={18} color={COLORS.primary} />}
          iconPosition="left"
          size="small"
        />
      </Animated.View>
      
      <Animated.View 
        entering={FadeInDown.delay(300).springify()}
        style={styles.content}
      >
        <FlatList
          data={catalog?.products || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No products in this catalog yet
                </Text>
                <Text style={styles.emptySubText}>
                  Browse furniture and save items to this catalog!
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  list: {
    paddingBottom: SPACING.xxl,
  },
  productContainer: {
    position: 'relative',
    flex: 1,
    margin: SPACING.xs,
    maxWidth: '50%',
  },
  productCard: {
    width: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: COLORS.white80,
    borderRadius: 20,
    padding: 8,
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
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 150,
  },
});
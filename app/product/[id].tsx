import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Share, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useProductDetail } from '@/hooks/useProducts';
import { useLikes } from '@/hooks/useLikes';
import { useCatalogs } from '@/hooks/useCatalogs';
import Header from '@/components/shared/Header';
import ImageCarousel from '@/components/shared/ImageCarousel';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useAuth } from '@/context/AuthContext';
import { Heart, Share2, Bookmark, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { product, loading } = useProductDetail(id as string);
  const { toggleLike, isLiked } = useLikes();
  const { catalogs } = useCatalogs();
  
  const [showCatalogOptions, setShowCatalogOptions] = useState(false);

  const productIsLiked = product ? isLiked(product.id) : false;

  const handleShareProduct = async () => {
    if (!product) return;
    
    try {
      const result = await Share.share({
        message: `Check out this beautiful furniture: ${product.name} from Jamila Home`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share product');
    }
  };

  const handleAddToCatalog = async (catalogId: string) => {
    if (!product) return;
    
    try {
      const { error } = await supabase
        .from('catalog_products')
        .insert({
          catalog_id: catalogId,
          product_id: product.id
        });

      if (error) throw error;

      Alert.alert('Success', 'Product added to catalog');
      setShowCatalogOptions(false);
    } catch (error) {
      console.error('Error adding product to catalog:', error);
      Alert.alert('Error', 'Failed to add product to catalog');
    }
  };

  const handleLikePress = async () => {
    if (!product) return;
    
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to like products',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    await toggleLike(product.id);
  };

  const handleSaveToCatalog = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to save to catalogs',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    if (catalogs.length === 0) {
      Alert.alert(
        'No Catalogs',
        'You don\'t have any catalogs yet. Would you like to create one?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Create Catalog', onPress: () => router.push('/catalogs') }
        ]
      );
      return;
    }
    
    setShowCatalogOptions(true);
  };

  if (!product && !loading) {
    return (
      <View style={styles.container}>
        <Header showBackButton title="Product Not Found" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Product not found</Text>
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
      <Header showBackButton transparent showSearch onSearchPress={() => router.push('/search')} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {product?.images && (
          <ImageCarousel images={product.images} height={400} />
        )}
        
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.titleContainer}
          >
            <Text style={styles.name}>{product?.name}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.likeContainer}>
                <Heart 
                  size={16} 
                  color={COLORS.textPrimary} 
                  fill={productIsLiked ? COLORS.error : 'transparent'} 
                  style={styles.likeIcon}
                />
                <Text style={styles.likeCount}>{product?.like_count || 0} likes</Text>
              </View>
              
              {product?.categories && product.categories.length > 0 && (
                <View style={styles.categoryContainer}>
                  <Tag size={16} color={COLORS.textPrimary} style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>
                    {product.categories.map(cat => cat.name).join(', ')}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.descriptionContainer}
          >
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{product?.description}</Text>
          </Animated.View>
          
          {showCatalogOptions && (
            <Animated.View 
              entering={FadeInDown.springify()}
              style={styles.catalogOptionsContainer}
            >
              <GlassmorphicCard style={styles.catalogOptionsCard}>
                <Text style={styles.catalogOptionsTitle}>Save to Catalog</Text>
                
                {catalogs.map(catalog => (
                  <TouchableOpacity
                    key={catalog.id}
                    style={styles.catalogOption}
                    onPress={() => handleAddToCatalog(catalog.id)}
                  >
                    <Bookmark size={20} color={COLORS.primary} style={styles.catalogIcon} />
                    <Text style={styles.catalogName}>{catalog.name}</Text>
                  </TouchableOpacity>
                ))}
                
                <Button
                  title="Cancel"
                  onPress={() => setShowCatalogOptions(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
              </GlassmorphicCard>
            </Animated.View>
          )}
        </View>
      </ScrollView>
      
      <LinearGradient
        colors={['transparent', COLORS.black20]}
        style={styles.actionsContainer}
      >
        <Button
          title={productIsLiked ? "Liked" : "Like"}
          onPress={handleLikePress}
          variant={productIsLiked ? "secondary" : "outline"}
          icon={
            <Heart 
              size={18} 
              color={productIsLiked ? COLORS.white : COLORS.primary} 
              fill={productIsLiked ? COLORS.white : 'transparent'} 
            />
          }
          iconPosition="left"
          style={styles.actionButton}
        />
        
        <Button
          title="Save"
          onPress={handleSaveToCatalog}
          variant="outline"
          icon={<Bookmark size={18} color={COLORS.primary} />}
          iconPosition="left"
          style={styles.actionButton}
        />
        
        <Button
          title="Share"
          onPress={handleShareProduct}
          variant="primary"
          icon={<Share2 size={18} color={COLORS.white} />}
          iconPosition="left"
          style={styles.actionButton}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 100, // Space for action buttons
  },
  titleContainer: {
    marginBottom: SPACING.xl,
  },
  name: {
    fontFamily: 'Playfair-Bold',
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  likeIcon: {
    marginRight: 4,
  },
  likeCount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  descriptionContainer: {
    marginBottom: SPACING.xl,
  },
  descriptionTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.xl,
    paddingBottom: 34,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  catalogOptionsContainer: {
    marginBottom: SPACING.xl,
  },
  catalogOptionsCard: {
    
  },
  catalogOptionsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  catalogOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black10,
  },
  catalogIcon: {
    marginRight: SPACING.md,
  },
  catalogName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  cancelButton: {
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
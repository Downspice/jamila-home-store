import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  RefreshControl, 
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import Header from '@/components/shared/Header';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CategoryCard from '@/components/ui/CategoryCard';
import CategorySkeleton from '@/components/ui/CategorySkeleton';

export default function CategoriesScreen() {
  const router = useRouter();
  const { 
    categories, 
    loading:categoriesLoading, 
    error, 
    refreshing, 
    onRefresh 
  } = useCategories();

  const handleCategoryPress = (id: string) => {
    router.push(`/category/${id}`);
  };

  const renderCategoryItem = ({ item, index }: any) => (
    <CategoryCard
      id={item.id}
      name={item.name}
      image={item.image_url}
      onPress={() => handleCategoryPress(item.id)}
      index={index}
      style={{ margin: 10 }}
    />
  );
  
  return (
    <View style={styles.container}>
      <Header title="Categories" />
      <FlatList
        style={styles.content}
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          categoriesLoading ? (
            <CategorySkeleton count={4} />
          ) : null
        }
      />
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
    padding: SPACING.sm,
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
  categoryCard: {
    flex: 1,
    margin: SPACING.xs,
    height: 150,
    maxWidth: '50%',
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
  categoriesList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xxl,
  },
});
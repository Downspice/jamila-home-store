import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/ui/CategoryCard';
import Header from '@/components/shared/Header';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, loading } = useCategories();

  const handleCategoryPress = (id: string) => {
    router.push(`/category/${id}`);
  };

  const renderItem = ({ item, index }: any) => (
    <CategoryCard
      id={item.id}
      name={item.name}
      image={item.image_url}
      onPress={() => handleCategoryPress(item.id)}
      style={styles.categoryCard}
      index={index}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Categories" showBackButton={false} showSearch={true} onSearchPress={() => router.push('/search')} />
      
      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.content}
      >
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.description}>
              Explore our carefully curated furniture categories
            </Text>
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No categories found</Text>
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
});
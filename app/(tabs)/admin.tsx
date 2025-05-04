import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/shared/Header";
import GlassmorphicCard from "@/components/ui/GlassmorphicCard";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Edit, Plus, Trash2 } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import CatalogSkeleton from "@/components/ui/CatalogSkeleton";

export default function AdminScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const {
    products,
    loading: productsLoading,
    refetch: refetchProducts,
  } = useProducts();
  const {
    categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories();

  const [selectedTab, setSelectedTab] = useState("products");

  if (!user || !isAdmin) {
    return (
      <View style={styles.container}>
        <Header title="Admin Panel" showBackButton={false} />
        <View style={styles.centerContent}>
          <Text style={styles.unauthorizedMessage}>
            You don't have permission to access the admin panel
          </Text>
        </View>
      </View>
    );
  }

  const renderProductItem = ({ item }: any) => (
    <View style={styles.itemCard}>
      <GlassmorphicCard style={styles.itemCard}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemDetails} numberOfLines={1}>
              {item.categories?.map((cat: any) => cat.name).join(", ")}
            </Text>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/edit-product/${item.id}`)}
            >
              <Edit size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteProduct(item.id)}
            >
              <Trash2 size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      </GlassmorphicCard>
    </View>
  );

  const renderCategoryItem = ({ item }: any) => (
    <View style={styles.itemCard}>
      <GlassmorphicCard style={styles.itemCard}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemDetails} numberOfLines={2}>
              {item.description || "No description"}
            </Text>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/edit-category/${item.id}`)}
            >
              <Edit size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteCategory(item.id)}
            >
              <Trash2 size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      </GlassmorphicCard>
    </View>
  );

  const handleAddProduct = () => {
    router.push("/(admin)/add-product");
  };

  const handleAddCategory = () => {
    router.push("/(admin)/add-category");
  };

  const handleDeleteProduct = async (id: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

              if (error) throw error;

              await refetchProducts();
              Alert.alert("Success", "Product deleted successfully", [
                {
                  text: "OK",
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // Check if there are products in this category
      const { data: products, error: productsError } = await supabase
        .from('product_categories')
        .select('product_id')
        .eq('category_id', id);

      if (productsError) throw productsError;

      if (products && products.length > 0) {
        // Get all available categories except the one being deleted
        const { data: otherCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .neq('id', id);

        if (categoriesError) throw categoriesError;

        if (!otherCategories || otherCategories.length === 0) {
          Alert.alert(
            'Error',
            'Cannot delete the last category. Please create another category first.'
          );
          return;
        }

        // Show dialog to select new category
        Alert.alert(
          'Reassign Products',
          'This category contains products. Please select a new category to reassign them to:',
          [
            ...otherCategories.map(category => ({
              text: category.name,
              onPress: async () => {
                try {
                  // Update all products to the new category
                  const { error: updateError } = await supabase
                    .from('product_categories')
                    .update({ category_id: category.id })
                    .eq('category_id', id);

                  if (updateError) throw updateError;

                  // Get the category's image URL before deleting
                  const { data: categoryData, error: categoryError } = await supabase
                    .from('categories')
                    .select('image_url')
                    .eq('id', id)
                    .single();

                  if (categoryError) throw categoryError;

                  // Delete the category
                  const { error: deleteError } = await supabase
                    .from('categories')
                    .delete()
                    .eq('id', id);

                  if (deleteError) throw deleteError;

                  // Delete the avatar from storage if it exists
                  if (categoryData?.image_url) {
                    const fileName = categoryData.image_url.split('/').pop();
                    if (fileName) {
                      await supabase.storage
                        .from('category-avatars')
                        .remove([`category-avatars/${fileName}`]);
                    }
                  }

                  await refetchCategories();
                  Alert.alert('Success', 'Category deleted and products reassigned successfully');
                } catch (error: any) {
                  Alert.alert('Error', error.message);
                }
              },
            })),
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else {
        // No products in this category, proceed with deletion
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('image_url')
          .eq('id', id)
          .single();

        if (categoryError) throw categoryError;

        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        // Delete the avatar from storage if it exists
        if (categoryData?.image_url) {
          const fileName = categoryData.image_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('category-avatars')
              .remove([`category-avatars/${fileName}`]);
          }
        }

        await refetchCategories();
        Alert.alert('Success', 'Category deleted successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Refetch data when screen comes into focus
      refetchProducts();
      refetchCategories();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header title="Admin Panel" showBackButton={true} />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "products" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("products")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "products" && styles.activeTabText,
            ]}
          >
            Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "categories" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("categories")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "categories" && styles.activeTabText,
            ]}
          >
            Categories
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {selectedTab === "products" ? (
          productsLoading ? (
            <CatalogSkeleton count={3} />
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.list, { paddingBottom: SPACING.xxl }]}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found</Text>
                </View>
              }
            />
          )
        ) : categoriesLoading ? (
          <CatalogSkeleton count={3} />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.list, { paddingBottom: SPACING.xxl }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No categories found</Text>
              </View>
            }
          />
        )}
      </View>

      <FloatingActionButton
        onPress={selectedTab === "products" ? handleAddProduct : handleAddCategory}
        icon={<Plus size={24} color={COLORS.white} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: 12,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  itemCard: {
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  itemDetails: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginLeft: SPACING.sm,
  },
  deleteButton: {
    backgroundColor: COLORS.error + "10",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxl,
  },
  emptyText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  unauthorizedMessage: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
});

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
import Button from "@/components/ui/Button";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Edit, Plus, Trash2 } from "lucide-react-native";
import { supabase } from "@/lib/supabase";

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
              Alert.alert("Success", "Product deleted successfully");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteCategory = async (id: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This will also remove all product associations.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("categories")
                .delete()
                .eq("id", id);

              if (error) throw error;

              await refetchCategories();
              Alert.alert("Success", "Category deleted successfully");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Refetch data when screen comes into focus
      if (selectedTab === "products") {
        refetchProducts();
      } else {
        refetchCategories();
      }
    }, [selectedTab])
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

      <View style={styles.addButtonContainer}>
        <Button
          title={selectedTab === "products" ? "Add Product" : "Add Category"}
          onPress={
            selectedTab === "products" ? handleAddProduct : handleAddCategory
          }
          icon={<Plus size={18} color={COLORS.white} />}
          iconPosition="left"
        />
      </View>

      <View style={styles.content}>
        {selectedTab === "products" ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !productsLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found</Text>
                </View>
              ) : null
            }
          />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !categoriesLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No categories found</Text>
                </View>
              ) : null
            }
          />
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
  addButtonContainer: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    // marginBottom: SPACING.betweenGlassCard,
    // paddingBottom: 70,  // Space for tab bar
    // backgroundColor: COLORS.black,
  },
  itemCard: {
    // backgroundColor: COLORS.black,
    marginBottom: 10,
    // padding: SPACING.md,
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

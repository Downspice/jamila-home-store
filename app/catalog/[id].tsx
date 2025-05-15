import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useCatalogDetail } from "@/hooks/useCatalogs";
import ProductCard from "@/components/ui/ProductCard";
import Header from "@/components/shared/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Edit, Trash2, X } from "lucide-react-native";
import { useLikes } from "@/hooks/useLikes";

export default function CatalogDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isLiked, getLikeCount, toggleLike, isProcessing } = useLikes();
  const { catalog, loading, removeProductFromCatalog, renameCatalog } =
    useCatalogDetail(id as string);

  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState("");

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleRemoveProduct = async (productId: string) => {
    Alert.alert(
      "Remove Product",
      "Are you sure you want to remove this product from your catalog?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const result = await removeProductFromCatalog(productId);
            if (result.error) {
              Alert.alert("Error", "Failed to remove product");
            }
          },
        },
      ]
    );
  };

  const handleRenamePress = () => {
    if (!catalog) return;
    setNewCatalogName(catalog.name);
    setIsRenameModalVisible(true);
  };

  const handleDismissRenameModal = () => {
    setIsRenameModalVisible(false);
    setNewCatalogName("");
  };

  const handleRenameCatalog = async () => {
    if (!catalog || !newCatalogName.trim()) return;

    try {
      const result = await renameCatalog(newCatalogName.trim());
      if (result.error) {
        Alert.alert("Error", "Failed to rename catalog");
        return;
      }
      handleDismissRenameModal();
    } catch (error) {
      console.error("Error renaming catalog:", error);
      Alert.alert("Error", "Failed to rename catalog");
    }
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
        index={index}
        likeCount={getLikeCount(item.id)}
        isLiked={isLiked(item.id)}
        onPress={() => handleProductPress(item.id)}
        onLike={() => toggleLike(item.id)}
        disabled={isProcessing(item.id)} // optional if you want to block spam
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
      <Header title={catalog?.name || "Catalog"} showBackButton />

      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.headerActions}
      >
        <Button
          title="Rename Catalog"
          onPress={handleRenamePress}
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
                  onPress={() => router.push("/")}
                  style={styles.browseButton}
                  variant="primary"
                />
              </View>
            ) : null
          }
        />
      </Animated.View>

      <Modal
        visible={isRenameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleDismissRenameModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rename Catalog</Text>
              <TouchableOpacity onPress={handleDismissRenameModal}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter a new name for your catalog
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catalog Name</Text>
              <Input
                value={newCatalogName}
                onChangeText={setNewCatalogName}
                placeholder="Enter new name"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={handleDismissRenameModal}
              />
              <Button title="Rename" onPress={handleRenameCatalog} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
    position: "relative",
    flex: 1,
    margin: SPACING.xs,
    maxWidth: "50%",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: COLORS.white80,
    borderRadius: 20,
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxl,
  },
  emptyText: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  browseButton: {
    marginTop: SPACING.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.lg,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  modalDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
});

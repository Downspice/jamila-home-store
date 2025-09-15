import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Share,
  Alert,
  Image as RNImage,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useProductDetail } from "@/hooks/useProducts";
import { useLikes } from "@/hooks/useLikes";
import { useCatalogs } from "@/hooks/useCatalogs";
import Header from "@/components/shared/Header";
import ImageCarousel from "@/components/shared/ImageCarousel";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Heart, Share2, Bookmark, Tag, PhoneCall } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import ProductDetailSkeleton from "@/components/product/ProductDetailSkeleton";
import SaveToCatalogSheet from "@/components/product/SaveToCatalogSheet";
import ProductHeader from "@/components/ui/ProductHeader";
import Pill from "@/components/ui/Pill";
import { callFn } from "@/utils/enquiryFn";
import { LikeButton } from "@/components/animatedButtons/like";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.6;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { product, loading } = useProductDetail(id as string);
  const { toggleLike, isLiked, likedProducts, isProcessing } = useLikes();
  const { catalogs, createCatalog } = useCatalogs(id as string);

  const [showCatalogSheet, setShowCatalogSheet] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const IMAGE_SECTION_HEIGHT = SCREEN_HEIGHT * 0.7;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("3x3");
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const productIsLiked = product ? likedProducts.includes(product.id) : false;

  const handleShareProduct = async () => {
    if (!product) return;

    try {
      const result = await Share.share({
        message: `Check out this beautiful furniture: ${product.name} from Jamila Home`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share product");
    }
  };

  const handleAddToCatalog = async (catalogId: string) => {
    if (!product) return;

    try {
      const { error } = await supabase.from("catalog_products").insert({
        catalog_id: catalogId,
        product_id: product.id,
      });

      if (error) throw error;

      Alert.alert("Success", "Product added to catalog");
      setShowCatalogSheet(false);
    } catch (error) {
      console.error("Error adding product to catalog:", error);
      Alert.alert("Error", "Failed to add product to catalog");
    }
  };

  const handleCreateCatalog = async (name: string) => {
    try {
      const result = await createCatalog(name);
      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating catalog:", error);
      Alert.alert("Error", "Failed to create catalog");
    }
  };

  const handleLikePress = async () => {
    if (!product) return;

    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to like products", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/login") },
      ]);
      return;
    }

    const wasLiked = productIsLiked;

    console.log("productIsLiked count", product.like_count);

    await toggleLike(product.id);

    if (wasLiked) {
      setLikeCount((prev) =>
        prev != null ? Math.max(prev - 1, 0) : (product.like_count ?? 0) - 1
      );
      router.reload();
    } else {
      setLikeCount((prev) =>
        prev != null ? prev + 1 : (product.like_count ?? 0) + 1
      );
      router.reload();
    }
  };

  const handleSaveToCatalog = () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to save to catalogs", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/login") },
      ]);
      return;
    }

    if (catalogs.length === 0) {
      Alert.alert(
        "No Catalogs",
        "You don't have any catalogs yet. Would you like to create one?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Create Catalog", onPress: () => router.push("/catalogs") },
        ]
      );
      return;
    }

    setShowCatalogSheet(true);
  };

  // Animation for preview thumbnails
  const getThumbnailAnimatedStyle = (idx: number) => {
    const isSelected = selectedImageIndex === idx;
    return {
      transform: [{ scale: isSelected ? 1.12 : 1 }],
      opacity: isSelected ? 1 : 0.7,
    };
  };

  // Animation for option buttons
  const getOptionAnimatedStyle = (option: string) => {
    const isSelected = selectedOption === option;
    return {
      transform: [{ scale: isSelected ? 1.08 : 1 }],
      backgroundColor: isSelected ? COLORS.primary : COLORS.background,
    };
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          showBackButton
          transparent
          showSearch
          onSearchPress={() => router.push("/search")}
        />
        <ProductDetailSkeleton />
      </View>
    );
  }

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
      <ProductHeader
        onBackPress={() => router.back()}
        onSharePress={handleShareProduct}
        onLikePress={() => {
          handleLikePress();
        }}
      />

      {/* Absolute Image */}
      {product?.images && (
        <RNImage
          source={{ uri: product.images[selectedImageIndex] }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer to make room for absolute image */}
        <View style={{ height: IMAGE_HEIGHT }} />

        {/* Info Card */}
        <View style={styles.infoCard}>
          {/* Thumbnails */}
          <View style={styles.thumbnailsRow}>
            {product?.images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImageIndex(idx)}
              >
                <RNImage
                  source={{ uri: img }}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === idx && styles.selectedThumbnail,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.nameRow}>
            {/* Product Name */}
            <Text style={styles.productName}>{product?.name}</Text>
            {/* Categories */}
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={() => {}}>
                {/* <Heart
                  size={20}
                  color={productIsLiked ? "transparent" : COLORS.textSecondary}
                  fill={productIsLiked ? COLORS.error : "transparent"}
                /> */}
                <LikeButton
                  liked={isLiked(product?.id)}
                  onToggle={() => handleLikePress()}
                  disabled={isProcessing(product.id)}
                />
              </TouchableOpacity>
              <Text>{likeCount == null ? product?.like_count : likeCount}</Text>
            </View>
          </View>
          {/* Like/Share */}
          <View style={styles.actionsRow}>
            {/* Categories */}
            {product?.categories?.length && (
              <View style={styles.categories}>
                <Tag size={16} color={COLORS.textPrimary} />
                {product?.categories?.map((cat) => (
                  <Pill
                    key={cat.id}
                    borderColor={COLORS.primary}
                    backgroundColor={COLORS.primaryLight}
                  >
                    <Text style={styles.categoryText}>{cat.name}</Text>
                  </Pill>
                ))}
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{product?.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => setShowCatalogSheet(true)}
          style={styles.actionButton}
        >
          <View style={styles.buttonContent}>
            <Bookmark size={18} color={COLORS.black} />
            <Text style={styles.buttonText}>Catalog</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={callFn} style={styles.actionButton}>
          <View style={styles.buttonContent}>
            <PhoneCall size={18} color={COLORS.black} />
            <Text style={styles.buttonText}>Reach Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <SaveToCatalogSheet
        isVisible={showCatalogSheet}
        onClose={() => setShowCatalogSheet(false)}
        catalogs={catalogs}
        onSelectCatalog={handleAddToCatalog}
        onCreateCatalog={handleCreateCatalog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    marginBottom: SPACING.sm,
  },
  name: {
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.lg,
  },
  likeIcon: {
    marginRight: 4,
  },
  likeCount: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryPill: {
    borderRadius: 100,
    borderStyle: "solid",
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    fontFamily: "Poppins-Medium",
    fontSize: 7,
    color: COLORS.textSecondary,
  },
  categoryText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  descriptionContainer: {
    marginBottom: SPACING.xl,
  },
  descriptionTitle: {
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
    paddingBottom: 20,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 14,
    left: "15%",
    right: "15%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: SPACING.xs,
    borderRadius: 100,
    width: "70%",
    alignSelf: "center",
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1,
    height: 40,
    borderRadius: 100,
    backgroundColor: COLORS.primary,

    // width: "50%",
  },
  catalogOptionsContainer: {
    marginBottom: SPACING.xl,
  },
  catalogOptionsCard: {},
  categoryPillContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  catalogOptionsTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  catalogOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black10,
  },
  catalogIcon: {
    marginRight: SPACING.md,
  },
  catalogName: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  cancelButton: {
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
  hidden: {
    display: "none",
  },
  imageSection: {
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: COLORS.background,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  mainImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
    width: "100%",
    zIndex: -1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
    width: "100%",
    zIndex: -1,
  },
  floatingButtonsContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  floatingButton: {
    marginHorizontal: 4,
  },
  floatingButtonCircle: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingButtonRightGroup: {
    flexDirection: "row",
    gap: 8,
  },
  previewThumbnailsContainer: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: -32,
    // zIndex: 20,
    // alignItems: 'center',
  },
  previewThumbnailsContent: {
    paddingHorizontal: 24,
    flexDirection: "row",
  },
  previewThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  previewThumbnailSelected: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  previewThumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    marginBottom: 30,
    marginTop: -24,
    height: "100%",
  },
  thumbnailsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: SPACING.sm,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  catalogButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  catalogButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productName: {
    fontFamily: "Playfair-Bold",
    fontSize: 22,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 6,
  },
  optionButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  productDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceText: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  addToCartButton: {
    backgroundColor: "#FFF59D",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  addToCartButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  optionButtonTextSelected: {
    color: COLORS.white,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonText: {
    color: COLORS.black,
    fontWeight: "600",
    fontSize: 14,
  },
  absoluteImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: COLORS.background,
  },
});

import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useSearch } from "@/hooks/useSearch";
import Header from "@/components/shared/Header";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Search, X } from "lucide-react-native";
import ProductCard from "@/components/ui/ProductCard";
import { useLikes } from "@/hooks/useLikes";
import LottieView from "lottie-react-native";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { results, loading, error, refreshing, onRefresh } = useSearch(query);
  const animation = useRef<LottieView>(null);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const clearSearch = () => {
    setQuery("");
  };
  const { toggleLike, isLiked } = useLikes();
  const handleLikePress = async (id: string) => {
    await toggleLike(id);
  };

  return (
    <View style={styles.container}>
      <Header title="Search" />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
          {query === "" ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>
                Nothing has been typed yet...
              </Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.centerContent}>
              <LottieView
                autoPlay
                ref={animation}
                style={styles.lottie}
                source={require("@/assets/lottie/searchNotFound.json")}
              />
              <Text style={styles.noResults}>
                Oh sorry, we couldn't find what you were looking for.
              </Text>
            </View>
          ) : (
            results.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.delay(index * 100).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleProductPress(product.id)}
                >
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    images={product.images}
                    likeCount={product.like_count}
                    isLiked={isLiked(product.id)}
                    onPress={() => handleProductPress(product.id)}
                    onLike={() => handleLikePress(product.id)}
                    index={index}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5ed",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  searchContainer: {
    padding: SPACING.lg,
  },
  // searchInputContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: COLORS.white,
  //   borderRadius: SPACING.sm,
  //   paddingHorizontal: SPACING.md,
  //   paddingVertical: SPACING.sm,
  // },
  // searchInput: {
  //   flex: 1,
  //   marginLeft: SPACING.sm,
  //   fontFamily: "Poppins-Regular",
  //   fontSize: 16,
  //   color: COLORS.textPrimary,
  // },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    margin: SPACING.xs,
    height: 150,
    maxWidth: "50%",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: SPACING.sm,
  },
  name: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  noResults: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 6,
  },

  lottie: {
    width: 200,
    height: 200,
    backgroundColor: "transparent",
  },

  emptyText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

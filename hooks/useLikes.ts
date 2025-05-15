import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "react-native";
import { router } from "expo-router";

export const useLikes = () => {
  const { user } = useAuth();

  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedProducts = async () => {
    if (!user) {
      setLikedProducts([]);
      setLikeCounts({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_likes")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;

      const liked = data.map((like) => like.product_id);
      setLikedProducts(liked);

      // Also fetch all like counts
      const { data: allProducts, error: productError } = await supabase
        .from("products")
        .select("id, like_count");

      if (productError) throw productError;

      const counts: Record<string, number> = {};
      allProducts?.forEach((product) => {
        counts[product.id] = product.like_count || 0;
      });

      setLikeCounts(counts);
    } catch (error: any) {
      console.error("Error fetching liked products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLikedProducts();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLikedProducts();
  }, [user]);

  const toggleLike = async (productId: string) => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to like products", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/login") },
      ]);
      return;
    }

    if (processingIds.includes(productId)) return;

    setProcessingIds((prev) => [...prev, productId]);

    const isCurrentlyLiked = likedProducts.includes(productId);
    const currentCount = likeCounts[productId] || 0;

    // Optimistic UI update
    setLikedProducts((prev) =>
      isCurrentlyLiked ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    setLikeCounts((prev) => ({
      ...prev,
      [productId]: isCurrentlyLiked ? Math.max(currentCount - 1, 0) : currentCount + 1,
    }));

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from("user_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("like_count")
          .eq("id", productId)
          .single();

        if (fetchError) throw fetchError;

        const newCount = Math.max((productData?.like_count || 1) - 1, 0);

        await supabase
          .from("products")
          .update({ like_count: newCount })
          .eq("id", productId);
      } else {
        await supabase.from("user_likes").insert({
          user_id: user.id,
          product_id: productId,
        });

        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("like_count")
          .eq("id", productId)
          .single();

        if (fetchError) throw fetchError;

        const newCount = (productData?.like_count || 0) + 1;

        await supabase
          .from("products")
          .update({ like_count: newCount })
          .eq("id", productId);
      }

      return { success: true, isLiked: !isCurrentlyLiked };
    } catch (error: any) {
      console.error("Toggle like failed:", error);

      // Revert optimistic update
      setLikedProducts((prev) =>
        isCurrentlyLiked ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      setLikeCounts((prev) => ({
        ...prev,
        [productId]: currentCount,
      }));

      return { error };
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const isLiked = (productId: string) => likedProducts.includes(productId);
  const getLikeCount = (productId: string) => likeCounts[productId] ?? 0;
  const isProcessing = (productId: string) => processingIds.includes(productId);

  return {
    likedProducts,
    likeCounts,
    loading,
    error,
    toggleLike,
    isLiked,
    getLikeCount,
    isProcessing,
    refreshing,
    onRefresh,
  };
};

import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export const useLikes = () => {
  const { user } = useAuth();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedProducts = async () => {
    if (!user) {
      setLikedProducts([]);
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

      if (error) {
        throw error;
      }

      if (data) {
        setLikedProducts(data.map((like) => like.product_id));
        console.log("Fetched liked products:", data);
      }
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
    if (!user) return { error: new Error("User not authenticated") };
  
    const isLiked = likedProducts.includes(productId);
    console.log("isLiked product is:", productId, isLiked);
  
    try {
      if (isLiked) {
        // === UNLIKE ===
        console.log("Unliking product:", productId);
  
        const { error: deleteError } = await supabase
          .from("user_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
  
        if (deleteError) throw deleteError;
  
        // Fetch current like_count
        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("like_count")
          .eq("id", productId)
          .single();
  
        if (fetchError) throw fetchError;
  
        const newCount = Math.max((productData?.like_count || 1) - 1, 0);
  
        const { error: updateError } = await supabase
          .from("products")
          .update({ like_count: newCount })
          .eq("id", productId);
  
        if (updateError) throw updateError;
  
        setLikedProducts((prev) => prev.filter((id) => id !== productId));
      } else {
        // === LIKE ===
        console.log("Liking product:", productId);
  
        const { error: insertError } = await supabase.from("user_likes").insert({
          user_id: user.id,
          product_id: productId,
        });
  
        if (insertError) throw insertError;
  
        // Fetch current like_count
        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("like_count")
          .eq("id", productId)
          .single();
  
        if (fetchError) throw fetchError;
  
        const newCount = (productData?.like_count || 0) + 1;
  
        const { error: updateError } = await supabase
          .from("products")
          .update({ like_count: newCount })
          .eq("id", productId);
  
        if (updateError) throw updateError;
  
        setLikedProducts((prev) => [...prev, productId]);
      }

      return { success: true, isLiked: !isLiked };
    } catch (error: any) {
      console.error("Error toggling like:", error);
      return { error };
    }
  };
  

  const isLiked = (productId: string) => {
    return likedProducts.includes(productId);
  };

  return {
    likedProducts,
    loading,
    error,
    toggleLike,
    isLiked,
    refreshing,
    onRefresh,
  };
};



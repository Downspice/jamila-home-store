import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export const useLikedByUser = (productId: string) => {
  const { user } = useAuth();
  const [likedByUserProducts, setLikedByUserProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedByUserProducts = async () => {
    if (!user) {
      setLikedByUserProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_likes')
        .select('product_id')
        .eq('user_id', user.id) 

      if (error) {
        throw error;
      }

      if (data) {
        setLikedByUserProducts(data.map(like => like.product_id));
      }
    } catch (error: any) {
      console.error('Error fetching liked products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLikedByUserProducts();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLikedByUserProducts();
  }, [user]);

 

  const isLikedByUser = (productId: string) => {
    return likedByUserProducts.includes(productId);
  };

  return { likedByUserProducts, loading, error, isLikedByUser, refreshing, onRefresh };
};
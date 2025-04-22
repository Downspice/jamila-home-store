import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export const useLikes = () => {
  const { user } = useAuth();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLikedProducts([]);
      setLoading(false);
      return;
    }

    const fetchLikedProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('user_likes')
          .select('product_id')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data) {
          setLikedProducts(data.map(like => like.product_id));
        }
      } catch (error: any) {
        console.error('Error fetching liked products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [user]);

  const toggleLike = async (productId: string) => {
    if (!user) return { error: new Error('User not authenticated') };
    
    const isLiked = likedProducts.includes(productId);
    
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) throw error;
        
        setLikedProducts(prev => prev.filter(id => id !== productId));
      } else {
        // Like
        const { error } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            product_id: productId
          });
        
        if (error) throw error;
        
        setLikedProducts(prev => [...prev, productId]);
      }
      
      return { success: true, isLiked: !isLiked };
    } catch (error: any) {
      console.error('Error toggling like:', error);
      return { error };
    }
  };

  const isLiked = (productId: string) => {
    return likedProducts.includes(productId);
  };

  return { likedProducts, loading, error, toggleLike, isLiked };
};
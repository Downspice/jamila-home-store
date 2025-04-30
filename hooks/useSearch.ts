import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export const useSearch = (query: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const searchProducts = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setResults(data || []);
    } catch (error: any) {
      console.error('Error searching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    searchProducts();
  }, [query]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    searchProducts();
  }, [query]);

  return { 
    results, 
    loading, 
    error, 
    refreshing,
    onRefresh,
    refetch: searchProducts
  };
}; 
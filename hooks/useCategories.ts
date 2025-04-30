import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type Category = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => 
        prev.map(category => 
          category.id === id ? { ...category, ...updates } : category
        )
      );

      return { data };
    } catch (error: any) {
      console.error('Error updating category:', error);
      return { error };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(category => category.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting category:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    error, 
    refreshing,
    onRefresh,
    refetch: fetchCategories,
    updateCategory,
    deleteCategory
  };
};

export const useCategoryDetail = (id?: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setCategory(data);
        }
      } catch (error: any) {
        console.error('Error fetching category details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
};
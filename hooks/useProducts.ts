import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  like_count: number;
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string }[];
};

export const useProducts = (categoryId?: string, searchQuery?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_categories!inner (
            category_id,
            categories (id, name)
          )
        `);

      // Filter by category if provided
      if (categoryId) {
        query = query.eq('product_categories.category_id', categoryId);
      }

      // Filter by search query if provided
      if (searchQuery && searchQuery.trim() !== '') {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Process and format the data
        const formattedProducts = data.map(item => {
          const categories = item.product_categories.map((pc: any) => ({
            id: pc.categories.id,
            name: pc.categories.name
          }));

          return {
            ...item,
            categories
          };
        });

        setProducts(formattedProducts);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          product_categories (
            categories (id, name)
          )
        `)
        .single();

      if (error) throw error;

      // Process and format the updated product
      const categories = data.product_categories.map((pc: any) => ({
        id: pc.categories.id,
        name: pc.categories.name
      }));

      const updatedProduct = {
        ...data,
        categories
      };

      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );

      return { data: updatedProduct };
    } catch (error: any) {
      console.error('Error updating product:', error);
      return { error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery]);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts,
    updateProduct,
    deleteProduct
  };
};

export const useFeaturedProducts = (limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_categories (
              categories (id, name)
            )
          `)
          .order('like_count', { ascending: false })
          .limit(limit);

        if (error) {
          throw error;
        }

        if (data) {
          // Process and format the data
          const formattedProducts = data.map(item => {
            const categories = item.product_categories.map((pc: any) => ({
              id: pc.categories.id,
              name: pc.categories.name
            }));

            return {
              ...item,
              categories
            };
          });

          setProducts(formattedProducts);
        }
      } catch (error: any) {
        console.error('Error fetching featured products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useProductDetail = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_categories (
              categories (id, name)
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Process and format the data
          const categories = data.product_categories.map((pc: any) => ({
            id: pc.categories.id,
            name: pc.categories.name
          }));

          setProduct({
            ...data,
            categories
          });
        }
      } catch (error: any) {
        console.error('Error fetching product details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
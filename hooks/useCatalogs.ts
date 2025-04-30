import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export type Catalog = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  product_count?: number;
  hasProduct?: boolean;
};

export type CatalogWithProducts = Catalog & {
  products: {
    id: string;
    name: string;
    images: string[];
  }[];
};

export const useCatalogs = (productId?: string) => {
  const { user } = useAuth();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCatalogs = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('catalogs')
        .select(`
          id,
          name,
          user_id,
          created_at,
          catalog_products (
            product_id
          )
        `)
        .eq('user_id', user.id);

      const { data, error } = await query;

      if (error) throw error;

      // Add hasProduct flag to each catalog
      const catalogsWithProductStatus = data.map(catalog => ({
        ...catalog,
        hasProduct: productId 
          ? catalog.catalog_products.some(cp => cp.product_id === productId)
          : false
      }));

      setCatalogs(catalogsWithProductStatus);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching catalogs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, productId]);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCatalogs();
  }, [fetchCatalogs]);

  const createCatalog = async (name: string) => {
    if (!user) return { error: new Error('User not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('catalogs')
        .insert({
          name,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setCatalogs(prev => [data, ...prev]);
      return { data };
    } catch (error: any) {
      console.error('Error creating catalog:', error);
      return { error };
    }
  };

  const deleteCatalog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('catalogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCatalogs(prev => prev.filter(catalog => catalog.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting catalog:', error);
      return { error };
    }
  };

  const updateCatalog = async (id: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('catalogs')
        .update({ name })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setCatalogs(prev => 
        prev.map(catalog => 
          catalog.id === id ? { ...catalog, name } : catalog
        )
      );
      
      return { data };
    } catch (error: any) {
      console.error('Error updating catalog:', error);
      return { error };
    }
  };

  return { 
    catalogs, 
    loading, 
    error, 
    refreshing,
    onRefresh,
    createCatalog, 
    deleteCatalog, 
    updateCatalog 
  };
};

export const useCatalogDetail = (id?: string) => {
  const [catalog, setCatalog] = useState<CatalogWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch catalog details
        const { data: catalogData, error: catalogError } = await supabase
          .from('catalogs')
          .select('*')
          .eq('id', id)
          .single();

        if (catalogError) {
          throw catalogError;
        }

        // Fetch catalog products
        const { data: productData, error: productError } = await supabase
          .from('catalog_products')
          .select(`
            product_id,
            products (
              id,
              name,
              images
            )
          `)
          .eq('catalog_id', id);

        if (productError) {
          throw productError;
        }

        // Format the data
        const products = productData.map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          images: item.products.images,
        }));

        setCatalog({
          ...catalogData,
          products
        });
      } catch (error: any) {
        console.error('Error fetching catalog details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [id]);

  const addProductToCatalog = async (productId: string) => {
    if (!catalog) return { error: new Error('Catalog not found') };
    
    try {
      const { data, error } = await supabase
        .from('catalog_products')
        .insert({
          catalog_id: catalog.id,
          product_id: productId
        })
        .select(`
          products (
            id,
            name,
            images
          )
        `)
        .single();
      
      if (error) throw error;
      
      const newProduct = {
        id: data.products.id,
        name: data.products.name,
        images: data.products.images,
      };
      
      setCatalog(prev => {
        if (!prev) return null;
        return {
          ...prev,
          products: [...prev.products, newProduct]
        };
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error adding product to catalog:', error);
      return { error };
    }
  };

  const removeProductFromCatalog = async (productId: string) => {
    if (!catalog) return { error: new Error('Catalog not found') };
    
    try {
      const { error } = await supabase
        .from('catalog_products')
        .delete()
        .eq('catalog_id', catalog.id)
        .eq('product_id', productId);
      
      if (error) throw error;
      
      setCatalog(prev => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.filter(product => product.id !== productId)
        };
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error removing product from catalog:', error);
      return { error };
    }
  };

  const renameCatalog = async (name: string) => {
    if (!catalog) return { error: new Error('Catalog not found') };
    
    try {
      const { error } = await supabase
        .from('catalogs')
        .update({ name })
        .eq('id', catalog.id);
      
      if (error) throw error;
      
      setCatalog(prev => {
        if (!prev) return null;
        return { ...prev, name };
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error renaming catalog:', error);
      return { error };
    }
  };

  return { 
    catalog, 
    loading, 
    error, 
    addProductToCatalog, 
    removeProductFromCatalog,
    renameCatalog
  };
};
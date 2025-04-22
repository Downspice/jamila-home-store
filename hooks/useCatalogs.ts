import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export type Catalog = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  product_count?: number;
};

export type CatalogWithProducts = Catalog & {
  products: {
    id: string;
    name: string;
    images: string[];
  }[];
};

export const useCatalogs = () => {
  const { user } = useAuth();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCatalogs([]);
      setLoading(false);
      return;
    }

    const fetchCatalogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: catalogsData, error: catalogsError } = await supabase
          .from('catalogs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (catalogsError) {
          throw catalogsError;
        }

        if (catalogsData) {
          // For each catalog, count the number of products
          const catalogsWithCounts = await Promise.all(
            catalogsData.map(async (catalog) => {
              const { count, error: countError } = await supabase
                .from('catalog_products')
                .select('*', { count: 'exact', head: true })
                .eq('catalog_id', catalog.id);
              
              if (countError) {
                console.error('Error fetching product count:', countError);
                return { ...catalog, product_count: 0 };
              }
              
              return { ...catalog, product_count: count || 0 };
            })
          );
          
          setCatalogs(catalogsWithCounts);
        }
      } catch (error: any) {
        console.error('Error fetching catalogs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, [user]);

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

  return { catalogs, loading, error, createCatalog, deleteCatalog, updateCatalog };
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
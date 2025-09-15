import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

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

// Fetch all products (optionally by category and search query)
// export const useProducts = (categoryId?: string, searchQuery?: string) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchProducts = useCallback(async () => {
//     setError(null);
//     setLoading(true);

//     try {
//       let query = supabase.from("products").select(`
//         *,
//         product_categories!inner (
//           category_id,
//           categories (id, name)
//         )
//       `);

//       if (categoryId) {
//         query = query.eq("product_categories.category_id", categoryId);
//       }

//       if (searchQuery?.trim()) {
//         query = query.ilike("name", `%${searchQuery}%`);
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       const formattedProducts = (data || []).map((item: any) => {
//         const categories = (item.product_categories || []).map((pc: any) => ({
//           id: pc.categories.id,
//           name: pc.categories.name,
//         }));

//         return {
//           ...item,
//           categories,
//         };
//       });

//       setProducts(formattedProducts);
//     } catch (error: any) {
//       console.error("Error fetching products:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [categoryId, searchQuery]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchProducts();
//   }, [fetchProducts]);

//   const updateProduct = async (id: string, updates: Partial<Product>) => {
//     try {
//       const { data, error } = await supabase
//         .from("products")
//         .update(updates)
//         .eq("id", id)
//         .select(`
//           *,
//           product_categories (
//             categories (id, name)
//           )
//         `)
//         .single();

//       if (error) throw error;

//       const categories = (data?.product_categories || []).map((pc: any) => ({
//         id: pc.categories.id,
//         name: pc.categories.name,
//       }));

//       const updatedProduct = {
//         ...data,
//         categories,
//       };

//       setProducts((prev) =>
//         prev.map((product) => (product.id === id ? updatedProduct : product))
//       );
//       return { data: updatedProduct };
//     } catch (error: any) {
//       console.error("Error updating product:", error);
//       return { error };
//     }
//   };

//   const deleteProduct = async (id: string) => {
//     try {
//       const { error } = await supabase.from("products").delete().eq("id", id);

//       if (error) throw error;

//       setProducts((prev) => prev.filter((product) => product.id !== id));
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error deleting product:", error);
//       return { error };
//     }
//   };

//   return {
//     products,
//     loading,
//     error,
//     refreshing,
//     onRefresh,
//     refetch: fetchProducts,
//     updateProduct,
//     deleteProduct,
//   };
// };
const PAGE_SIZE = 170;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);

  const fetchProducts = useCallback(
    async (pageToFetch: number, isRefresh = false) => {
      if (!isRefresh && !hasMore) return;

      const from = pageToFetch * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
        return;
      }

      if (data) {
        console.log("the data lenght",data.length);
        setProducts((prev) => (isRefresh ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      }
    },
    [hasMore]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 2;
    await fetchProducts(nextPage);
    setPage(nextPage);
    setLoading(false);
  }, [page, hasMore, loading, fetchProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    await fetchProducts(0, true);
    setRefreshing(false);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(0);
    setLoading(false);
  }, [fetchProducts]);

  //   const [page, setPage] = useState(1);
  // const [productsLoadingMore, setProductsLoadingMore] = useState(false);

  // const loadMoreProducts = async () => {
  //   if (productsLoadingMore) return;
  //   setProductsLoadingMore(true);
  //   await fetchMoreProducts(page + 1); // you implement this
  //   setPage((prev) => prev + 1);
  //   setProductsLoadingMore(false);
  // };
  return {
    products,
    allProducts,
    refetch: fetchProducts,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    loadMore,
  };
}

// Fetch featured products
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
          .from("products")
          .select(
            `
            *,
            product_categories (
              categories (id, name)
            )
          `
          )
          .order("like_count", { ascending: false })
          .limit(limit);

        if (error) throw error;

        const formattedProducts = (data || []).map((item: any) => {
          const categories = (item.product_categories || []).map((pc: any) => ({
            id: pc.categories.id,
            name: pc.categories.name,
          }));

          return {
            ...item,
            categories,
          };
        });

        setProducts(formattedProducts);
      } catch (error: any) {
        console.error("Error fetching featured products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

// Fetch single product detail
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
          .from("products")
          .select(
            `
            *,
            product_categories (
              categories (id, name)
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        const categories = (data.product_categories || []).map((pc: any) => ({
          id: pc.categories.id,
          name: pc.categories.name,
        }));

        setProduct({
          ...data,
          categories,
        });
      } catch (error: any) {
        console.error("Error fetching product details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

// Fetch products by category
export const useProductsByCategory = (categoryId: string, limit = 5) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            product_categories!inner (
              category_id,
              categories (id, name)
            )
          `
          )
          .eq("product_categories.category_id", categoryId)
          .limit(limit);

        if (error) throw error;

        const formattedProducts = (data || []).map((item: any) => {
          const categories = (item.product_categories || []).map((pc: any) => ({
            id: pc.categories.id,
            name: pc.categories.name,
          }));

          return {
            ...item,
            categories,
          };
        });

        setProducts(formattedProducts);
      } catch (error: any) {
        console.error("Error fetching products by category:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, limit]);

  return { products, loading, error };
};

// Fetch all products without pagination
export const useAllProducts = () => {
  const [allProducts, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            product_categories (
              categories (id, name)
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedProducts = (data || []).map((item: any) => {
          const categories = (item.product_categories || []).map((pc: any) => ({
            id: pc.categories.id,
            name: pc.categories.name,
          }));

          return {
            ...item,
            categories,
          };
        });

        setProducts(formattedProducts);
      } catch (error: any) {
        console.error("Error fetching all products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return { allProducts, loading, error };
};

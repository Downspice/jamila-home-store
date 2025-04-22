export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          image_url?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
          updated_at: string
          like_count: number
          images: string[]
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
          updated_at?: string
          like_count?: number
          images: string[]
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
          updated_at?: string
          like_count?: number
          images?: string[]
        }
      }
      product_categories: {
        Row: {
          id: string
          product_id: string
          category_id: string
        }
        Insert: {
          id?: string
          product_id: string
          category_id: string
        }
        Update: {
          id?: string
          product_id?: string
          category_id?: string
        }
      }
      catalogs: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
        }
      }
      catalog_products: {
        Row: {
          id: string
          catalog_id: string
          product_id: string
          added_at: string
        }
        Insert: {
          id?: string
          catalog_id: string
          product_id: string
          added_at?: string
        }
        Update: {
          id?: string
          catalog_id?: string
          product_id?: string
          added_at?: string
        }
      }
      user_likes: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
      }
    }
  }
}
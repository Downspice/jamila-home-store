/*
  # Initial Schema for Jamila Home Furniture App

  1. New Tables
    - `profiles`: User profiles with admin flag
    - `categories`: Furniture categories
    - `products`: Furniture products with images
    - `product_categories`: Many-to-many relationship between products and categories
    - `catalogs`: User-created collections of products
    - `catalog_products`: Many-to-many relationship between catalogs and products
    - `user_likes`: Records of users liking products

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL, -- Array of image URLs
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update products"
  ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete products"
  ON products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create product_categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(product_id, category_id)
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product categories are viewable by everyone"
  ON product_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert product categories"
  ON product_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update product categories"
  ON product_categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete product categories"
  ON product_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create catalogs table (user collections)
CREATE TABLE IF NOT EXISTS catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own catalogs"
  ON catalogs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catalogs"
  ON catalogs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalogs"
  ON catalogs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalogs"
  ON catalogs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create catalog_products junction table
CREATE TABLE IF NOT EXISTS catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(catalog_id, product_id)
);

ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own catalog products"
  ON catalog_products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_id
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert into their own catalogs"
  ON catalog_products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_id
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete from their own catalogs"
  ON catalog_products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_id
      AND catalogs.user_id = auth.uid()
    )
  );

-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own likes"
  ON user_likes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes"
  ON user_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON user_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to increment like count
CREATE OR REPLACE FUNCTION increment_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET like_count = like_count + 1
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_like_insert
  AFTER INSERT ON user_likes
  FOR EACH ROW EXECUTE FUNCTION increment_product_like_count();

-- Create function to decrement like count
CREATE OR REPLACE FUNCTION decrement_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET like_count = like_count - 1
  WHERE id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_like_delete
  AFTER DELETE ON user_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_product_like_count();
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { Ionicons } from '@expo/vector-icons';

type Category = {
  id: string;
  name: string;
};

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;

      setCategories(data || []);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 6) {
      Alert.alert('Error', 'Maximum 6 images allowed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImages([...images, `data:image/jpeg;base64,${result.assets[0].base64}`]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const uploadImage = async (base64Image: string) => {
    try {
      const base64Data = base64Image.split(',')[1];
      const fileName = `${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, decode(base64Data), {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a product description');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const imageUrls = await Promise.all(images.map(uploadImage));

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: name.trim(),
          description: description.trim(),
          images: imageUrls,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create category relationships
      const categoryRelations = selectedCategories.map(categoryId => ({
        product_id: product.id,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from('product_categories')
        .insert(categoryRelations);

      if (categoryError) throw categoryError;

      Alert.alert('Success', 'Product added successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Simply navigate back, the focus effect will handle the refetch
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Input
          label="Product Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description"
          multiline
          numberOfLines={4}
          style={styles.description}
          textAlignVertical="top"
        />

        <View style={styles.section}>
          <Text style={styles.label}>Categories</Text>
          <View style={styles.categories}>
            {loadingCategories ? (
              <Text style={styles.loadingText}>Loading categories...</Text>
            ) : categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.category,
                  selectedCategories.includes(category.id) && styles.categorySelected,
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category.id) && styles.categoryTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Images ({images.length}/6)</Text>
          <View style={styles.images}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 6 && (
              <TouchableOpacity style={styles.addImage} onPress={pickImage}>
                <Ionicons name="add" size={32} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Button
          title="Add Product"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.xl,
  },
  form: {
    gap: SPACING.lg,
  },
  description: {
    height: 100,
  },
  section: {
    gap: SPACING.sm,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  category: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categorySelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: SPACING.xl,
  },
}); 
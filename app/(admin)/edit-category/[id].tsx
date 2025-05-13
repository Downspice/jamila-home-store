import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCategoryDetail } from '@/hooks/useCategories';
import { supabase } from '@/lib/supabase';

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { category, loading: categoryLoading } = useCategoryDetail(id as string);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: name.trim(),
          description: description.trim() || null,
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Category updated successfully', [
        {
          text: 'OK',
          onPress: () => {
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

  if (categoryLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Input
          label="Category Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter category name"
          style={styles.input}
        />
        
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter category description"
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        
        <Button
          title="Update Category"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  input: {
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.lg,
  },
}); 
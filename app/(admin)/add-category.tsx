import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function AddCategoryScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
        });

      if (error) throw error;

      Alert.alert('Success', 'Category added successfully', [
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
          label="Category Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter category name"
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter category description (optional)"
          multiline
          numberOfLines={4}
          style={styles.description}
          textAlignVertical="top"
        />

        <Button
          title="Add Category"
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
  button: {
    marginTop: SPACING.md,
  },
}); 
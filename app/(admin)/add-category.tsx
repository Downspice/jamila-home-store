import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

export default function AddCategoryScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setAvatarBase64(result.assets[0].base64);
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const uploadAvatar = async (base64Image: string) => {
    const timestamp = new Date().getTime();
    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.jpg`;
    const filePath = `category-avatars/${fileName}`;

    const { data, error } = await supabase.storage
      .from('category-avatars')
      .upload(filePath, decode(base64Image), {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('category-avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (avatarBase64) {
        imageUrl = await uploadAvatar(avatarBase64);
      }

      const { error } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          image_url: imageUrl,
        });

      if (error) throw error;

      Alert.alert('Success', 'Category added successfully', [
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={pickImage}
        >
          {avatar ? (
            <Image 
              source={{ uri: avatar }} 
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Camera size={24} color={COLORS.textSecondary} />
            </View>
          )}
        </TouchableOpacity>

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
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
}); 
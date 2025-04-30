import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Alert } from 'react-native';

export const useAvatar = () => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (userId: string, currentAvatarUrl?: string) => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        return;
      }

      setUploading(true);

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldAvatarPath = currentAvatarUrl.split('/').pop();
        if (oldAvatarPath) {
          await supabase.storage
            .from('avatars')
            .remove([oldAvatarPath]);
        }
      }

      // Generate unique filename with user ID
      const fileExt = result.assets[0].uri.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const base64 = result.assets[0].base64;

      if (!base64) {
        throw new Error('No base64 data available');
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading };
}; 
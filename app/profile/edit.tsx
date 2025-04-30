import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Edit2, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);

  // Update form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatar(profile.avatar_url || '');
    }
  }, [profile]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setTempAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadAvatar = async (uri: string) => {
    try {
      // Get base64 data from the image
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const base64Data = base64.split(',')[1];
            const fileExt = uri.split('.').pop();
            const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

            // Delete old avatar if exists
            if (avatar) {
              const oldAvatarPath = avatar.split('/').pop();
              if (oldAvatarPath) {
                await supabase.storage
                  .from('avatars')
                  .remove([oldAvatarPath]);
              }
            }

            // Upload new avatar
            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(fileName, decode(base64Data), {
                contentType: `image/${fileExt}`,
                upsert: true,
              });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);

            resolve(publicUrl);
          } catch (error) {
            console.error('Error in upload process:', error);
            reject(error);
          }
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          reject(error);
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
      throw error;
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let avatarUrl = avatar;

      if (tempAvatar) {
        avatarUrl = await uploadAvatar(tempAvatar);
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh the profile data
      await refetch();

      // Navigate back to settings page
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.container}>
        <Header title="Edit Profile" showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" showBackButton />
      
      <ScrollView style={styles.content}>
        <GlassmorphicCard style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: tempAvatar || avatar || '' }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={pickImage}
            >
              <Camera size={20} color={COLORS.white} />
            </TouchableOpacity>
            {tempAvatar && (
              <TouchableOpacity
                style={styles.removeAvatarButton}
                onPress={() => setTempAvatar(null)}
              >
                <X size={20} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ''}
              editable={false}
              placeholderTextColor={COLORS.textSecondary}
            />
            <Text style={styles.helpText}>
              Email cannot be changed. Contact support if needed.
            </Text>
          </View>
        </GlassmorphicCard>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
    padding: SPACING.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  removeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.danger,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabledInput: {
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
  },
  helpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  saveButton: {
    marginTop: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
}); 
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Camera, X } from 'lucide-react-native';
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

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatar(profile.avatar_url || '');
    }
  }, [profile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your media to upload an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].uri) {
      setTempAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          const fileExt = uri.split('.').pop();
          const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

          // Remove old avatar
          if (avatar) {
            const oldPath = avatar.split('/').pop();
            oldPath && await supabase.storage.from('avatars').remove([oldPath]);
          }

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, decode(base64Data), {
              contentType: `image/${fileExt}`,
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          resolve(data.publicUrl);
        } catch (err) {
          console.error(err);
          Alert.alert('Upload Error', 'Could not upload your avatar.');
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      await refetch();
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Update Error', 'Could not update your profile.');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" showBackButton />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: tempAvatar || avatar || '' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editButton} onPress={pickImage}>
            <Camera size={20} color={COLORS.white} />
          </TouchableOpacity>

          {tempAvatar && (
            <TouchableOpacity style={styles.removeButton} onPress={() => setTempAvatar(null)}>
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
          <Text style={styles.helpText}>Email can't be changed. Contact support to update it.</Text>
        </View>

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
    backgroundColor: "#f6f5ed" ,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
    borderColor: COLORS.white,
    borderWidth: 2,
    elevation: Platform.OS === 'android' ? 5 : 3, // Apply elevation for Android
  },
  removeButton: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    backgroundColor: COLORS.danger,
    padding: 10,
    borderRadius: 20,
    borderColor: COLORS.white,
    borderWidth: 2,
    elevation: Platform.OS === 'android' ? 5 : 3, // Apply elevation for Android
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
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f6f5ed" ,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

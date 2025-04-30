import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/shared/Header';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert('Success', 'Password updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    value,
    onChangeText,
    placeholder,
    showPassword,
    onToggleShow,
  }: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    showPassword: boolean;
    onToggleShow: () => void;
  }) => (
    <View style={styles.inputContainer}>
      <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={onToggleShow} style={styles.eyeIcon}>
        {showPassword ? (
          <Eye size={20} color={COLORS.textSecondary} />
        ) : (
          <EyeOff size={20} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Change Password" showBackButton />
      
      <View style={styles.content}>
        <GlassmorphicCard style={styles.card}>
          <Text style={styles.title}>Update Your Password</Text>
          <Text style={styles.description}>
            Enter your current password and choose a new one
          </Text>

          <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current Password"
            showPassword={showCurrentPassword}
            onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            showPassword={showNewPassword}
            onToggleShow={() => setShowNewPassword(!showNewPassword)}
          />

          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            showPassword={showConfirmPassword}
            onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </GlassmorphicCard>
      </View>
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
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.white,
  },
}); 
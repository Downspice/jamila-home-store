import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/shared/Header';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { AlertTriangle, Trash2, X } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationText.toLowerCase() !== 'delete my account') {
      Alert.alert('Error', 'Please type "delete my account" to confirm');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) throw error;

      await supabase.auth.signOut();
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const WarningSection = () => (
    <View style={styles.warningContainer}>
      <AlertTriangle size={24} color={COLORS.danger} style={styles.warningIcon} />
      <Text style={styles.warningTitle}>Warning: Account Deletion</Text>
      <Text style={styles.warningText}>
        This action cannot be undone. All your data will be permanently deleted,
        including:
      </Text>
      <View style={styles.warningList}>
        <Text style={styles.warningItem}>• Your profile information</Text>
        <Text style={styles.warningItem}>• Your saved preferences</Text>
        <Text style={styles.warningItem}>• Your activity history</Text>
        <Text style={styles.warningItem}>• All associated data</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Delete Account" showBackButton />
      
      <ScrollView style={styles.content}>
        <GlassmorphicCard style={styles.card}>
          <WarningSection />

          {!showConfirmation ? (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowConfirmation(true)}
            >
              <Trash2 size={20} color={COLORS.white} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>I understand, proceed to delete</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.confirmationText}>
                To confirm, please type "delete my account" below:
              </Text>
              <TextInput
                style={styles.input}
                value={confirmationText}
                onChangeText={setConfirmationText}
                placeholder="delete my account"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setShowConfirmation(false);
                    setConfirmationText('');
                  }}
                >
                  <X size={20} color={COLORS.white} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton, loading && styles.buttonDisabled]}
                  onPress={handleDeleteAccount}
                  disabled={loading}
                >
                  <Trash2 size={20} color={COLORS.white} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </GlassmorphicCard>
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
  warningContainer: {
    backgroundColor: COLORS.danger + '20',
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  warningIcon: {
    marginBottom: SPACING.sm,
  },
  warningTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  warningText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  warningList: {
    marginLeft: SPACING.md,
  },
  warningItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  confirmButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.white,
  },
}); 
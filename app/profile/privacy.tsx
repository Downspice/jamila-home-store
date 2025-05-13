import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/shared/Header';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Lock, Eye, Shield, Key, Trash2, LogOut } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function PrivacyScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    showProfile: true,
    showActivity: true,
    twoFactorAuth: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const SettingItem = ({
    icon,
    title,
    description,
    value,
    onToggle,
    showSwitch = true,
    onPress,
    isDanger = false,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value?: boolean;
    onToggle?: () => void;
    showSwitch?: boolean;
    onPress?: () => void;
    isDanger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, isDanger && styles.dangerIcon]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, isDanger && styles.dangerText]}>
          {title}
        </Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Privacy & Security" showBackButton />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <SettingItem
            icon={<Eye size={20} color={COLORS.primary} />}
            title="Show Profile"
            description="Allow others to see your profile"
            value={settings.showProfile}
            onToggle={() => toggleSetting('showProfile')}
          />
          <SettingItem
            icon={<Shield size={20} color={COLORS.primary} />}
            title="Show Activity"
            description="Share your activity publicly"
            value={settings.showActivity}
            onToggle={() => toggleSetting('showActivity')}
          />
        </GlassmorphicCard> */}

        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Security</Text>
          {/* <SettingItem
            icon={<Key size={20} color={COLORS.primary} />}
            title="Two-Factor Authentication"
            description="Enable extra security during login"
            value={settings.twoFactorAuth}
            onToggle={() => toggleSetting('twoFactorAuth')}
          /> */}
          <SettingItem
            icon={<Lock size={20} color={COLORS.primary} />}
            title="Change Password"
            description="Update your current password"
            showSwitch={false}
            onPress={() => router.push('/profile/change-password')}
          />
        </GlassmorphicCard>

        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon={<LogOut size={20} color={COLORS.primary} />}
            title="Log Out"
            description="Sign out from this device"
            showSwitch={false}
            onPress={handleLogout}
          />
          <SettingItem
            icon={<Trash2 size={20} color={COLORS.danger} />}
            title="Delete Account"
            description="Permanently delete your data"
            showSwitch={false}
            onPress={() => router.push('/profile/delete-account')}
            isDanger
          />
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
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 60,
  },
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 16,
    shadowColor: COLORS.border,
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    opacity: 0.9,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '33',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  dangerIcon: {
    backgroundColor: COLORS.danger + '22',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
  dangerText: {
    color: COLORS.danger,
  },
});

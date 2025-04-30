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
        {
          text: 'Cancel',
          style: 'cancel',
        },
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
    isDanger = false
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
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, isDanger && styles.dangerIcon]}>
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
      
      <ScrollView style={styles.content}>
        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <SettingItem
            icon={<Eye size={24} color={COLORS.primary} />}
            title="Show Profile"
            description="Make your profile visible to other users"
            value={settings.showProfile}
            onToggle={() => toggleSetting('showProfile')}
          />
          <SettingItem
            icon={<Shield size={24} color={COLORS.primary} />}
            title="Show Activity"
            description="Display your activity and interactions"
            value={settings.showActivity}
            onToggle={() => toggleSetting('showActivity')}
          />
        </GlassmorphicCard>

        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SettingItem
            icon={<Key size={24} color={COLORS.primary} />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            value={settings.twoFactorAuth}
            onToggle={() => toggleSetting('twoFactorAuth')}
          />
          <SettingItem
            icon={<Lock size={24} color={COLORS.primary} />}
            title="Change Password"
            description="Update your account password"
            showSwitch={false}
            onPress={() => router.push('/profile/change-password')}
          />
        </GlassmorphicCard>

        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon={<LogOut size={24} color={COLORS.primary} />}
            title="Log Out"
            description="Sign out of your account"
            showSwitch={false}
            onPress={handleLogout}
          />
          <SettingItem
            icon={<Trash2 size={24} color={COLORS.danger} />}
            title="Delete Account"
            description="Permanently delete your account and all data"
            showSwitch={false}
            onPress={() => router.push('/profile/delete-account')}
            isDanger={true}
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
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  dangerIcon: {
    backgroundColor: COLORS.danger + '20',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  dangerText: {
    color: COLORS.danger,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}); 
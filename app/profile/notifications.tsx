import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/shared/Header';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Bell, Mail, Heart, Bookmark } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    newProducts: true,
    favorites: true,
    catalogs: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const NotificationSetting = ({ 
    icon, 
    title, 
    description, 
    value, 
    onToggle 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Notifications" showBackButton />
      
      <ScrollView style={styles.content}>
        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <NotificationSetting
            icon={<Bell size={24} color={COLORS.primary} />}
            title="Push Notifications"
            description="Receive push notifications on your device"
            value={settings.pushNotifications}
            onToggle={() => toggleSetting('pushNotifications')}
          />
          <NotificationSetting
            icon={<Heart size={24} color={COLORS.primary} />}
            title="New Products"
            description="Get notified about new products in your favorite categories"
            value={settings.newProducts}
            onToggle={() => toggleSetting('newProducts')}
          />
          <NotificationSetting
            icon={<Bookmark size={24} color={COLORS.primary} />}
            title="Catalog Updates"
            description="Receive updates about your saved catalogs"
            value={settings.catalogs}
            onToggle={() => toggleSetting('catalogs')}
          />
        </GlassmorphicCard>

        <GlassmorphicCard style={styles.card}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <NotificationSetting
            icon={<Mail size={24} color={COLORS.primary} />}
            title="Email Notifications"
            description="Receive email notifications about important updates"
            value={settings.emailNotifications}
            onToggle={() => toggleSetting('emailNotifications')}
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
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}); 
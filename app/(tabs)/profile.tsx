import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  LogOut, 
  UserCircle, 
  Heart, 
  Bookmark, 
  HelpCircle, 
  Settings, 
  Edit2,
  Bell,
  Lock,
  Info,
  Star
} from 'lucide-react-native';
import { useAvatar } from '@/hooks/useAvatar';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();
  const { 
    profile, 
    loading, 
    error, 
    refreshing, 
    onRefresh 
  } = useProfile();
  const { uploadAvatar, uploading } = useAvatar();
  const [localProfile, setLocalProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setLocalProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!user) return;
    
    const newAvatarUrl = await uploadAvatar(user.id, localProfile?.avatar_url);
    if (newAvatarUrl) {
      setLocalProfile({ ...localProfile, avatar_url: newAvatarUrl });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const MenuOption = ({ icon, title, onPress, showChevron = true }: any) => (
    <TouchableOpacity 
      style={styles.menuOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      {showChevron && (
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon }: any) => (
    <GlassmorphicCard style={styles.statCard}>
      <View style={styles.statIconContainer}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </GlassmorphicCard>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Profile" showBackButton={false} />
        <View style={styles.centerContent}>
          <UserCircle size={80} color={COLORS.primary} />
          <Text style={styles.loginMessage}>Please sign in to view your profile</Text>
          <Button 
            title="Sign In" 
            onPress={() => router.push('/login')} 
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.profileSection}
        >
          <GlassmorphicCard style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleAvatarUpdate}
                disabled={uploading}
              >
                {localProfile?.avatar_url ? (
                  <Image
                    source={{ uri: localProfile.avatar_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color={COLORS.white} />
                  </View>
                )}
                <View style={styles.editIcon}>
                  <Ionicons name="camera" size={20} color={COLORS.white} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.username}>{localProfile?.full_name || 'Guest'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Star size={16} color={COLORS.primary} />
                <Text style={styles.adminText}>Admin</Text>
              </View>
            )}
          </GlassmorphicCard>
        </Animated.View>

        {/* <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.statsSection}
        >
          <View style={styles.statsRow}>
            <StatCard 
              title="Favorites" 
              value="24" 
              icon={<Heart size={24} color={COLORS.primary} />} 
            />
            <StatCard 
              title="Catalogs" 
              value="5" 
              icon={<Bookmark size={24} color={COLORS.primary} />} 
            />
          </View>
        </Animated.View> */}

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.menuSection}
        >
          <GlassmorphicCard style={styles.menuCard}>
            <MenuOption
              icon={<UserCircle size={24} color={COLORS.primary} />}
              title="Edit Profile"
              onPress={() => router.push('/profile/edit')}
            />
            <MenuOption
              icon={<Bell size={24} color={COLORS.primary} />}
              title="Notifications"
              onPress={() => router.push('/profile/notifications')}
            />
            <MenuOption
              icon={<Lock size={24} color={COLORS.primary} />}
              title="Privacy & Security"
              onPress={() => router.push('/profile/privacy')}
            />
            <MenuOption
              icon={<HelpCircle size={24} color={COLORS.primary} />}
              title="Help & Support"
              onPress={() => router.push('/profile/help')}
            />
            <MenuOption
              icon={<Info size={24} color={COLORS.primary} />}
              title="About"
              onPress={() => router.push('/profile/about')}
            />
            {isAdmin && (
              <MenuOption
                icon={<Settings size={24} color={COLORS.primary} />}
                title="Admin Dashboard"
                onPress={() => router.push('/admin')}
              />
            )}
          </GlassmorphicCard>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.actionsSection}
        >
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="primary"
            style={styles.signOutButton}
            icon={<LogOut size={20} color={COLORS.white} />}
          />
        </Animated.View>
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
  profileSection: {
    marginBottom: SPACING.xl,
  },
  profileCard: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
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
  username: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: SPACING.xs,
  },
  adminText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  menuSection: {
    marginBottom: SPACING.xl,
  },
  menuCard: {
    padding: SPACING.md,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  signOutButton: {
    marginTop: SPACING.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loginMessage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginVertical: SPACING.xl,
  },
  loginButton: {
    width: 150,
  },
});
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LogOut, UserCircle, Heart, Bookmark, HelpCircle, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut, isAdmin } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          }
        },
      ]
    );
  };

  const MenuOption = ({ icon, title, onPress }: any) => (
    <TouchableOpacity 
      style={styles.menuOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Profile" showBackButton={false} />
        <View style={styles.centerContent}>
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
      <Header title="Profile" showBackButton={false} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <UserCircle size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.userEmail}>{profile?.email || user.email}</Text>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Admin</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <GlassmorphicCard style={styles.menuCard}>
            <MenuOption 
              icon={<Heart size={22} color={COLORS.primary} />}
              title="Favorites"
              onPress={() => router.push('/favorites')}
            />
            <View style={styles.divider} />
            <MenuOption 
              icon={<Bookmark size={22} color={COLORS.primary} />}
              title="My Catalogs"
              onPress={() => router.push('/catalogs')}
            />
            {isAdmin && (
              <>
                <View style={styles.divider} />
                <MenuOption 
                  icon={<Settings size={22} color={COLORS.primary} />}
                  title="Admin Panel"
                  onPress={() => router.push('/admin')}
                />
              </>
            )}
          </GlassmorphicCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <GlassmorphicCard style={styles.menuCard}>
            <MenuOption 
              icon={<HelpCircle size={22} color={COLORS.primary} />}
              title="Help & Support"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <MenuOption 
              icon={<LogOut size={22} color={COLORS.error} />}
              title="Sign Out"
              onPress={handleSignOut}
            />
          </GlassmorphicCard>
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
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 120, // Space for tab bar
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  userName: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  adminBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginTop: SPACING.sm,
  },
  adminText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: COLORS.white,
  },
  menuCard: {
    marginBottom: SPACING.lg,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black10,
    marginVertical: SPACING.xs,
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
    marginBottom: SPACING.xl,
  },
  loginButton: {
    width: 150,
  },
});
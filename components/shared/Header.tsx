import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ArrowLeft, Search, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showProfile?: boolean;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  transparent?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  showSearch = false,
  showProfile = false,
  onSearchPress,
  onProfilePress,
  transparent = false,
}: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  if (transparent) {
    return (
      <View style={[styles.container, styles.transparentContainer]}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={handleBackPress}
            style={styles.iconButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BlurView intensity={80} tint="light" style={styles.blurButton}>
              <ArrowLeft size={22} color={COLORS.white} />
            </BlurView>
          </TouchableOpacity>
        )}
        
        {title && <Text style={[styles.title, styles.transparentTitle]}>{title}</Text>}
        
        <View style={styles.rightContainer}>
          {showSearch && (
            <TouchableOpacity 
              onPress={onSearchPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <BlurView intensity={80} tint="light" style={styles.blurButton}>
                <Search size={22} color={COLORS.white} />
              </BlurView>
            </TouchableOpacity>
          )}
          
          {showProfile && (
            <TouchableOpacity 
              onPress={onProfilePress}
              style={[styles.iconButton, showSearch && styles.leftMargin]}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <BlurView intensity={80} tint="light" style={styles.blurButton}>
                <User size={22} color={COLORS.white} />
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity 
          onPress={handleBackPress}
          style={styles.iconButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      )}
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.rightContainer}>
        {showSearch && (
          <TouchableOpacity 
            onPress={onSearchPress}
            style={styles.iconButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Search size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity 
            onPress={onProfilePress}
            style={[styles.iconButton, showSearch && styles.leftMargin]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <User size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black5,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  title: {
    flex: 1,
    fontFamily: 'Playfair-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  transparentTitle: {
    color: COLORS.white,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: SPACING.xs,
  },
  leftMargin: {
    marginLeft: SPACING.md,
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.white20,
  },
});
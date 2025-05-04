import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONTS, SPACING } from "@/constants/theme";
import { ArrowLeft, Search, User } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useAuth } from "@/context/AuthContext";
import ProductDetailSkeleton from "../product/ProductDetailSkeleton";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showSearchBar?: boolean;
  showProfile?: boolean;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  transparent?: boolean;
  productDetail?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  showSearch = false,
  showSearchBar = false,
  showProfile = false,
  onSearchPress,
  onProfilePress,
  transparent = false,
  productDetail=false
}: HeaderProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const avatar = profile?.avatar_url;

  const handleBackPress = () => {
    router.back();
  };

  if(productDetail){
    return(
      <View style={[ styles.productDetailContainer]}>
          
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
         
    );
  }
  if (transparent) {
    return (
      <View style={[ styles.transparentContainer]}>
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

        {/* {title && (
          <Text style={[styles.title, styles.transparentTitle]}>{title}</Text>
        )} */}

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
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={{ width: 22, height: 22, borderRadius: 10 }}
                  />
                ) : (
                  <User size={22} color={COLORS.white} />
                )}
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("@/assets/images/headerBackground.png")}
          resizeMode="cover"
          style={[styles.backgroundImagePattern, { opacity: 0.2 }]}
        />
      </View>

      <View style={styles.contentContainer}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.iconButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ) : (
          <Text style={{ width: 30, height: 30 }}>
            <Image
              source={require("@/assets/images/inapp-logo.png")}
              style={{ width: 22, height: 22 }}
            />
          </Text>
        )}

        {title && <Text style={styles.title}>{title}</Text>}

        {showSearchBar && (
          <TouchableOpacity
            onPress={onSearchPress}
            style={styles.searchBar}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Search size={22} color={COLORS.black30} />
            <Text style={styles.searchBarText}>Looking for something?</Text>
          </TouchableOpacity>
        )}

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
              hitSlop={{ top: 2, bottom: 2, left: 5, right: 5 }}
            >
              <BlurView intensity={80} tint="light" style={styles.blurButton}>
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={{ width: 22, height: 22, borderRadius: 10 }}
                  />
                ) : (
                  <User size={22} color={COLORS.textPrimary} />
                )}
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transparentContainer: {
    backgroundColor: "transparent",
  },
  productDetailContainer: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black5,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === "ios" ? 50 : SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black5,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImagePattern: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === "ios" ? 50 : SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    flex: 1,
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  transparentTitle: {
    color: COLORS.white,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: COLORS.white20,
  },
  searchBar: {
    display: "flex",
    width: "70%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.white20,
    gap: SPACING.xs,
  },
  searchBarText: {
    fontSize: 12,
    color: COLORS.black30,
    fontFamily: "Playfair-Regular",
  },
});

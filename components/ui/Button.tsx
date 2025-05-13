import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS, SPACING } from "@/constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const getButtonStyles = () => {
    const buttonStyles: StyleProp<ViewStyle>[] = [styles.button];

    // Size styles
    if (size === "small") buttonStyles.push(styles.smallButton);
    if (size === "large") buttonStyles.push(styles.largeButton);

    // Width style
    if (fullWidth) buttonStyles.push(styles.fullWidth);

    // Variant styles (for outline and ghost variants)
    if (variant === "outline") buttonStyles.push(styles.outlineButton);
    if (variant === "ghost") buttonStyles.push(styles.ghostButton);

    // Disabled style
    if (disabled) buttonStyles.push(styles.disabledButton);

    // Custom style
    if (style) buttonStyles.push(style);

    return buttonStyles;
  };

  const getTextStyles = () => {
    const textStyles: StyleProp<TextStyle>[] = [styles.text];

    // Size styles
    if (size === "small") textStyles.push(styles.smallText);
    if (size === "large") textStyles.push(styles.largeText);

    // Variant text styles
    if (variant === "outline") textStyles.push(styles.outlineText);
    if (variant === "ghost") textStyles.push(styles.ghostText);

    // Disabled text
    if (disabled) textStyles.push(styles.disabledText);

    // Custom text style
    if (textStyle) textStyles.push(textStyle);

    return textStyles;
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "secondary"
              ? COLORS.white
              : COLORS.primary
          }
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text style={getTextStyles()}>{title}</Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </>
  );

  // For gradient buttons (primary and secondary variants)
  if (variant === "primary" || variant === "secondary") {
    const gradientColors =
      variant === "primary" ? COLORS.primary : COLORS.secondary;

    return (
      <TouchableOpacity
        onPress={disabled || loading ? undefined : onPress}
        activeOpacity={0.8}
        style={fullWidth ? styles.fullWidth : {}}
        disabled={disabled || loading}
      >
        {/* <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={getButtonStyles()}
        >
          {renderContent()}
        </LinearGradient> */}

        <View style={getButtonStyles()}>{renderContent()}</View>
      </TouchableOpacity>
    );
  }

  // For non-gradient buttons (outline and ghost variants)
  return (
    <TouchableOpacity
      onPress={disabled || loading ? undefined : onPress}
      style={getButtonStyles()}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
   
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      gap: SPACING.sm,
    
      // Shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    
      // Shadow for Android
      elevation: 5,
  },
  fullWidth: {
    width: "100%",
  },
  smallButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
  },
  largeButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 16,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: SPACING.sm,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  disabledText: {
    opacity: 0.8,
  },
});

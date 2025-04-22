import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
}

export default function Input({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'none',
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onBlur,
  onFocus,
  disabled = false,
  maxLength,
  keyboardType = 'default',
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const getContainerStyle = () => {
    return [
      styles.container,
      isFocused && styles.focusedContainer,
      error && styles.errorContainer,
      disabled && styles.disabledContainer,
      style,
    ];
  };

  const getInputStyle = () => {
    return [
      styles.input,
      leftIcon && styles.inputWithLeftIcon,
      rightIcon && styles.inputWithRightIcon,
      multiline && styles.multilineInput,
      error && styles.errorInput,
      disabled && styles.disabledInput,
      inputStyle,
    ];
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getContainerStyle()}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={hidePassword}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          style={getInputStyle()}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {hidePassword ? 
              <Eye size={20} color={COLORS.textSecondary} /> : 
              <EyeOff size={20} color={COLORS.textSecondary} />
            }
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    marginBottom: SPACING.xs,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  container: {
    borderWidth: 1,
    borderColor: COLORS.black20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  focusedContainer: {
    borderColor: COLORS.primary,
  },
  errorContainer: {
    borderColor: COLORS.error,
  },
  disabledContainer: {
    backgroundColor: COLORS.black5,
    borderColor: COLORS.black10,
  },
  input: {
    flex: 1,
    height: Platform.OS === 'ios' ? 44 : 48,
    paddingHorizontal: SPACING.md,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: SPACING.md,
  },
  errorInput: {
    color: COLORS.textPrimary,
  },
  disabledInput: {
    color: COLORS.textLight,
  },
  leftIconContainer: {
    paddingLeft: SPACING.md,
  },
  rightIconContainer: {
    paddingRight: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
    fontFamily: 'Poppins-Regular',
  },
});
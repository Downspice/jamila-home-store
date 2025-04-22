import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes for standard 375 width screen
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  betweenGlassCard: 90,
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,
  padding3: 16,

  // font sizes
  largeTitle: scale(32),
  h1: scale(30),
  h2: scale(24),
  h3: scale(20),
  h4: scale(18),
  h5: scale(16),
  body1: scale(16),
  body2: scale(14),
  body3: scale(12),
  body4: scale(10),
  
  // app dimensions
  width,
  height,
};

export const COLORS = {
  // base colors
  primary: '#C3996C',
  primaryLight: '#A97C50',
  secondary: '#6EDCBF',
  secondaryLight: '#C3F4E8',

  // gradients
  gradientPrimary: ['#C3996C', '#01010170'],
  gradientSecondary: ['#6EDCBF', '#6EC3DC'],
  gradientAccent: ['#FCAC5E', '#FD825F'],
  
  // whites and blacks with opacity
  white: '#FFFFFF',
  white90: 'rgba(255, 255, 255, 0.9)',
  white80: 'rgba(255, 255, 255, 0.8)',
  white70: 'rgba(255, 255, 255, 0.7)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white50: 'rgba(255, 255, 255, 0.5)',
  white40: 'rgba(255, 255, 255, 0.4)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white10: 'rgba(255, 255, 255, 0.1)',

  black: '#000000',
  black90: 'rgba(0, 0, 0, 0.9)',
  black80: 'rgba(0, 0, 0, 0.8)',
  black70: 'rgba(0, 0, 0, 0.7)',
  black60: 'rgba(0, 0, 0, 0.6)',
  black50: 'rgba(0, 0, 0, 0.5)',
  black40: 'rgba(0, 0, 0, 0.4)',
  black30: 'rgba(0, 0, 0, 0.3)',
  black20: 'rgba(0, 0, 0, 0.2)',
  black10: 'rgba(0, 0, 0, 0.1)',
  black5: 'rgba(0, 0, 0, 0.05)',

  // text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  
  // ui colors
  background: '#F8F9FA',
  card: '#FFFFFF',
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FB8C00',
  error: '#F44336',
  disabled: '#CCCCCC',
  inactive: '#A0A0A0',
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const FONTS = {
  // font family will be set after font loading
  largeTitle: { fontSize: SIZES.largeTitle, lineHeight: 40 },
  h1: { fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontSize: SIZES.h3, lineHeight: 26 },
  h4: { fontSize: SIZES.h4, lineHeight: 24 },
  h5: { fontSize: SIZES.h5, lineHeight: 22 },
  body1: { fontSize: SIZES.body1, lineHeight: 24 },
  body2: { fontSize: SIZES.body2, lineHeight: 22 },
  body3: { fontSize: SIZES.body3, lineHeight: 20 },
  body4: { fontSize: SIZES.body4, lineHeight: 18 },
};

export default {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
  SPACING,
  scale,
  verticalScale,
  moderateScale,
};
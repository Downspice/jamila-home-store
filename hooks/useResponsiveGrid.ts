import { useWindowDimensions } from "react-native";

export const useResponsiveGrid = ({
  minCardWidth = 160,
  maxGap = 20,
  horizontalPadding = 32, // Default SPACING.lg * 2
}: {
  minCardWidth?: number;
  maxGap?: number;
  horizontalPadding?: number;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const usableWidth = screenWidth - horizontalPadding;

  let numColumns = 1;
  let cardWidth = usableWidth;
  let gap = 0;

  for (let cols = 1; cols <= 5; cols++) {
    const tentativeGap = (usableWidth - cols * minCardWidth) / (cols - 1 || 1);
    if (tentativeGap >= 8 && tentativeGap <= maxGap) {
      numColumns = cols;
      gap = tentativeGap;
      cardWidth = (usableWidth - (cols - 1) * gap) / cols;
    }
  }

  return { numColumns, cardWidth, gap };
};

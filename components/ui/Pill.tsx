import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PillProps {
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

const Pill = ({
  children,
  borderColor = '#ccc',
  backgroundColor = '#f2f2f2',
  style,
}: PillProps) => {
  return (
    <View
      style={[
        styles.pill,
        {
          borderColor,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

export default Pill;

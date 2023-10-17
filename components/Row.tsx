import * as React from 'react';
import View from 'react-native-ui-lib/view';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { PropsWithChildren } from 'react';

interface IRowProps {
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const Row: React.FC<PropsWithChildren<IRowProps>> = ({ children, style, ...props }) => {
  return (
    <View {...props} style={[styles.row, style]}>
      {children}
    </View>
  );
};

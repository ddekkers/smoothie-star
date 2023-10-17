/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Typography, Colors as RNUIColors, Spacings, ThemeManager } from 'react-native-ui-lib';

RNUIColors.loadColors({
  offwhite: '#FAF9F6',
  primary: '#f8f7f5',
  secondary: '#002500',
  tertiary: '#b1ca80',
  contrast: '#bab9b6',
  alert: '#f44336',
  shaddowLight: '#FBFFFF',
  shaddowDark: '#D3D2D0',
});

Typography.loadTypographies({
  p: { fontSize: 24, fontWeight: '200' },
  h1: { fontSize: 58, fontWeight: '300', lineHeight: 80 },
  h2: { fontSize: 46, fontWeight: '300', lineHeight: 64 },
  h3: { fontSize: 36, fontWeight: '300', lineHeight: 58 },
  h4: { fontSize: 32, fontWeight: '300', lineHeight: 42 },
});

Spacings.loadSpacings({
  page: 20,
});

ThemeManager.setComponentTheme('Text', {
  text70: true, // will set the text70 typography modifier prop to be true by default
  grey10: true, // will set the grey10 color modifier prop to be true by default
});
ThemeManager.setComponentTheme('Checkbox', {
  color: 'transparent',
});

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

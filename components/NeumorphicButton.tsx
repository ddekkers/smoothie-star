import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Colors } from 'react-native-ui-lib';
interface INeumorphicButtonProps {
  onPress: () => void;
  buttonSize: number;
  primary?: boolean;
  isDisabled?: boolean;
}

export const NeumorphicButton: React.FC<PropsWithChildren<INeumorphicButtonProps>> = ({
  onPress,
  children,
  buttonSize,
  primary,
  isDisabled,
}) => {
  return (
    <Button
      disabled={isDisabled}
      onPress={onPress}
      style={{
        width: buttonSize * 1.3,
        height: buttonSize * 1.3,
        borderRadius: primary ? 30 : buttonSize,
        backgroundColor: 'transparent',
      }}>
      <View style={[styles.topShaddow]}>
        <View
          style={[
            styles.bottomShaddow,
            styles.inner,
            {
              width: buttonSize,
              height: buttonSize,
              borderColor: Colors.shaddowLight,
              borderWidth: primary ? 1 : StyleSheet.hairlineWidth,
              borderRadius: primary ? 30 : buttonSize,
            },
            isDisabled ? { borderWidth: 0 } : {},
          ]}
        />
      </View>
      <View
        style={[
          {
            position: 'absolute',
          },
        ]}>
        {children}
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  topShaddow: {
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#000000',
    elevation: 30,
    backgroundColor: 'transparent',
  },
  bottomShaddow: {
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#ffffff',
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    elevation: 30,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

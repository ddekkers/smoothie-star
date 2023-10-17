import { Colors } from 'react-native-ui-lib';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import RNUIFloatingButton from 'react-native-ui-lib/floatingButton';
import Icon from "@expo/vector-icons/Feather";
interface IFloatingButtonProps {
  onPress: () => void;
  icon: "plus" | "search" | "x";
}

const createStyle = () =>
  StyleSheet.create({
    floatingButton: {
      width: 70,
      height: 70,
      backgroundColor: Colors.primary,
      marginBottom: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
    },
  });
export const FloatingButton: React.FC<IFloatingButtonProps> = ({ onPress, icon }) => {
  const style = createStyle();
  return (
    <RNUIFloatingButton
      bottomMargin={300}
      visible={true}
      hideBackgroundOverlay={false}
      button={{
        onPress,
        style: style.floatingButton,
        iconSource: () => <Icon size={30} name={icon} color={Colors.black} />,
      }} />
  );
};

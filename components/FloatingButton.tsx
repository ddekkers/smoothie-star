import { Colors } from "react-native-ui-lib";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import RNUIFloatingButton from "react-native-ui-lib/floatingButton";
import Icon from "@expo/vector-icons/FontAwesome5";
interface IFloatingButtonProps {
  onPress: () => void;
  icon: "plus" | "search" | "x" | "undo" | "list" | "print"
  size?: number;
  primary?: boolean;
  isDisabled?: boolean
}

const createStyle = (primary: boolean, isDisabled: boolean) =>
  StyleSheet.create({
    container: {
      width: primary ? 120 : 100,
      height: primary ? 120 : 100,
      backgroundColor: "transparent"
    },
    floatingButton: {
      width: primary ? 120 : 80,
      height: primary ? 120 : 80,
      backgroundColor: isDisabled?Colors.primary:Colors.shaddowLight,
      // marginBottom: 30,
      shadowColor: Colors.contrast,
      shadowOffset: {
        width: isDisabled?-1:0,
        height: isDisabled?5:12,
      },
      shadowOpacity: isDisabled?0.6:1,
      borderRadius: primary ? 20 : 80,
      shadowRadius: isDisabled?5:16,
      // elevation: 24,
    },
  });
export const FloatingButton: React.FC<IFloatingButtonProps> = ({
  onPress,
  icon,
  size,
  primary = false,
  isDisabled= false
}) => {
  const style = createStyle(primary, isDisabled);
  return (
    <View style={style.container}>

    <RNUIFloatingButton
      bottomMargin={300}
      visible={true}
      hideBackgroundOverlay={true}
      withoutAnimation={isDisabled}
      button={{
        onPress,
        disabled: isDisabled,
        style: style.floatingButton,
        iconSource: () => (
          <Icon size={size ?? 30} name={icon} color={isDisabled?Colors.contrast:Colors.secondary} />
          ),
        }}
        />
        </View>
  );
};

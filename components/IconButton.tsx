import * as React from 'react';
import { Colors } from 'react-native-ui-lib';
import Icon from "@expo/vector-icons/Feather";
import { NeumorphicButton } from './NeumorphicButton';
import { FloatingButton } from "../components/FloatingButton";


interface IIconButtonProps {
  onPress: () => void;
  name: "list" | "x" | "search" | "print"
  primary?: boolean;
  isDisabled?: boolean;
  size?: number;
}

export const IconButton: React.FC<IIconButtonProps> = ({
  onPress,
  name,
  primary,
  isDisabled,
  size,
}) => {
  return (
    <FloatingButton primary={primary} icon={name} onPress={onPress} size={size}/>

    // <NeumorphicButton
    //   isDisabled={isDisabled}
    //   primary={primary}
    //   onPress={onPress}
    //   buttonSize={primary ? 130 : 110}>
    //   <Icon
    //     color={isDisabled ? Colors.contrast : Colors.secondary}
    //     name={name}
    //     size={size ?? (primary ? 40 : 25)}
    //   />
    // </NeumorphicButton>
  );
};

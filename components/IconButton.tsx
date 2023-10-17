import * as React from 'react';
import { Colors } from 'react-native-ui-lib';
import Icon from "@expo/vector-icons/Feather";
import { NeumorphicButton } from './NeumorphicButton';

interface IIconButtonProps {
  onPress: () => void;
  name: "printer" | "list" | "x"
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
    <NeumorphicButton
      isDisabled={isDisabled}
      primary={primary}
      onPress={onPress}
      buttonSize={primary ? 100 : 80}>
      <Icon
        color={isDisabled ? Colors.contrast : Colors.secondary}
        name={name}
        size={size ?? (primary ? 30 : 25)}
      />
    </NeumorphicButton>
  );
};

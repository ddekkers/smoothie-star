import React from "react";
import { ColorPalette, Colors } from "react-native-ui-lib";
import { colors } from "../constants/Colors";

interface IColorSelectorProps {
  selectedColor: string;
  selectColor: (color: string) => void;
}

export const ColorSelector: React.FC<IColorSelectorProps> = ({
  selectColor,
  selectedColor,
}) => {
  return (
    <ColorPalette
      colors={colors}
      numberOfRows={4}
      usePagination
      containerWidth={600}
      backgroundColor={Colors.primary}
      value={selectedColor}
      swatchStyle={{
        borderRadius: 100,
        height: 70,
        width: 70,
      }}
      onValueChange={selectColor}
    />
  );
};

import { BlurView } from "expo-blur";
import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { Colors } from "react-native-ui-lib";
import Card from "react-native-ui-lib/card";

interface IItemImageProps {
  width: number;
  height: number;
  imageUrl: string;
  fallbackColor?: string;
  isSelected?: boolean;
  showIndicator?: boolean;
  toggleSelection?: () => void;
  itemName?: string;
}
export const ItemImage: React.FC<IItemImageProps> = ({
  width,
  height,
  imageUrl,
  isSelected,
  fallbackColor,
  itemName,
  toggleSelection,
}) => {
  const ref = useRef<Animatable.View & View>(null);

  const itemWidth = isSelected ? width * 0.9 : width;
  const itemHeight = isSelected ? height * 0.85 : height;

  const containerHeight = height * 0.9;
  const onPress = useCallback(() => {
    ref?.current?.pulse?.(800);
    toggleSelection?.();
  }, [ref]);
  return (
    <Animatable.View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: containerHeight,
      }}
      ref={ref}
    >
      <Card
        onPress={onPress}
        selected={isSelected}
        selectionOptions={{
          hideIndicator: true,
          borderWidth: 0,
        }}
        containerStyle={{
          borderRadius: 16,
          shadowColor: "#000",
          width: itemWidth,
          marginBottom: 10,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.38,
          shadowRadius: 8.0,
          elevation: 24,
        }}
      >
        <Card.Section
          imageStyle={{
            borderRadius: 16,
            height,
          }}
          style={{
            borderRadius: 16,
            backgroundColor:
              fallbackColor && !imageUrl
                ? Colors.rgba(fallbackColor, 1)
                : Colors.contrast,
          }}
          imageSource={{
            uri: imageUrl,
            headers: {
              authorization:
                "563492ad6f9170000100000173d22f35229d4424919c5a74dbf15ab0",
            },
          }}
          height={itemHeight}
          content={[
            { text: itemName, text30: true, primary: true, center: true },
          ]}
          contentStyle={[
            {
              width: "100%",
              padding: 20,
              bottom: 0,
              position: "absolute",
              backgroundColor: !!itemName
                ? Colors.rgba(Colors.secondary, 0.6)
                : "transparent",
            },
            isSelected && { height: "100%", justifyContent: "center" },
          ]}
        />
        {isSelected && (
          <BlurView
            tint={"light"}
            intensity={10}
            style={[
              StyleSheet.absoluteFill,

              {
                borderRadius: 10,
                overflow: "hidden",
              },
            ]}
          />
        )}
      </Card>
    </Animatable.View>
  );
};

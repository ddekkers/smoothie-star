import { BlurView } from "expo-blur";

import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "react-native-ui-lib";
import Card from "react-native-ui-lib/card";
import Text from "react-native-ui-lib/text";
import { isEmbeddedLaunch } from "expo-updates";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

interface IItemImageProps {
  width: number;
  height: number;
  imageUrl: string;
  fallbackColor?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  itemName?: string;
}
export const ItemImage: React.FC<IItemImageProps> = ({
  width,
  height,
  imageUrl,
  isSelected,
  fallbackColor,
  itemName,
  onSelect,
}) => {
  const itemWidth = isSelected ? width * 0.9 : width;
  const itemHeight = isSelected ? height * 0.9 : height;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height,
        width,
      }}
    >
      <Card
        onPress={onSelect}
        selected={isSelected}
        selectionOptions={{
          hideIndicator: true,
          borderWidth: 0,
        }}
        containerStyle={{
          borderRadius: 16,
          shadowColor: "#000",
          marginBottom: 10,
          width: itemWidth,
          height: itemHeight,
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
          width={itemWidth}
          content={[
            { text: !isSelected?itemName:"", text30: true, primary: true, center: true },
          ]}
          contentStyle={[
            {
              width: "100%",
              padding: 20,
              bottom: 0,
              position: "absolute",
              backgroundColor: !!itemName
                ? Colors?.rgba(Colors.secondary, 0.6)
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
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 10,
                overflow: "hidden",
              },
            ]}
          >
            <Text primary text30 center style={{}}>
              {itemName}
            </Text>
          </BlurView>
        )}
      </Card>
    </View>
  );
};

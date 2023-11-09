import React, { useCallback } from "react";
import { Linking, FlatList, Keyboard } from "react-native";
import { Colors } from "react-native-ui-lib";
import Button from "react-native-ui-lib/button";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import { useImage } from "../store/useImage";
import { ImageInfo } from "../types";
import { ItemImage } from "./ItemImage";

interface IImageSelectorProps {
  searchTerm: string;
  selectedImage?: ImageInfo;
  onSelectImage: (image: ImageInfo) => void;
}
export const ImageSelector: React.FC<IImageSelectorProps> = ({
  searchTerm,
  selectedImage,
  onSelectImage,
}) => {
  const { imageSearchResult, getImageBySearchTearm } = useImage();

  const searchImages = useCallback(() => {
    Keyboard.dismiss();
    getImageBySearchTearm(searchTerm);
  }, [searchTerm, getImageBySearchTearm]);

  return (
    <View>
      <Button
        disabled={searchTerm.length <= 0}
        style={{ width: 300, alignSelf: "center", borderRadius: 10 }}
        backgroundColor={Colors.tertiary}
        onPress={searchImages}
      >
        <Text h4>{"Suche"}</Text>
      </Button>
      {imageSearchResult.length > 0 && (
        <>
          <FlatList
            style={{ paddingTop: 40, height: 200 }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            data={imageSearchResult}
            keyExtractor={(image) => image.url}
            renderItem={({
              item: {
                src: { tiny: imageUrl },
                photographer,
              },
              index,
            }) => (
              <View key={index} style={{ marginHorizontal: 8 }}>
                <ItemImage
                  key={index}
                  imageUrl={imageUrl}
                  width={130}
                  height={130}
                  isSelected={imageUrl === selectedImage?.imageUrl}
                  onSelect={() =>
                    onSelectImage({ imageUrl, photographer })
                  }
                />
              </View>
            )}
            horizontal
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text p>Photos provided by </Text>
              <Text
                p
                onPress={() => Linking.openURL("https://www.pexels.com")}
                style={{
                  color: Colors.blue10,
                  textDecorationLine: "underline",
                }}
              >
                Pexels
              </Text>
            </View>

            {selectedImage?.photographer && (
              <Text p>{`Photographer: ${
                selectedImage?.photographer || ""
              }`}</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

import * as FileSystem from "expo-file-system";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import TextField from "react-native-ui-lib/textField";
import Button from "react-native-ui-lib/button";
import RadioButton from "react-native-ui-lib/radioButton";
import RadioGroup from "react-native-ui-lib/radioGroup";
import Checkbox from "react-native-ui-lib/checkbox";
import Dialog from "react-native-ui-lib/dialog";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Icon from "@expo/vector-icons/Feather";
import { colors } from "../constants/Colors";
import { Item } from "../data/model";
import { useItems } from "../store/useItems";
import { ImageInfo } from "../types";
import { ColorSelector } from "./ColorSelector";
import { ImageSelector } from "./ImageSelector";
import { Row } from "./Row";

interface ICreateItemDialogProps {
  isVisible: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

enum ItemDisplayType {
  IMAGE = "image",
  COLOR = "color",
}

const IMAGE_DIR_PATH = FileSystem.documentDirectory + "images/";

const getFileName = (path: String) => (path || "").split("/").pop();
const saveImage = async (imageUrl: string) => {
  const filePath = IMAGE_DIR_PATH + getFileName(imageUrl);
  const imageDownload = FileSystem.createDownloadResumable(imageUrl, filePath, {
    headers: {
      authorization: "563492ad6f9170000100000173d22f35229d4424919c5a74dbf15ab0",
    },
  });
  if (!(await FileSystem.getInfoAsync(IMAGE_DIR_PATH)).isDirectory) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR_PATH);
  }

  return (await imageDownload.downloadAsync())?.uri;
};

export const CreateItemDialog: React.FC<ICreateItemDialogProps> = ({
  isVisible,
  onCancel,
  onFinish,
}) => {
  const { createItem, items } = useItems();
  const [itemName, setItemName] = useState("");
  const [itemColor, setItemColor] = useState(colors[0]);
  const [containsAllergens, setContainsAllergens] = useState(false);
  const [nameFieldIsFocused, setNameFieldIsFocused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidItem, setIsValidItem] = useState(true);
  const [displayType, setDisplayType] = useState<ItemDisplayType>(
    ItemDisplayType.IMAGE
  );

  useEffect(() => {
    setIsValidItem(
      !!itemName && !items.find((item: Item) => item.name === itemName)
    );
  }, [itemName, setIsValidItem]);

  const resetDialog = useCallback(() => {
    setItemName("");
    setItemColor("");
    setSelectedImage({
      imageUrl: "",
      photographer: "",
    });
    setContainsAllergens(false);
  }, [setItemName, setItemColor, setSelectedImage, setContainsAllergens]);

  const onCreateItem = useCallback(async () => {
    setIsLoading(true);
    const imagePath = selectedImage?.imageUrl
      ? await saveImage(selectedImage?.imageUrl)
      : "";
    onFinish();
    await createItem({
      name: itemName,
      color: itemColor,
      containsAllergens: containsAllergens,
      imageUri: imagePath,
    });
    resetDialog();
    setIsLoading(false);
  }, [
    itemName,
    itemColor,
    containsAllergens,
    selectedImage,
    setIsLoading,
    resetDialog,
  ]);

  const selectImage = useCallback(
    (image?: ImageInfo) => {
      setSelectedImage((selectedImage) =>
        image?.imageUrl === selectedImage?.imageUrl ? undefined : image
      );
    },
    [setSelectedImage]
  );

  return (
    <Dialog
      ignoreBackgroundPress
      visible={isVisible}
      onDismiss={onCancel}
      overlayBackgroundColor={Colors.primary}
    >
      <Text h1 underline style={dialogStyles.title}>
        {"Neue Zutat"}
      </Text>
      <TextField
        text30M
        onFocus={() => setNameFieldIsFocused(true)}
        onBlur={() => setNameFieldIsFocused(false)}
        focusable
        labelColor={Colors.yellow80}
        value={itemName}
        style={[
          dialogStyles.textField,
          { color: !isValidItem ? Colors.alert : Colors.secondary },
        ]}
        h3
        floatingPlaceholder
        floatOnFocus
        placeholder={"Name"}
        floatingPlaceholderColor={Colors.contrast}
        floatingPlaceholderStyle={{
          ...dialogStyles.textFieldPlaceholder,
          marginVertical: nameFieldIsFocused && !!itemName ? 0 : 5,
          marginLeft: nameFieldIsFocused && !!itemName ? 0 : 5,
        }}
        onChange={(event: NativeSyntheticEvent<TextInputChangeEventData>) =>
          setItemName(event.nativeEvent.text)
        }
      />
      {!isValidItem && !!itemName && (
        <Text color={Colors.alert}>Name existiert bereits</Text>
      )}
      <Checkbox
        value={containsAllergens}
        onValueChange={(val: boolean) => setContainsAllergens(val)}
        label={"Enthält Allergene"}
        labelStyle={dialogStyles.checkBoxLabel}
        size={30}
        color={Colors.tertiary}
        containerStyle={dialogStyles.checkBoxContainer}
        style={dialogStyles.checkBox}
        iconColor={Colors.secondary}
      />
      <View style={{ height: 420 }}>
        <Text h3 style={{ color: Colors.secondary }}>
          {"Darstellung"}
        </Text>
        <RadioGroup
          style={{ paddingBottom: 30 }}
          initialValue={displayType}
          onValueChange={setDisplayType}
        >
          <Row style={{ justifyContent: "space-between", width: 250 }}>
            <RadioButton
              size={30}
              style={dialogStyles.radioButton}
              color={Colors.tertiary}
              labelStyle={dialogStyles.radioButtonLabel}
              value={ItemDisplayType.IMAGE}
              label={"Bild"}
            />
            <RadioButton
              size={30}
              style={dialogStyles.radioButton}
              color={Colors.tertiary}
              labelStyle={dialogStyles.radioButtonLabel}
              value={ItemDisplayType.COLOR}
              label={"Farbe"}
            />
          </Row>
        </RadioGroup>
        {displayType === ItemDisplayType.IMAGE && (
          <ImageSelector
            selectedImage={selectedImage}
            searchTerm={itemName}
            onSelectImage={selectImage}
          />
        )}
        {displayType === ItemDisplayType.COLOR && (
          <ColorSelector selectColor={setItemColor} selectedColor={itemColor} />
        )}
      </View>
      <View style={dialogStyles.buttonsContainer}>
        <Button
          style={dialogStyles.button}
          backgroundColor={Colors.contrast}
          onPress={onCancel}
        >
          <Icon size={40} name={"x"} color={Colors.secondary} />
        </Button>
        <Button
          disabled={!isValidItem}
          style={dialogStyles.button}
          backgroundColor={Colors.tertiary}
          onLongPress={() => {
            for (let index = 0; index < 8; index++) {
              onCreateItem();
            }
          }}
          onPress={onCreateItem}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <Icon size={40} name={"check"} color={Colors.secondary} />
          )}
        </Button>
      </View>
    </Dialog>
  );
};

const dialogStyles = StyleSheet.create({
  title: {
    marginTop: 10,
    marginBottom: 20,
    color: Colors.secondary,
    alignSelf: "center",
  },
  textField: {
    // width: "70%",
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.contrast,
  },
  textFieldPlaceholder: {
    width: "70%",
    height: 30,
    lineHeight: 32,
    marginTop: 20,
    paddingBottom: 60,
  },
  checkBoxContainer: {
    marginVertical: 20,
    height: 60,
  },
  checkBox: {
    borderRadius: 5,
    // borderColor: Colors.tertiary,
  },
  radioButton: {
    borderRadius: 30,
    // borderColor: Colors.tertiary,
  },
  radioButtonLabel: {
    color: Colors.secondary,
    fontSize: 32,
    lineHeight: 32 * 1.2,
    fontWeight: "200",
  },
  checkBoxLabel: {
    color: Colors.secondary,
    fontSize: 32,
    lineHeight: 32 * 1.2,
    fontWeight: "200",
  },
  buttonsContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 20,
  },
  button: {
    marginLeft: 10,
    borderRadius: 10,
    width: 300,
  },
});

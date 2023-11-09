import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Button from "react-native-ui-lib/button";
import TextField from "react-native-ui-lib/textField";
import Dialog from "react-native-ui-lib/dialog";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Icon from "@expo/vector-icons/Feather";
import { colors } from "../constants/Colors";
import { useCategories } from "../store/useCategories";
import { ColorSelector } from "./ColorSelector";
import { Category } from "../data/model";

interface ICreateCategoryDialogProps {
  isVisible: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

export const CreateCategoryDialog: React.FC<ICreateCategoryDialogProps> = ({
  isVisible,
  onCancel,
  onFinish,
}) => {
  const { createCategory, categories } = useCategories();
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("");
  const [nameFieldIsFocused, setNameFieldIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidName, setIsValidName] = useState(true);
  const resetDialog = useCallback(() => {
    setCategoryName("");
    setCategoryColor("");
  }, [setCategoryName, setCategoryColor]);
  useEffect(() => {
    setIsValidName(
      !!categoryName &&
        !categories.find((item: Category) => item.name === categoryName.trim())
    );
  }, [categoryName, setIsValidName]);

  const onCreateCategory = useCallback(async () => {
    setIsLoading(true);
    onFinish();
    createCategory({
      name: categoryName.trim(),
      color: categoryColor,
    });
    resetDialog();
    setIsLoading(false);
  }, [categoryName, categoryColor, setIsLoading, resetDialog]);

  return (
    <Dialog
      ignoreBackgroundPress
      visible={isVisible}
      overlayBackgroundColor={Colors.primary}
      onDismiss={onCancel}
    >
      <Text h1 underline style={dialogStyles.title}>
        {"Neuer Geschmack"}
      </Text>
      <TextField
        text30M
        onFocus={() => setNameFieldIsFocused(true)}
        onBlur={() => setNameFieldIsFocused(false)}
        focusable
        labelColor={Colors.yellow80}
        value={categoryName}
        style={[
          dialogStyles.textField,
          { color: !isValidName ? Colors.alert : Colors.secondary },
        ]}
        h3
        floatingPlaceholder
        floatOnFocus
        placeholder={"Name"}
        floatingPlaceholderColor={Colors.contrast}
        floatingPlaceholderStyle={{
          ...dialogStyles.textFieldPlaceholder,
          marginVertical: nameFieldIsFocused && !!categoryName ? 0 : 5,
          marginLeft: nameFieldIsFocused && !!categoryName ? 0 : 5,
        }}
        onChange={(event: NativeSyntheticEvent<TextInputChangeEventData>) =>
          setCategoryName(event.nativeEvent.text)
        }
      />
      {!isValidName && !!categoryName && (
              <Text color={Colors.alert}>Name existiert bereits</Text>
            )}
      <Text h3 style={dialogStyles.label}>
        {"Farbe"}
      </Text>
      <ColorSelector
        selectColor={setCategoryColor}
        selectedColor={categoryColor}
      />
      <View style={dialogStyles.buttonsContainer}>
        <Button
          style={dialogStyles.button}
          backgroundColor={Colors.contrast}
          onPress={onCancel}
        >
          <Icon size={40} name={"x"} color={Colors.secondary} />
        </Button>
        <Button
          disabled={!isValidName || !categoryColor}
          style={dialogStyles.button}
          backgroundColor={Colors.tertiary}
          // onLongPress={() => {
          //   for (let index = 0; index < 8; index++) {
          //     onCreateCategory();
          //   }
          // }}
          onPress={onCreateCategory}
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
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.secondary,
    // marginBottom: 20,
  },
  textFieldPlaceholder: {
    width: "70%",
    height: 50,
    lineHeight: 32,
    marginTop: 20,
    paddingBottom: 60,
  },
  checkBoxContainer: {
    marginBottom: 20,
  },
  checkBox: {
    borderRadius: 5,
    borderColor: Colors.secondary,
  },
  checkBoxLabel: {
    color: Colors.secondary,
    fontSize: 20,
  },
  label: {
    marginTop: 20,
    color: Colors.contrast,
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

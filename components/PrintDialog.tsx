import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";
import Button from "react-native-ui-lib/button";
import Chip from "react-native-ui-lib/chip";
import Switch from "react-native-ui-lib/switch";
import Dialog from "react-native-ui-lib/dialog";
import Text from "react-native-ui-lib/text";
import TouchableOpacity from "react-native-ui-lib/touchableOpacity";
import View from "react-native-ui-lib/view";
import Icon from "@expo/vector-icons/Feather";
import { useCategories } from "../store/useCategories";
import { useSelectedCategories } from "../store/useSelectedCategories";

interface IPrintDialogProps {
  isVisible: boolean;
  hasCategorySelection?: boolean;
  onCancel: () => void;
  onFinish: (hasPrintOffset: boolean) => void;
}

export const PrintDialog: React.FC<IPrintDialogProps> = ({
  isVisible,
  hasCategorySelection = true,
  onCancel,
  onFinish,
}) => {
  const { categories } = useCategories();
  const { selectedCategoryIds, toggleCategorySelection } =
    useSelectedCategories();

  const [hasPrintOffset, sethasPrintOffset] = useState(false);

  const onPrint = useCallback(() => {
    onFinish(hasPrintOffset);
    onCancel();
  }, [onFinish, onCancel, hasPrintOffset]);

  const toggleHasPrintOffset = useCallback(
    () => sethasPrintOffset((hasPrintOffset) => !hasPrintOffset),
    [sethasPrintOffset]
  );

  return (
    <Dialog
      ignoreBackgroundPress
      visible={isVisible}
      containerStyle={{ ...dialogStyles.container }}
      onDismiss={onCancel}
      overlayBackgroundColor={Colors.primary}
    >
      {hasCategorySelection && categories.length > 0 && (
        <>
          <Text h1 underline style={dialogStyles.title} color={Colors.secondary}>
            {"Drucken"}
          </Text>

          <Text h4 color={Colors.secondary}>
            {"Geschmack:"}
          </Text>


          <View
            center
            row
            style={{
              width: "80%",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {categories.map(({ id, name, color }, index) => {
              const isSelected = selectedCategoryIds.includes(id);
              return (
                <Chip
                  key={id}
                  backgroundColor={isSelected ? Colors.primary : color}
                  label={name}
                  labelStyle={{
                    color: isSelected ? Colors.contrast : Colors.primary,
                    fontSize: 32,
                    lineHeight: 36,
                  }}
                  containerStyle={{
                    marginVertical: 15,
                    marginHorizontal: 10,
                    paddingHorizontal: 15,
                    height: 80,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? Colors.contrast : Colors.secondary,
                  }}
                  onPress={() => toggleCategorySelection(id)}
                />
              );
            })}
          </View>
          <View
            style={{
              marginTop: 30,
              height: StyleSheet.hairlineWidth,
              width: "80%",
              backgroundColor: Colors.contrast,
            }}
          />
        </>
      )}
      <TouchableOpacity
        onPress={() => toggleHasPrintOffset()}
        row
        style={{
          width: 260,
          height: 100,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Switch
          value={hasPrintOffset}
          onValueChange={() => toggleHasPrintOffset()}
          onColor={Colors.tertiary}
          offColor={Colors.primary}
          thumbColor={Colors.secondary}
          width={80}
          height={38}
          thumbSize={34}
          style={{ borderWidth: 1, borderColor: Colors.secondary }}
        />
        <Text color={Colors.secondary} h4>
          Mit Lochung
        </Text>
      </TouchableOpacity>
      <View style={dialogStyles.buttonsContainer}>
        <Button
          style={dialogStyles.button}
          backgroundColor={Colors.contrast}
          onPress={onCancel}
        >
          <Icon size={60} name={"x"} color={Colors.secondary} />
        </Button>
        <Button
          style={dialogStyles.button}
          backgroundColor={Colors.tertiary}
          onPress={onPrint}
        >
          <Icon size={60} name={"check"} color={Colors.secondary} />
        </Button>
      </View>
    </Dialog>
  );
};

const dialogStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 20,
    marginBottom: 20,
  },
  button: {
    marginLeft: 10,
    borderRadius: 10,
    width: 300,
  },
  checkBoxContainer: {
    marginVertical: 20,
    justifyContent: "center",
  },
  checkBox: {
    height: 40,
    width: 40,
  },
});

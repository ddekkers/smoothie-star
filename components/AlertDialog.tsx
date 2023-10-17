import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";
import Button from "react-native-ui-lib/button";
import Dialog from "react-native-ui-lib/dialog";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Icon from "@expo/vector-icons/Feather";

interface IAlertDialogProps {
  isVisible: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const AlertDialog: React.FC<IAlertDialogProps> = ({
  isVisible,
  onCancel,
  onConfirm,
  title,
  description,
}) => {
  const [test, setTEst] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setTEst(true);
    }, 1500);
  }, [setTEst]);
  return (
    <Dialog
      ignoreBackgroundPress
      visible={isVisible}
      containerStyle={{
        ...dialogStyles.container,
        backgroundColor: Colors.primary,
      }}
      onDismiss={onCancel}
    >
      <Text h3 style={dialogStyles.title}>
        {title}
      </Text>
      <Text p style={dialogStyles.descriptionText}>
        {description}
      </Text>

      <View style={dialogStyles.buttonsContainer}>
        <Button
          style={dialogStyles.button}
          backgroundColor={Colors.tertiary}
          onPress={onConfirm}
        >
          <Icon size={20} name={"check"} color={Colors.secondary} />
        </Button>
        {onCancel && (
          <Button
            style={dialogStyles.button}
            backgroundColor={Colors.contrast}
            onPress={onCancel}
          >
            <Icon size={20} name={"x"} color={Colors.secondary} />
          </Button>
        )}
      </View>
    </Dialog>
  );
};

const dialogStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 10,
    color: Colors.secondary,
  },
  descriptionText: {
    marginTop: 10,
    color: Colors.secondary,
  },
  buttonsContainer: {
    flexDirection: "row-reverse",
    paddingVertical: 20,
  },
  button: {
    marginLeft: 10,
    borderRadius: 10,
  },
});

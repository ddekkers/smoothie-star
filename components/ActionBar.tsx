import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Colors } from "react-native-ui-lib";
import BottomSheet from "reanimated-bottom-sheet";
import { useSelectedCategories } from "../store/useSelectedCategories";
import { useSelectedItems } from "../store/useSelectedItems";
import { IconButton } from "./IconButton";
import { useNavigation, useRouter } from "expo-router";
import { Row } from "./Row";
import { FloatingButton } from "./FloatingButton";

interface IActionBarProps {
  onClickPrint: () => void;
}

export const ActionBar: React.FC<IActionBarProps> = ({ onClickPrint }) => {
  const { selectedItemIds, resetItemSelection } = useSelectedItems();
  const { resetCategorySelection } = useSelectedCategories();

  const resetSelection = useCallback(() => {
    resetItemSelection();
    resetCategorySelection();
  }, [resetItemSelection, resetCategorySelection]);

  const router = useRouter();

  return (
    <Row
      style={{
        // borderWidth: 3,
        // height: 150,
        width: "100%",
        justifyContent: "center",
        alignItems:"center",
        marginBottom: 30,

        gap: 30
      }}
    >
      <View >
    <FloatingButton  icon={"list"} onPress={() => router.push("printlog")}/>
        
      </View>
      <View>
    <FloatingButton primary icon={"print"} onPress={onClickPrint} isDisabled={selectedItemIds.length <= 0}/>
      </View>
      <View>
    <FloatingButton icon={"undo"} onPress={resetSelection} isDisabled={selectedItemIds.length <= 0}/>
      </View>
    </Row>
  );
};

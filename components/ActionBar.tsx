import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Colors } from "react-native-ui-lib";
import BottomSheet from "reanimated-bottom-sheet";
import { useSelectedCategories } from "../store/useSelectedCategories";
import { useSelectedItems } from "../store/useSelectedItems";
import { IconButton } from "./IconButton";
import { PrintLogList } from "./PrintLogList";
import { useNavigation, useRouter } from "expo-router";

interface IActionBarProps {
  onClickPrint: () => void;
}

const SNAP_POINTS = ["100%", 250];
const INITIAL_SNAP_POINT = SNAP_POINTS.length - 1;
export const ActionBar: React.FC<IActionBarProps> = ({
  onClickPrint,
}) => {
  const { selectedItemIds, resetItemSelection } = useSelectedItems();
  const { resetCategorySelection } = useSelectedCategories();

  const resetSelection = useCallback(() => {
    resetItemSelection();
    resetCategorySelection();
  }, [resetItemSelection, resetCategorySelection]);

  const router = useRouter();

  return (
    <View style={[{ flex: 1, alignItems: "center" }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >

        <IconButton onPress={() => router.push("printlog")} name={"list"} />
        <IconButton
          primary
          onPress={onClickPrint}
          name={"printer"}
          isDisabled={selectedItemIds.length <= 0}
        />
        <IconButton
          onPress={resetSelection}
          name={"x"}
          isDisabled={selectedItemIds.length <= 0}
        />
      </View>
    </View>
  );
};

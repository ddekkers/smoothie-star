import Text from "react-native-ui-lib/text";
import { Link } from "expo-router";
import * as React from "react";
import { useCallback, useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";
import GridView from "react-native-ui-lib/gridView";
import View from "react-native-ui-lib/view";
import { ActionBar } from "../../../components/ActionBar";
import { ItemCard } from "../../../components/ItemCard";
import { PrintDialog } from "../../../components/PrintDialog";
import { useItems } from "../../../store/useItems";
import { usePrintData } from "../../../store/usePrintData";
import { useScreenDimensions } from "../../../store/useScreenDimensions";
import { useSelectedCategories } from "../../../store/useSelectedCategories";
import { useSelectedItems } from "../../../store/useSelectedItems";

export default function ItemSelection() {
  const { availableItems, isLoading } = useItems();
  const { getWidthPercent, getHeightPercent } = useScreenDimensions();
  const { print } = usePrintData();
  const { selectedItemIds, toggleSelection } = useSelectedItems();
  const { selectedCategoryIds } = useSelectedCategories();

  const [isPrintDialogVisible, setIsPrintDialogVisible] = useState(false);

  const showPrintDialog = useCallback(
    () => setIsPrintDialogVisible(true),
    [setIsPrintDialogVisible]
  );
  const hidePrintDialog = useCallback(
    () => setIsPrintDialogVisible(false),
    [setIsPrintDialogVisible]
  );
  const onFinish = useCallback(
    (hasPrintOffset: boolean) =>
      print(hasPrintOffset, selectedItemIds, selectedCategoryIds),
    [selectedItemIds, selectedCategoryIds]
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {!isLoading && availableItems.length > 0 && (
          <GridView
            numColumns={3}
            itemSpacing={0}
            viewWidth={Dimensions.get("screen").width}
            items={availableItems.map((item) => ({
              renderCustomItem: () => (
                <View key={item.id} style={{ marginTop: 20 }}>
                  <ItemCard
                    width={getWidthPercent(32)}
                    height={getHeightPercent(15)}
                    item={item}
                    showIndicator
                    selectedItemIds={selectedItemIds}
                    onSelect={toggleSelection}
                  />
                </View>
              ),
            }))}
          />
        )}
        {!isLoading && availableItems.length <= 0 && (
          <View style={styles.textContainer}>
            <Text color={Colors.tertiary} h1 style={styles.text}>
              {"Keine Einträge"}
            </Text>
            <Text color={Colors.tertiary} h4 style={styles.text}>
              {
                "Es befinden sich keine verfügbaren Zutaten in der aktuellen Auswahl. Bitte wechseln Sie in das Inventar, um dort Einträge anzulegen und auszuwählen."
              }
            </Text>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Link href={"/(toptabs)"}>
                <Text h3 color={Colors.tertiary}>
                  {"Zum Inventar springen"}
                </Text>
              </Link>
            </View>
          </View>
        )}
      </View>
      {/* <View height={200} style={{borderWidth: 1}}> */}
      <ActionBar onClickPrint={showPrintDialog} />
      {/* </View> */}

      <PrintDialog
        isVisible={isPrintDialogVisible}
        onCancel={hidePrintDialog}
        onFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    paddingVertical: 50,
    justifyContent: "center",
    flex: 1,
  },
  text: {
    paddingHorizontal: 30,
    textAlign: "center",
    color: Colors.secondary,
  },
});

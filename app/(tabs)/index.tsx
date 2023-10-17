import Text from "react-native-ui-lib/text";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Link } from "expo-router";
import * as React from "react";
import { useCallback, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet
} from "react-native";
import { Colors } from "react-native-ui-lib";
import GridView from "react-native-ui-lib/gridView";
import View from "react-native-ui-lib/view";
import { ActionBar } from "../../components/ActionBar";
import { ItemCard } from "../../components/ItemCard";
import { PrintDialog } from "../../components/PrintDialog";
import { useItems } from "../../store/useItems";
import { usePrintData } from "../../store/usePrintData";
import { useScreenDimensions } from "../../store/useScreenDimensions";
import { useSelectedCategories } from "../../store/useSelectedCategories";
import { useSelectedItems } from "../../store/useSelectedItems";

export default function ItemSelection() {
  const { availableItems, isLoading } = useItems();
  const { getWidthPercent, getHeightPercent } = useScreenDimensions();
  const { print } = usePrintData();
  const { selectedItemIds } = useSelectedItems();
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <GridView
          numColumns={3}
          itemSpacing={0}
          viewWidth={Dimensions.get("screen").width}
          items={availableItems.map((item) => ({
            renderCustomItem: () => (
              <View key={item.id} style={{ marginTop: 40 }}>
                <ItemCard
                  width={getWidthPercent(31)}
                  height={getHeightPercent(15)}
                  item={item}
                  showIndicator
                />
              </View>
            ),
          }))}
        />
        {!isLoading && availableItems.length <= 0 && (
          <View style={styles.textContainer}>
            <Text h1 style={styles.text}>
              {"Keine Einträge"}
            </Text>
            <Text h4 style={styles.text}>
              {
                "Es befinden sich keine Einträge in der aktuellen Auswahl. Bitte wechseln Sie in die Einstellungen, um dort Einträge anzulegen und auszuwählen."
              }
            </Text>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Link href={"/(toptabs)"}>
                <Text h3 color={Colors.secondary}>
                  {"Zu den Einstellungen"}
                </Text>
              </Link>
            </View>
          </View>
        )}
      </ScrollView>
      <View height={150}>
        <ActionBar
          onClickPrint={showPrintDialog}
        />
      </View>

      <PrintDialog
        isVisible={isPrintDialogVisible}
        onCancel={hidePrintDialog}
        onFinish={(hasPrintOffset: boolean) =>
          print(hasPrintOffset, selectedItemIds, selectedCategoryIds)
        }
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
  },
  text: {
    paddingHorizontal: 30,
    textAlign: "center",
    color: Colors.secondary,
  },
});

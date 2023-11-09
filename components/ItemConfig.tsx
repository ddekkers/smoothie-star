import * as React from "react";
import { createRef, useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInputChangeEventData,
} from "react-native";
import { Colors, Incubator } from "react-native-ui-lib";
import Button from "react-native-ui-lib/button";
import ListItem from "react-native-ui-lib/listItem";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Icon from "@expo/vector-icons/Feather";
import { AlertDialog } from "../components/AlertDialog";
import { CreateItemDialog } from "../components/CreateItemDialog";
import { FloatingButton } from "../components/FloatingButton";
import { ItemImage } from "../components/ItemImage";
import { Item } from "../data/model";
import { useItems } from "../store/useItems";
import { ImmutableArray } from "@hookstate/core";
import { MAX_AVAILABLE_ITEMS_COUNT } from "../const";
import { NeumorphicButton } from "./NeumorphicButton";
import { IconButton } from "./IconButton";
import { Row } from "./Row";

interface IItemConfigScreenProps {}

const renderItem = (
  item: Item,
  onPress: (id: string, is_available: boolean) => Promise<void>,
  onAttemptItemDeletion: (itemId: string) => void
) => {
  return (
    <View
      key={item.id}
      style={[
        styles.itemContainer,
        {
          backgroundColor: item.is_available ? Colors.tertiary : Colors.primary,
        },
      ]}
    >
      <ListItem
        activeBackgroundColor={Colors.contrast}
        activeOpacity={0.3}
        height={100}
        onPress={() => onPress(item.id, item.is_available)}
        style={{
          width: "100%",
        }}
      >
        <ListItem.Part left containerStyle={styles.imageContainer}>
          {item.image_uri ? (
            <ItemImage imageUrl={item.image_uri} width={70} height={70} />
          ) : (
            <View
              style={{
                backgroundColor: item.color || Colors.contrast,
                width: 70,
                height: 70,
                borderRadius: 16,
              }}
            />
          )}
        </ListItem.Part>
        <ListItem.Part middle column>
          <ListItem.Part>
            <Text h3>{item.name}</Text>
          </ListItem.Part>
          {item.contains_allergens && (
            <ListItem.Part>
              <Text>Enthält Allergene</Text>
            </ListItem.Part>
          )}
        </ListItem.Part>
        <ListItem.Part right containerStyle={{ paddingRight: 30 }}>
          <Button
            avoidMinWidth
            onPress={() => onAttemptItemDeletion(item.id)}
            style={{ backgroundColor: "transparent" }}
          >
            <Icon size={20} color={Colors.secondary} name={"trash-2"} />
          </Button>
        </ListItem.Part>
      </ListItem>
    </View>
  );
};

const prepareData = (items: ImmutableArray<Item>, searchText: string) => {
  const searchLetters = searchText.toLowerCase().split("");
  return Array.from(items)
    .sort((item1, item2) =>
      item1.name > item2.name ? 1 : item2.name > item1.name ? -1 : 0
    )
    .filter((item) => {
      const itemLetters = item.name.toLowerCase().split("");
      return searchLetters.every((letter) => itemLetters.includes(letter));
    });
};

export const ItemConfig: React.FC<IItemConfigScreenProps> = ({ ...props }) => {
  const {
    deleteAllItems,
    deleteItem,
    items,
    toggleItemAvailability,
    resetAllItemAvailabilities,
  } = useItems();

  const [showCreateItemDialog, setShowCreateItemDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [deletingItem, setDeletingItem] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  const onCloseDialog = useCallback(() => {
    setShowCreateItemDialog(false);
  }, [setShowCreateItemDialog]);
  const onResetItems = useCallback(() => {
    setShowResetDialog(false);
    resetAllItemAvailabilities();
  }, [setShowResetDialog]);
  const onDeleteAllItems = useCallback(() => {
    setShowDeleteAllDialog(false);
    deleteAllItems();
  }, [setShowDeleteAllDialog]);
  const onDeleteItem = useCallback(() => {
    setDeletingItem("");
    deleteItem(deletingItem);
  }, [deletingItem, setDeletingItem]);
  const onSelectItem = useCallback(
    async (id: string, isSelected: boolean) => {
      if (
        isSelected ||
        items.filter((item) => item.is_available).length <
          MAX_AVAILABLE_ITEMS_COUNT
      ) {
        await toggleItemAvailability(id);
      } else {
        setLimitReached(true);
      }
    },
    [toggleItemAvailability, setLimitReached, items]
  );

  const searchTextFieldRef = createRef<any>();
  const flatListRef = createRef<FlatList<any>>();
  const focusSearchField = useCallback(() => {
    setIsSearchFocused(true);
    searchTextFieldRef.current?.focus();
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [searchTextFieldRef, flatListRef, setIsSearchFocused]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={() => (
          <Incubator.TextField
            ref={searchTextFieldRef}
            autoFocus={isSearchFocused}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            text50M
            labelColor={Colors.yellow80}
            value={searchText}
            style={styles.searchTextField}
            placeholder={"Suche"}
            containerStyle={styles.searchTextFieldContainer}
            onChange={(event: NativeSyntheticEvent<TextInputChangeEventData>) =>
              setSearchText(event.nativeEvent.text)
            }
          />
        )}
        ListFooterComponent={() => (
          <View style={styles.listFooterContainer}>
            <Button
              backgroundColor={"transparent"}
              onPress={() => setShowDeleteAllDialog(true)}
            >
              <Text h3 color={Colors.alert}>
                {"Alle löschen"}
              </Text>
            </Button>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              width: "100%",
              backgroundColor: Colors.contrast,
            }}
          />
        )}
        data={prepareData(items, searchText)}
        renderItem={({ item }) =>
          renderItem(item, onSelectItem, setDeletingItem)
        }
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
      />
      {/* <ScrollView>
        <Text>{"Config15"}</Text>
      </ScrollView> */}

      {/* -------- Floating Components -------- */}
      <Row
        style={{
          // height: 130,
          position: "absolute",
          right: 50,
          bottom: 30,
          flexDirection: "column",
          gap: 10,
        }}
      >
        <View>
          <FloatingButton icon={"search"} onPress={focusSearchField} />
        </View>
        <View>
          <FloatingButton
            icon={"undo"}
            onPress={() => setShowResetDialog(true)}
          />
        </View>
        <View>
          <FloatingButton
            icon={"plus"}
            onPress={() => setShowCreateItemDialog(true)}
          />
        </View>
      </Row>
      <CreateItemDialog
        isVisible={showCreateItemDialog}
        onFinish={onCloseDialog}
        onCancel={() => setShowCreateItemDialog(false)}
      />
      <AlertDialog
        isVisible={showResetDialog}
        onConfirm={onResetItems}
        onCancel={() => setShowResetDialog(false)}
        title={"Verfügbare Zutaten zurücksetzen?"}
        description={"Diese Aktion kann nicht rückgängig gemacht werden."}
      />
      <AlertDialog
        isVisible={limitReached}
        onConfirm={() => setLimitReached(false)}
        title={"Limit erreicht"}
        description={
          "Die maximale Anzahl an aktuell verfügbaren Zutaten wurde erreicht. Um weitere Zutaten auszuwählen, müssen andere aus der Auswahl entfernt werden."
        }
      />
      <AlertDialog
        isVisible={showDeleteAllDialog}
        onConfirm={onDeleteAllItems}
        onCancel={() => setShowDeleteAllDialog(false)}
        title={"Alle Zutaten löschen?"}
        description={"Diese Aktion kann nicht rückgängig gemacht werden."}
      />
      <AlertDialog
        isVisible={!!deletingItem}
        onConfirm={onDeleteItem}
        onCancel={() => setDeletingItem("")}
        title={"Zutat löschen?"}
        description={"Diese Aktion kann nicht rückgängig gemacht werden."}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  imageContainer: {
    margin: 20,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    height: 100,
  },
  listFooterContainer: {
    alignItems: "center",
    marginBottom: 220,
  },
  searchTextField: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: Colors.contrast,
    marginBottom: 20,
    backgroundColor: Colors.primary,
  },
  searchTextFieldContainer: {
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    paddingTop: 30,
  },
});

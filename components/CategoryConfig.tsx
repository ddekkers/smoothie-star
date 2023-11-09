import * as React from "react";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Colors, ListItem } from "react-native-ui-lib";
import Button from "react-native-ui-lib/button";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Icon from "@expo/vector-icons/Feather";
import { AlertDialog } from "./AlertDialog";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { FloatingButton } from "./FloatingButton";
import { Category } from "../data/model";
import { useCategories } from "../store/useCategories";
import { Row } from "./Row";

interface ICategoryConfigScreenProps {}

const renderCategory = (
  category: Category,
  onDeleteCategory: (itemId: string) => void
) => {
  return (
    <View
      key={category.id}
      style={[
        styles.categoryContainer,
        {
          backgroundColor: category.color || Colors.contrast,
        },
      ]}
    >
      <ListItem.Part
        middle
        column
        containerStyle={{
          marginLeft: 20,
          backgroundColor: category.color || Colors.contrast,
        }}
      >
        <ListItem.Part>
          <Text color={Colors.secondary} h3>
            {category.name}
          </Text>
        </ListItem.Part>
      </ListItem.Part>
      <ListItem.Part right containerStyle={{ paddingRight: 30 }}>
        <Button
          avoidMinWidth
          onPress={() => onDeleteCategory(category.id)}
          style={{ backgroundColor: "transparent" }}
        >
          <Icon size={20} color={Colors.secondary} name={"trash-2"} />
        </Button>
      </ListItem.Part>
    </View>
  );
};

export const CategoryConfig: React.FC<ICategoryConfigScreenProps> = ({
  ...props
}) => {
  const { categories, createCategory, deleteAllCategories, deleteCategory } =
    useCategories();

  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] =
    useState(false);
  const onCloseDialog = useCallback(() => {
    setShowCreateCategoryDialog(false);
  }, [setShowCreateCategoryDialog]);
  const onDeleteAllCategories = useCallback(() => {
    setShowDeleteAllDialog(false);
    deleteAllCategories();
  }, [setShowDeleteAllDialog]);
  return (
    <View style={styles.container}>
      <FlatList
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
        data={Array.from(categories).sort((cat1: Category, cat2: Category) =>
          cat1.name > cat2.name ? 1 : cat2.name > cat1.name ? -1 : 0
        )}
        renderItem={({ item: category }) =>
          renderCategory(category, deleteCategory)
        }
        keyExtractor={(cateogry) => cateogry.id}
        style={{ width: "100%" }}
      />
      <Row
        style={{
          position: "absolute",
          right: 100,
          bottom: 30,
          flexDirection: "column-reverse",
        }}
      >
        <View>
          <FloatingButton
            icon={"plus"}
            onPress={() => setShowCreateCategoryDialog(true)}
          />
        </View>
      </Row>
      <CreateCategoryDialog
        isVisible={showCreateCategoryDialog}
        onFinish={onCloseDialog}
        onCancel={() => setShowCreateCategoryDialog(false)}
      />

      <AlertDialog
        isVisible={showDeleteAllDialog}
        onConfirm={onDeleteAllCategories}
        onCancel={() => setShowDeleteAllDialog(false)}
        title={"Alle Geschmäcker löschen?"}
        description={"Diese Aktion kann nicht rückgängig gemacht werden."}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    height: 100,
  },
  listFooterContainer: {
    alignItems: "center",
    marginBottom: 220,
  },
});

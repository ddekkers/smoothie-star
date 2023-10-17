import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "react-native-ui-lib";
import { CategoryConfig } from "../../../components/CategoryConfig";
import { ItemConfig } from "../../../components/ItemConfig";

export type ConfigTopTabParamList = {
  Zutaten: undefined;
  Geschmäcker: undefined;
};

const Tab = createMaterialTopTabNavigator<ConfigTopTabParamList>();

export default function TopTabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors.primary },
        tabBarIndicatorStyle: { backgroundColor: Colors.secondary },
        tabBarLabelStyle: {
          fontSize: 24,
          color: Colors.secondary,
          textTransform: "none",
        },
      }} 
    >
      <Tab.Screen name={"Zutaten"} component={ItemConfig} />
      <Tab.Screen name={"Geschmäcker"} component={CategoryConfig} />
    </Tab.Navigator>
  );
}

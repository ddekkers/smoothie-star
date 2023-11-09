import FontAwesome from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Colors } from "react-native-ui-lib";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={32} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 80 },
        tabBarLabel: () => null,
        tabBarActiveTintColor: Colors.tertiary,
      }}
      initialRouteName="(drinks)"
    >
      <Tabs.Screen
        name="(drinks)"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="glass-cocktail" color={color} />
          ),
          headerTitleStyle: { fontSize: 24 },
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitle:"Drinks",
          headerRight: () => (
            <Link href="/imprint" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="information-outline"
                    size={32}
                    color={Colors.secondary}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="(toptabs)"
        options={{
          title: "",
          headerTitle: "Inventar",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="fruit-grapes-outline" color={color} />
          ),
          headerTitleStyle: { fontSize: 24 },
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          tabBarIconStyle:{width: 200},
          headerRight: () => (
            <Link href="/imprint" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="information-outline"
                    size={32}
                    color={Colors.secondary}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}

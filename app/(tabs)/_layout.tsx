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
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Drinks",
          tabBarIcon: ({ color }) => <TabBarIcon name="glass-cocktail" color={color} />,
          headerRight: () => (
            <Link href="/imprint" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="information-outline"
                    size={25}
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
          title: "Inventar",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="fruit-grapes-outline" color={color} />,
          headerRight: () => (
            <Link href="/imprint" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="information-outline"
                    size={25}
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

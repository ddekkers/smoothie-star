import * as Sentry from "sentry-expo";
import Feather from "@expo/vector-icons/Feather";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, useColorScheme } from "react-native";
import { DatabaseConnectionProvider } from "../data/connection";
import { Colors } from "react-native-ui-lib";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

Sentry.init({
  dsn: "https://c74dee1bb74d4913b8ba59c5f5a55448@o244067.ingest.sentry.io/1420596",
  enableInExpoDevelopment: true,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...Feather.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DatabaseConnectionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="imprint"
            options={{
              presentation: "modal",
              title: "Impressum",
              headerRight: () => (
                <Pressable onPress={() => router.back()}>
                  {({ pressed }) => (
                    <Feather
                      name="x"
                      size={25}
                      color={Colors.secondary}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="printlog"
            options={{
              presentation: "modal",
              title: "Druck-Historie",
              headerRight: () => (
                <Pressable onPress={() => router.back()}>
                  {({ pressed }) => (
                    <Feather
                      name="x"
                      size={25}
                      color={Colors.secondary}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              ),
            }}
          />
          {/* <Stack.Screen name="imprint" options={{ presentation: 'modal' }} /> */}
        </Stack>
      </DatabaseConnectionProvider>
    </ThemeProvider>
  );
}

import "@/assets/css/main.css";
import { AuthContextProvider } from "@/lib/auth-context";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthContextProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(protected)"
              options={{
                animation: "none",
              }}
            />
            <Stack.Screen
              name="sign-in"
              options={{
                animation: "none",
              }}
            />
            <Stack.Screen
              name="sign-up"
              options={{
                animation: "none",
              }}
            />
          </Stack>
        </AuthContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

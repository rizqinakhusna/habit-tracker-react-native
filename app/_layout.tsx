import "@/assets/css/main.css";
import { AuthContextProvider } from "@/lib/auth-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
      </Stack>
    </AuthContextProvider>
  );
}

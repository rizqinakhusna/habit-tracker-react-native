import { useAuthContext } from "@/lib/auth-context";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { session, isAuthStatesReady } = useAuthContext();
  if (!isAuthStatesReady) return null;
  if (!session?.user) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}

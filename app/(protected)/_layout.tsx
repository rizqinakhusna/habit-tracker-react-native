import { useAuthContext } from "@/lib/auth-context";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { session } = useAuthContext();

  return !session ? (
    <Redirect href={"/sign-in"} />
  ) : (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}

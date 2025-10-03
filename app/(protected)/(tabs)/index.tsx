import { useAuthContext } from "@/lib/auth-context";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

const HomeScreen = () => {
  const { signOut } = useAuthContext();
  return (
    <View>
      <Button mode="outlined" onPress={signOut}>
        Signout
      </Button>
    </View>
  );
};

export default HomeScreen;

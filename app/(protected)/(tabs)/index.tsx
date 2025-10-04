import { useAuthContext } from "@/lib/auth-context";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

const HomeScreen = () => {
  const { signOut } = useAuthContext();
  return (
    <View>
      <Text>Home Screen</Text>
      <Button mode="outlined" onPress={signOut}>
        Signout
      </Button>
    </View>
  );
};

export default HomeScreen;

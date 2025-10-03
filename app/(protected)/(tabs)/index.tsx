import { useAuthContext } from "@/lib/auth-context";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { signOut } = useAuthContext();
  return (
    <SafeAreaView>
      <View>
        <Text>Home Screen</Text>
        <Button mode="outlined" onPress={signOut}>
          Signout
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

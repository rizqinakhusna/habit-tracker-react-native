import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SigninScreen = () => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <TextInput
            label={"Email"}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter email.."
            mode="outlined"
          />
          <TextInput
            label={"Password"}
            autoCapitalize="none"
            placeholder="Enter email.."
            mode="outlined"
          />
          <Button>Sign In</Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SigninScreen;

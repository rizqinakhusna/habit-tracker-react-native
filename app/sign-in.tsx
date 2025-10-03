import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SigninScreen = () => {
  return (
    <SafeAreaView className="h-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex flex-col h-full"
      >
        <View className="my-auto px-5">
          <Text variant="headlineLarge" className=" mx-auto mb-10">
            Sign In
          </Text>
          <View className=" gap-6">
            <TextInput
              label={"Email"}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter email.."
              mode="outlined"
            />
            <TextInput
              secureTextEntry
              label={"Password"}
              placeholder="Enter password.."
              mode="outlined"
            />
            <Button mode="outlined">Sign In</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SigninScreen;

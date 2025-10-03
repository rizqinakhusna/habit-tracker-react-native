import { useAuthContext } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SigninScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<boolean>();

  const { signIn } = useAuthContext();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError(true);
      return;
    }

    // const { res, error } = signIn();
  };

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
              onChangeText={setEmail}
            />
            <TextInput
              secureTextEntry
              label={"Password"}
              placeholder="Enter password.."
              mode="outlined"
              onChangeText={setPassword}
            />
            {error && (
              <Text className=" !text-red-500">
                *Please fill the input fields
              </Text>
            )}

            <Button mode="contained" onPress={handleSignIn}>
              Sign In
            </Button>
            <Button mode="text" onPress={() => router.replace("/sign-up")}>
              Don't have an account? Sign Up
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SigninScreen;

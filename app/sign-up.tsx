import { useAuthContext } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React, { useState, useTransition } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = () => {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleSignup = () => {
    if (!email || !password) {
      setError("*Please fill the input fields");
      return;
    }

    startTransition(async () => {
      const { err } = await signUp({ email, password });
      if (err) {
        setError(err.message);
      }
    });
  };

  return (
    <SafeAreaView className="h-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex flex-col h-full"
      >
        <View className="my-auto px-5">
          <Text variant="headlineLarge" className=" mx-auto mb-10">
            Sign Up
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
            {error && <Text className=" !text-red-500">{error}</Text>}

            <Button
              mode="contained"
              onPress={handleSignup}
              disabled={isPending}
              loading={isPending}
            >
              Sign Up
            </Button>
            <Button mode="text" onPress={() => router.replace("/sign-up")}>
              Already have an account? Sign in
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

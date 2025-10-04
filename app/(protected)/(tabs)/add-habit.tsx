import { useAuthContext } from "@/lib/auth-context";
import supabase from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useTransition } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const frequencies = ["daily", "weekly", "monthly"] as const;
type Frequency = (typeof frequencies)[number];

const AddHabitScreen = () => {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const { session } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const theme = useTheme();
  const router = useRouter();

  const onAddHabit = () => {
    if (!description || !title) {
      return setError("*Title & Description are required");
    }
    try {
      startTransition(async () => {
        const { error } = await supabase.from("Habits").insert([
          {
            title,
            description,
            frequency,
            user_id: session?.user?.id,
            streaks_count: 0,
            last_completed: new Date().toISOString(),
          },
        ]);

        if (error) {
          setError(error.message);
          throw error;
        }

        startTransition(() => {
          setDescription("");
          setTitle("");
          setFrequency("daily");
        });
      });

      router.replace("/");
    } catch (error) {
      console.log("habits creation error: ", (error as PostgrestError).message);
    }
  };

  useEffect(() => {
    setError(undefined);
  }, [title, setDescription, frequency]);

  return (
    <KeyboardAvoidingView className="gap-4 flex-1 justify-center   px-6">
      <TextInput
        value={title}
        placeholder="Enter title"
        mode="outlined"
        label={"Title"}
        onChangeText={setTitle}
      />
      <TextInput
        value={description}
        placeholder="Enter description"
        mode="outlined"
        label={"Description"}
        onChangeText={setDescription}
      />

      <View className="mb-10">
        <SegmentedButtons
          value={frequency as Frequency}
          onValueChange={setFrequency}
          buttons={frequencies.map((freq) => ({
            value: freq,
            label: freq[0]?.toUpperCase() + freq.slice(1),
          }))}
        />
      </View>
      {error && (
        <Text
          style={{
            color: theme.colors.error,
          }}
        >
          {error}
        </Text>
      )}
      <Button
        mode="contained"
        onPress={onAddHabit}
        disabled={isPending}
        loading={isPending}
      >
        Add Habit
      </Button>
    </KeyboardAvoidingView>
  );
};

export default AddHabitScreen;

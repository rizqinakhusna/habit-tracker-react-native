import { useAuthContext } from "@/lib/auth-context";
import supabase from "@/lib/supabase";
import { Habit } from "@/lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

const HomeScreen = () => {
  const { signOut, session } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>();

  useEffect(() => {
    async function getHabitsFromDatabase() {
      try {
        const { data, error } = await supabase
          .from("Habits")
          .select("*")
          .eq("user_id", session?.user.id);
        if (error) {
          throw error;
        }
        setHabits(data);
      } catch (error) {
        console.log("habits fetch error: ", error as PostgrestError);
      }
    }

    getHabitsFromDatabase();
  }, [session]);
  return (
    <View>
      <Text>{JSON.stringify(habits)}</Text>

      <Button mode="outlined" onPress={signOut}>
        Signout
      </Button>
    </View>
  );
};

export default HomeScreen;

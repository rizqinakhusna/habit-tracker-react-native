import { useAuthContext } from "@/lib/auth-context";
import supabase from "@/lib/supabase";
import { Habit } from "@/lib/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PostgrestError } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, ToastAndroid, View } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { Badge, Button, Card, Text, useTheme } from "react-native-paper";

const HomeScreen = () => {
  const { signOut, session } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>();
  const [completionHabits, setCompletionHabits] = useState<number[]>();
  const theme = useTheme();

  const swipeableRefs = useRef<{
    [key: string]: SwipeableMethods | null;
  }>({});

  const isCompleted = (habitId: number) => completionHabits?.includes(habitId);

  async function getTodayCompletions() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("HabitCompletions")
        .select("*")
        .eq("user_id", session?.user.id)
        .gte("completed_at", today.toISOString());

      if (error) {
        throw new Error(error.message);
      }

      const ids = data.map((item) => item.habit_id);

      setCompletionHabits(ids);
    } catch (error) {
      console.error("completion habit fetch error: ", error);
    }
  }

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

  async function onCompleteHabit(habitId: number) {
    if (isCompleted(habitId)) {
      ToastAndroid.show("Habit Already Completed!", ToastAndroid.SHORT);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("HabitCompletions")
        .insert({
          habit_id: habitId,
          user_id: session?.user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const habit = habits?.find((h) => h.id === habitId);

      if (!habit || !data) return;

      const { data: updatedHabit, error: updateHabitError } = await supabase
        .from("Habits")
        .update({
          streaks_count: habit.streaks_count + 1,
          last_completed: data.completed_at,
        })
        .eq("id", habitId);

      if (updateHabitError) {
        throw new Error(updateHabitError.message);
      }
    } catch (error) {
      console.log("habit completion error: ", error);
    }
  }

  async function onDeleteHabit(habitId: number) {
    try {
      const { error } = await supabase
        .from("Habits")
        .delete()
        .eq("id", habitId);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("habit deletion error: ", error);
    }
  }

  useEffect(() => {
    const habitChannel = supabase
      .channel("habits_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Habits" },
        (payload) => {
          getHabitsFromDatabase();
        }
      )
      .subscribe();

    const completionChannel = supabase
      .channel("completion_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "HabitCompletions" },
        (payload) => {
          getTodayCompletions();
        }
      )
      .subscribe();
    getTodayCompletions();
    getHabitsFromDatabase();

    return () => {
      habitChannel.unsubscribe();
      completionChannel.unsubscribe();
    };
  }, [session]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-4 flex-1 gap-6">
        <Button
          icon={"logout"}
          mode="text"
          onPress={signOut}
          className=" flex-row-reverse"
        >
          Signout
        </Button>
        {habits?.length === 0 ? (
          <Text>No habit added yet!</Text>
        ) : (
          habits?.map((habit) => (
            <ReanimatedSwipeable
              key={habit.id}
              ref={(ref: SwipeableMethods) => {
                swipeableRefs.current[habit.id] = ref;
              }}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={() =>
                LeftAction(isCompleted(habit.id as number) as boolean)
              }
              renderRightActions={RightAction}
              onSwipeableOpen={(direction) => {
                direction === "right" && onCompleteHabit(habit.id);
                direction === "left" && onDeleteHabit(habit.id);

                swipeableRefs.current[habit.id]?.close();
              }}
            >
              <Card mode="outlined">
                <Card.Title title={habit.title} />
                <Card.Content>
                  <Text>{habit.description}</Text>
                  <View className="flex-row justify-between mt-4">
                    <View className="flex-row items-center gap-2 bg-yellow-100 rounded-full px-2 py-1">
                      <MaterialCommunityIcons
                        name="fire"
                        size={16}
                        color={"#ca8a04"}
                      />
                      <Text style={{ color: "#ca8a04" }}>
                        {habit.streaks_count} days streak
                      </Text>
                    </View>
                    <Badge className={"capitalize px-4"}>
                      {habit.frequency}
                    </Badge>
                  </View>
                </Card.Content>
              </Card>
            </ReanimatedSwipeable>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

function LeftAction(isCompleted: boolean) {
  return (
    <View className="flex-1 bg-green-500 rounded-xl justify-center pl-6">
      {isCompleted ? (
        <Text>Habit already completed!</Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color={"#FFF"}
        />
      )}
    </View>
  );
}

function RightAction() {
  return (
    <View className="flex-1 bg-red-600 rounded-xl items-end pr-6 justify-center">
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"#FFF"}
      />
    </View>
  );
}

import { useAuthContext } from "@/lib/auth-context";
import supabase from "@/lib/supabase";
import { Habit } from "@/lib/types";
import { HabitCompletions } from "@/prisma/generated/prisma";
import { PostgrestError } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Card, Text } from "react-native-paper";

type StreakData = {
  streak: number;
  bestStreak: number;
  total: number;
};

const StreaksScreen = () => {
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<HabitCompletions[]>();
  const { session } = useAuthContext();

  // const isCompleted = (habitId: number) => completionHabits?.includes(habitId);

  async function getCompletions() {
    try {
      const { data, error } = await supabase
        .from("HabitCompletions")
        .select("*")
        .eq("user_id", session?.user.id);

      if (error) {
        throw new Error(error.message);
      }

      setCompletedHabits(data);
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

  function getStreaks<StreakData>(habitId: number) {
    const data = completedHabits
      ?.filter((h) => h.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    if (data?.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    let streak = 0,
      bestStreak = 0,
      total = data?.length,
      lastDate: Date | null = null,
      currentStreak = 0;

    completedHabits?.forEach((h) => {
      const date = new Date();
      if (lastDate) {
        const diff =
          (date.getTime() - (lastDate as Date).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        if (currentStreak > bestStreak) bestStreak = currentStreak;
        streak = currentStreak;
        lastDate = date;
      }
    });

    return { streak, bestStreak, total };
  }

  const habitStreaks = habits?.map((habit) => {
    const { streak, bestStreak, total } = getStreaks(habit.id);
    return { habit, streak, bestStreak, total };
  });

  const rankedHabit = habitStreaks?.sort((a, b) => a.bestStreak - b.bestStreak);

  useEffect(() => {
    getCompletions();
    getHabitsFromDatabase();
  }, [session]);

  return (
    <ScrollView className="p-6 flex-1 ">
      {habits?.length === 0 ? (
        <View className="flex-1 justify-center bg-red-500 h-full">
          <Text>No Habit Streaks</Text>
        </View>
      ) : (
        <View className="flex-1 gap-6 mt-6">
          {rankedHabit?.map((rh, index) => (
            <Card
              key={rh.habit.id}
              mode={index === 0 ? "outlined" : "elevated"}
            >
              <Card.Title title={rh.habit.title} />
              <Card.Content>
                <Text>{rh.habit.description}</Text>
                <View className="flex-row items-center gap-3 mt-6">
                  <View className="flex-row">
                    <Text> 🔥 {rh.streak}</Text>
                    <Text> Current</Text>
                  </View>
                  <View className="flex-row gap-1">
                    <Text> 🏆 {rh.bestStreak}</Text>
                    <Text> Best</Text>
                  </View>
                  <View className="flex-row gap-1">
                    <Text> ✅ {rh.total}</Text>
                    <Text> Total </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default StreaksScreen;

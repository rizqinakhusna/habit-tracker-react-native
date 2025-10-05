import { useAuthContext } from "@/lib/auth-context";
import supabase from "@/lib/supabase";
import { Habit } from "@/lib/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PostgrestError } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Badge, Button, Card, Text } from "react-native-paper";

const HomeScreen = () => {
  const { signOut, session } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>();

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

  useEffect(() => {
    supabase
      .channel("habits_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Habits" },
        (payload) => {
          getHabitsFromDatabase();
        }
      )
      .subscribe();
    getHabitsFromDatabase();
  }, [session]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-4 flex-1 gap-6">
        {habits?.length === 0 ? (
          <Text>No habit added yet!</Text>
        ) : (
          habits?.map((habit) => (
            <Card key={habit.id} mode="contained">
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
                  <Badge className={"capitalize px-4"}>{habit.frequency}</Badge>
                </View>
              </Card.Content>
            </Card>
          ))
        )}

        <Button mode="outlined" onPress={signOut} className=" mt-auto">
          Signout
        </Button>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

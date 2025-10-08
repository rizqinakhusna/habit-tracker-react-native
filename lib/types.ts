import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password is To Short"),
});

export type AuthSchemaType = z.infer<typeof authSchema>;

export type Habit = {
  id: number;
  title: string;
  description: string;
  frequency: string;
  created_at: string;
  last_completed: string;
  streaks_count: number;
  user_id: string;
};

export type HabitCompletion = {
  id: number;
  habit_id: number;
  user_id: string;
  completed_at: string;
};

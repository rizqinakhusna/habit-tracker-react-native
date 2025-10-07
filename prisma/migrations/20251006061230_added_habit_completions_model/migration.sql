-- CreateTable
CREATE TABLE "public"."HabitCompletions" (
    "id" SERIAL NOT NULL,
    "habit_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitCompletions_pkey" PRIMARY KEY ("id")
);

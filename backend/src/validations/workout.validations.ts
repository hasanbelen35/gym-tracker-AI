import { z } from "zod";

const setSchema = z.object({
  workoutSetId: z.number().int().positive().optional(),
  setNumber: z.number().int().min(1),
  targetReps: z.string().max(20).nullable().optional(),
  targetWeight: z.number().min(0).max(1000).nullable().optional(),
  targetRir: z.number().int().min(0).max(10).nullable().optional(),
  actualReps: z.number().int().min(0).max(1000).nullable().optional(),
  actualWeight: z.number().min(0).max(1000).nullable().optional(),
  actualRir: z.number().int().min(0).max(10).nullable().optional(),
  status: z.enum(["MATCHED", "MODIFIED", "SKIPPED"]),
});

const exerciseSchema = z.object({
  exerciseName: z.string().trim().min(1).max(200),
  orderIndex: z.number().int().min(0),
  notes: z.string().max(2000).optional(),
  sets: z.array(setSchema).min(1),
});

export const completeWorkoutSchema = z.object({
  body: z.object({
    workoutDayId: z.number().int().positive().optional(),
    durationMinutes: z.number().int().min(1).max(600).optional(),
    memberNote: z.string().max(5000).optional(),
    exercises: z.array(exerciseSchema).min(1),
  }),
});

export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>["body"];
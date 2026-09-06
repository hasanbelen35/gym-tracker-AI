import { z } from "zod";

const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
  "Invalid UUID format"
);

export const getExercisesQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    equipment: z.string().optional(),
    targetMuscle: z.string().optional(),
  }),
});

export const createWorkoutProgramSchema = z.object({
  body: z.object({
    memberPublicId: uuidSchema,
    title: z.string().min(1, "Title is required"),
    type: z.string().optional(),
    splitType: z.string().optional(),
    days: z.array(
      z.object({
        dayName: z.string().min(1, "Day name is required"),
        dayOrder: z.number().int().nonnegative(),
        isRestDay: z.boolean().optional(),
        exercises: z.array(
          z.object({
            exercisePublicId: uuidSchema,
            orderIndex: z.number().int().nonnegative().optional(),
            notes: z.string().optional(),
            sets: z.array(
              z.object({
                setNumber: z.number().int().positive().optional(),
                targetReps: z.string().optional(),
                targetWeight: z.number().optional(),
                rir: z.number().optional(),
              })
            ).optional(),
          })
        ).optional(),
      })
    ).min(1, "At least one day is required"),
  }),
});

export const programParamSchema = z.object({
  params: z.object({
    programId: uuidSchema,
  }),
});
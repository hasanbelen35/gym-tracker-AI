import { z } from "zod";
// SCHEMAS

export const getExercisesByQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    equipment: z.string().optional(),
    targetMuscle: z.string().optional(),
  }),
});

export type GetExercisesInput = z.infer<typeof getExercisesByQuerySchema>;
import { z } from "zod";

const uuidSchema = z.string().optional(); 

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100, "Limit en fazla 100 olabilir").optional().default(20),
});

// ---------------- EGZERSİZ SORGUSU ----------------

export const getExercisesQuerySchema = z.object({
  query: z
    .object({
      category: z.string().optional(),
      equipment: z.string().optional(),
      targetMuscle: z.string().optional(),
      search: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

// ---------------- ANTRENMAN PROGRAMI ----------------

const setSchema = z
  .object({
    setNumber: z.number().int().positive().optional(),
    targetReps: z.string().optional(),
    targetWeight: z.number().optional(),
    rir: z.number().int().optional(),
  })
  .passthrough()
  .optional();

const exerciseInDaySchema = z
  .object({
    exercisePublicId: uuidSchema,
    orderIndex: z.number().int().optional(),
    notes: z.string().optional(),
    sets: z.array(setSchema).optional(),
  })
  .passthrough()
  .optional();

const daySchema = z
  .object({
    dayName: z.string().optional(),
    dayOrder: z.number().int().optional(),
    isRestDay: z.boolean().optional().default(false),
    exercises: z.array(exerciseInDaySchema).optional(),
  })
  .passthrough()
  .optional();
  

export const createWorkoutProgramSchema = z.object({
  body: z
    .object({
      memberPublicId: uuidSchema,
      title: z.string().optional(),
      type: z.string().optional(), 
      splitType: z.string().optional(), 
      days: z.array(daySchema).optional(),
    })
    .passthrough()
    .optional(),
});

export const programParamSchema = z.object({
  params: z
    .object({
      programId: uuidSchema,
    })
    .passthrough()
    .optional(),
});
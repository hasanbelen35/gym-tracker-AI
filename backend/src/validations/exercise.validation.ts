import { z } from "zod";
import { ProgramType, SplitCategory } from "@prisma/client";

// 1. Egzersiz Sorgulama Şeması (Query Parametreleri)
export const getExercisesByQuerySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        equipment: z.string().optional(),
        targetMuscle: z.string().optional(),
    }),
});

const setSchema = z.object({
  setNumber: z.number().int().min(1),
  targetReps: z.string().min(1).optional(),
  targetWeight: z.number().positive().optional(),
  rir: z.number().int().min(0).max(10).optional(),
});

const exerciseSchema = z.object({
  exercisePublicId: z.string().uuid(),
  orderIndex: z.number().int().min(1),
  notes: z.string().optional(),
  sets: z.array(setSchema).min(1, "Her egzersizin en az bir seti olmalı"),
});

const daySchema = z.object({
  dayOrder: z.number().int().min(1).max(7),
  dayName: z.string().min(1),
  isRestDay: z.boolean().default(false),
  exercises: z.array(exerciseSchema).default([]),
}).refine(
  (day) => day.isRestDay || day.exercises.length > 0,
  {
    message: "Dinlenme günü olmayan günlerde en az bir egzersiz olmalı",
    path: ["exercises"],
  }
);

export const createProgramSchema = z.object({
  body: z.object({
    memberPublicId: z.string().uuid(),
    title: z.string().min(1),
    type: z.nativeEnum(ProgramType).default(ProgramType.WORKOUT),
    splitType: z.nativeEnum(SplitCategory),
    days: z.array(daySchema).min(1, "En az bir gün eklenmeli"),
  }).refine(
    (data) => {
      const orders = data.days.map((d) => d.dayOrder);
      return new Set(orders).size === orders.length;
    },
    {
      message: "Her gün için farklı bir dayOrder kullanılmalı",
      path: ["days"],
    }
  ),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>["body"];
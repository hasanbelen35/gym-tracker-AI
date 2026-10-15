import { z } from "zod";

const nullableNumber = (schema: z.ZodNumber) =>
  z.preprocess((val) => {
    if (val === "" || val === undefined) return null;
    if (typeof val === "string") {
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    }
    return val;
  }, schema.nullable().optional());

const setSchema = z.object({
  workoutSetId: z.number().int().positive().optional(),
  setNumber: z.number().int().min(1, "Set numarası en az 1 olmalıdır."),
  
  targetReps: z
    .union([z.string(), z.number()])
    .transform((val) => (val !== null && val !== undefined ? String(val) : null))
    .pipe(z.string().max(20, "Hedef tekrar alanı en fazla 20 karakter olabilir."))
    .nullable()
    .optional(),

  targetWeight: nullableNumber(
    z.number().min(0, "Ağırlık negatif olamaz.").max(1000, "Ağırlık en fazla 1000 kg olabilir.")
  ),

  targetRir: nullableNumber(
    z.number().int().min(0, "RIR 0'dan küçük olamaz.").max(10, "RIR en fazla 10 olabilir.")
  ),

  actualReps: nullableNumber(
    z.number().int().min(0, "Gerçekleşen tekrar negatif olamaz.").max(1000, "Gerçekleşen tekrar çok yüksek.")
  ),

  actualWeight: nullableNumber(
    z.number().min(0, "Gerçekleşen ağırlık negatif olamaz.").max(1000, "Gerçekleşen ağırlık çok yüksek.")
  ),

  actualRir: nullableNumber(
    z.number().int().min(0, "Gerçekleşen RIR 0'dan küçük olamaz.").max(10, "Gerçekleşen RIR en fazla 10 olabilir.")
  ),

  status: z
    .enum(["MATCHED", "MODIFIED", "SKIPPED"])
    .optional()
    .default("MATCHED"),
});

const exerciseSchema = z.object({
  exerciseName: z
    .string({ message: "Egzersiz adı metin olmalıdır." })
    .trim()
    .min(1, "Egzersiz adı boş bırakılamaz.")
    .max(200, "Egzersiz adı en fazla 200 karakter olabilir."),
  orderIndex: z.number().int().min(0),
  notes: z.string().max(2000, "Notlar en fazla 2000 karakter olabilir.").optional(),
  sets: z.array(setSchema).min(1, "Her egzersiz için en az 1 set girilmelidir."),
});

export const completeWorkoutSchema = z.object({
  body: z.object({
    workoutDayId: z.number().int().positive().optional(),
    durationMinutes: z
      .number()
      .int()
      .min(1, "Antrenman süresi en az 1 dakika olmalıdır.")
      .max(600, "Antrenman süresi en fazla 600 dakika (10 saat) olabilir.")
      .optional(),
    memberNote: z.string().max(5000, "Üye notu en fazla 5000 karakter olabilir.").optional(),
    exercises: z.array(exerciseSchema).min(1, "En az 1 egzersiz kaydı eklenmelidir."),
  }),
});

export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>["body"];
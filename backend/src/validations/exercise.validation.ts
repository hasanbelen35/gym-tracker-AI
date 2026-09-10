import { z } from "zod";

const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Geçersiz UUID formatı"
  );

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100, "Limit en fazla 100 olabilir").optional().default(20),
});

// ---------------- EGZERSİZ SORGUSU ----------------

export const getExercisesQuerySchema = z.object({
  query: z
    .object({
      category: z.string().trim().min(1, "Kategori boş olamaz").max(50, "Kategori en fazla 50 karakter olabilir").optional(),
      equipment: z.string().trim().min(1, "Ekipman boş olamaz").max(50, "Ekipman en fazla 50 karakter olabilir").optional(),
      targetMuscle: z.string().trim().min(1, "Hedef kas boş olamaz").max(50, "Hedef kas en fazla 50 karakter olabilir").optional(),
      search: z.string().trim().min(1, "Arama metni boş olamaz").max(100, "Arama metni en fazla 100 karakter olabilir").optional(),
    })
    .merge(paginationSchema)
    .strict(),
});

// ---------------- ANTRENMAN PROGRAMI ----------------

const setSchema = z
  .object({
    setNumber: z.number().int().positive("Set numarası pozitif olmalıdır").max(50, "Set numarası gerçekçi değil").optional(),
    targetReps: z
      .string()
      .trim()
      .min(1, "Hedef tekrar boş olamaz")
      .max(20, "Hedef tekrar en fazla 20 karakter olabilir")
      .regex(/^[0-9]{1,3}(-[0-9]{1,3})?$/, "Hedef tekrar bir sayı veya '8-12' gibi bir aralık olmalıdır")
      .optional(),
    targetWeight: z
      .number()
      .nonnegative("Hedef ağırlık negatif olamaz")
      .max(1000, "Hedef ağırlık gerçekçi değil")
      .optional(),
    rir: z
      .number()
      .int("RIR tam sayı olmalıdır")
      .min(0, "RIR negatif olamaz")
      .max(10, "RIR gerçekçi değil")
      .optional(),
  })
  .strict();

const exerciseInDaySchema = z
  .object({
    exercisePublicId: uuidSchema,
    orderIndex: z.number().int().nonnegative("Sıra negatif olamaz").max(100, "Sıra değeri gerçekçi değil").optional(),
    notes: z.string().trim().max(500, "Notlar en fazla 500 karakter olabilir").optional(),
    sets: z.array(setSchema).max(20, "Tek bir egzersiz için çok fazla set var").optional(),
  })
  .strict();

const daySchema = z
  .object({
    dayName: z.string().trim().min(1, "Gün adı zorunludur").max(50, "Gün adı en fazla 50 karakter olabilir"),
    dayOrder: z.number().int().nonnegative("Gün sırası negatif olamaz").max(30, "Gün sırası gerçekçi değil"),
    isRestDay: z.boolean().optional().default(false),
    exercises: z.array(exerciseInDaySchema).max(30, "Tek bir gün için çok fazla egzersiz var").optional(),
  })
  .strict()
  .refine(
    (day) => !day.isRestDay || !day.exercises || day.exercises.length === 0,
    { message: "Dinlenme günü egzersiz içeremez", path: ["exercises"] }
  )
  .refine(
    (day) => day.isRestDay || (day.exercises && day.exercises.length > 0),
    { message: "Antrenman günü en az bir egzersiz içermelidir", path: ["exercises"] }
  );

export const createWorkoutProgramSchema = z.object({
  body: z
    .object({
      memberPublicId: uuidSchema,
      title: z.string().trim().min(1, "Başlık zorunludur").max(100, "Başlık en fazla 100 karakter olabilir"),
      type: z.enum(["STRENGTH", "HYPERTROPHY", "ENDURANCE", "GENERAL"], {
        message: "Geçersiz program tipi",
      }).optional(),
      splitType: z.enum(["FULL_BODY", "UPPER_LOWER", "PUSH_PULL_LEGS", "BRO_SPLIT", "CUSTOM"], {
        message: "Geçersiz split tipi",
      }).optional(),
      days: z
        .array(daySchema)
        .min(1, "En az bir gün gereklidir")
        .max(14, "Bir program 14 günden fazla olamaz"),
    })
    .strict(),
});

export const programParamSchema = z.object({
  params: z
    .object({
      programId: uuidSchema,
    })
    .strict(),
});
import { z } from "zod";

const uuidSchema = z
    .string({ message: "UUID formatı gereklidir." })
    .regex(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
        "Geçersiz UUID formatı."
    );

// ---------------- DIET PROGRAM VALIDATIONS ----------------

const dietItemSchema = z
    .object({
        foodName: z
            .string({ message: "Besin adı zorunludur." })
            .trim()
            .min(1, "Besin adı boş olamaz.")
            .max(100, "Besin adı en fazla 100 karakter olabilir."),
        amount: z
            .number({ message: "Miktar zorunludur ve sayı olmalıdır." })
            .positive("Miktar pozitif bir sayı olmalıdır.")
            .max(10000, "Miktar gerçekçi değil."),
        unit: z
            .string({ message: "Birim zorunludur." })
            .trim()
            .min(1, "Birim boş olamaz.")
            .max(20, "Birim en fazla 20 karakter olabilir."),
        calories: z.number().nonnegative("Kalori negatif olamaz.").max(10000, "Kalori değeri gerçekçi değil.").optional().nullable(),
        protein: z.number().nonnegative("Protein negatif olamaz.").max(1000, "Protein değeri gerçekçi değil.").optional().nullable(),
        carbs: z.number().nonnegative("Karbonhidrat negatif olamaz.").max(1000, "Karbonhidrat değeri gerçekçi değil.").optional().nullable(),
        fat: z.number().nonnegative("Yağ negatif olamaz.").max(1000, "Yağ değeri gerçekçi değil.").optional().nullable(),
        notes: z.string().trim().max(500, "Notlar en fazla 500 karakter olabilir.").optional().nullable(),
    })
    .strict();

const mealSchema = z
    .object({
      
        mealType: z.enum(
            ["BREAKFAST", "LUNCH", "DINNER", "SNACK"],
            { message: "Geçerli bir öğün tipi seçilmelidir (BREAKFAST, LUNCH, DINNER, SNACK)." }
        ),
        mealTitle: z.string().trim().max(100, "Öğün başlığı en fazla 100 karakter olabilir.").optional().nullable(),
        orderIndex: z.number().int("Sıra indeksi tam sayı olmalıdır.").nonnegative("Sıra indeksi negatif olamaz.").max(50, "Sıra değeri gerçekçi değil.").optional(),
        items: z.array(dietItemSchema).max(30, "Tek bir öğün için çok fazla besin eklendi.").optional(),
    })
    .strict();

const dietDaySchema = z
    .object({
        dayName: z
            .string({ message: "Gün adı zorunludur." })
            .trim()
            .min(1, "Gün adı boş olamaz.")
            .max(50, "Gün adı en fazla 50 karakter olabilir."),
        dayOrder: z
            .number({ message: "Gün sırası zorunludur." })
            .int("Gün sırası tam sayı olmalıdır.")
            .nonnegative("Gün sırası negatif olamaz.")
            .max(30, "Gün sırası gerçekçi değil."),
        meals: z.array(mealSchema).max(10, "Tek bir gün için çok fazla öğün eklendi.").optional(),
    })
    .strict();

// CREATE DIET PROGRAM SCHEMA
export const createDietProgramSchema = z.object({
    params: z
        .object({
            memberPublicId: uuidSchema,
        })
        .strict(),
    body: z
        .object({
            title: z
                .string({ message: "Başlık zorunludur." })
                .trim()
                .min(1, "Başlık boş olamaz.")
                .max(100, "Başlık en fazla 100 karakter olabilir."),
            days: z
                .array(dietDaySchema)
                .min(1, "En az bir günlük plan gereklidir.")
                .max(14, "Bir program 14 günden uzun olamaz."),
        })
        .strict(),
});

// PROGRAM PARAMETERS SCHEMA
export const programParamSchema = z.object({
    params: z
        .object({
            programPublicId: uuidSchema,
        })
        .strict(),
});

// MEMBER PARAMETER SCHEMA
export const memberParamSchema = z.object({
    params: z
        .object({
            memberPublicId: uuidSchema,
        })
        .strict(),
});
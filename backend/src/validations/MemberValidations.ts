import { z } from "zod";
import { Gender } from "@prisma/client";



// CONVERT EMPTY STRINGS FROM FORMS TO UNDEFINED
const emptyToUndefined = (value: unknown) =>
    typeof value === "string" && value.trim() === "" ? undefined : value;

// OPTIONAL NUMBER WITH RANGE CHECK
const optionalNumber = (label: string, min: number, max: number, integer = false) => {
    let schema = z.coerce
        .number()
        .min(min, `${label} en az ${min} olmalıdır.`)
        .max(max, `${label} en fazla ${max} olabilir.`);

    if (integer) {
        schema = schema.int(`${label} tam sayı olmalıdır.`);
    }

    return z.preprocess(emptyToUndefined, schema.optional());
};

// OPTIONAL TRIMMED TEXT WITH MAX LENGTH
const optionalText = (label: string, max: number) =>
    z.preprocess(
        emptyToUndefined,
        z.string().trim().max(max, `${label} en fazla ${max} karakter olabilir.`).optional()
    );

export const completeProfileSchema = z.object({
    body: z
        .strictObject({
            age: optionalNumber("Yaş", 10, 100, true),
            height: optionalNumber("Boy", 50, 250),
            weight: optionalNumber("Kilo", 20, 400),
            gender: z.preprocess(emptyToUndefined, z.enum(["MALE", "FEMALE"]).optional()),
            medicalNotes: optionalText("Tıbbi notlar", 1000),

            avatarUrl: z
                .union([
                    z.literal(""),
                    z
                        .url({
                            protocol: /^https?$/,
                            error: "Geçerli bir http veya https bağlantısı giriniz.",
                        })
                        .max(2048, "Avatar bağlantısı çok uzun."),
                ])
                .optional(),

            goal: z.preprocess(
                emptyToUndefined,
                z.enum(["MUSCLE_GAIN", "FAT_LOSS", "STRENGTH", "GENERAL_FITNESS"]).optional()
            ),
            experienceLevel: z.preprocess(
                emptyToUndefined,
                z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional()
            ),
            workoutDaysPerWeek: optionalNumber("Haftalık antrenman günü", 1, 7, true),
            sessionDuration: optionalNumber("Antrenman süresi", 15, 180, true),
            equipmentAccess: z.preprocess(
                emptyToUndefined,
                z.enum(["GYM", "HOME", "BODYWEIGHT"]).optional()
            ),
            activityLevel: z.preprocess(
                emptyToUndefined,
                z.enum(["SEDENTARY", "MODERATE", "ACTIVE"]).optional()
            ),
            additionalNotes: optionalText("Ek notlar", 1000),
        })
        .refine(
            (body) => Object.values(body).some((value) => value !== undefined),
            "En az bir alan doldurulmalıdır."
        ),
});

export type CompleteProfileBody = z.infer<typeof completeProfileSchema>["body"];


export const updateMemberProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "İsim en az 2 karakter olmalıdır")
      .max(50, "İsim en fazla 50 karakter olabilir")
      .optional(),

    surname: z
      .string()
      .trim()
      .min(2, "Soyisim en az 2 karakter olmalıdır")
      .max(50, "Soyisim en fazla 50 karakter olabilir")
      .optional(),

    gender: z
      .enum(["MALE", "FEMALE"], {
        message: "Geçersiz cinsiyet seçimi",
      })
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^(\+90|0)?5\d{9}$/,
        "Geçerli bir telefon numarası giriniz"
      )
      .optional(),

    age: z
      .number()
      .int("Yaş tam sayı olmalıdır")
      .min(13, "Yaş en az 13 olmalıdır")
      .max(100, "Yaş 100'den büyük olamaz")
      .optional(),

    height: z
      .number()
      .positive("Boy geçerli olmalıdır")
      .min(50, "Boy en az 50 cm olmalıdır")
      .max(250, "Boy 250 cm'den fazla olamaz")
      .optional(),

    weight: z
      .number()
      .positive("Kilo geçerli olmalıdır")
      .min(20, "Kilo en az 20 kg olmalıdır")
      .max(500, "Kilo 500 kg'dan fazla olamaz")
      .optional(),

    medicalNotes: z
      .string()
      .trim()
      .max(2000, "Medikal notlar en fazla 2000 karakter olabilir")
      .optional(),
  }),
});
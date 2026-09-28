import { z } from "zod";

// ---------------- ATAMA (ASSIGNMENT) ----------------

export const requestAssignmentSchema = z.object({
  body: z.object({
    memberPublicId: z.string().optional(),
  }),
});

export const getTrainerMembersByStatusQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
  }),
});

export const trainerMemberParamSchema = z.object({
  params: z.object({
    memberPublicId: z.string().optional(),
  }),
});

// ---------------- ÖLÇÜM (MEASUREMENT) ----------------

export const createMeasurementSchema = z.object({
  params: z.object({
    memberId: z.string().optional(),
  }),
  body: z.object({}).passthrough().optional(),
});

// ---------------- TRAINER PROFILE SCHEMAS ----------------

export const completeTrainerProfileSchema = z.object({
  body: z.object({}).passthrough().optional(),
});


export const updateTrainerProfileSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Ad en az 2 karakter olmalıdır.")
      .max(50, "Ad en fazla 50 karakter olabilir.")
      .optional(),

    surname: z.string()
      .min(2, "Soyad en az 2 karakter olmalıdır.")
      .max(50, "Soyad en fazla 50 karakter olabilir.")
      .optional(),

    gender: z.enum(["MALE", "FEMALE"], {
      message: "Geçersiz cinsiyet seçimi."
    }).optional(),

    phone: z.string()
      .regex(/^\+?[0-9\s\-()]{8,15}$/, "Geçersiz telefon numarası formatı.") 
      .optional(),

    age: z.number()
      .int("Yaş tam sayı olmalıdır.")
      .min(18, "Eğitmen en az 18 yaşında olmalıdır.")
      .max(100, "Lütfen geçerli bir yaş giriniz.")
      .optional(),

    height: z.number()
      .positive("Boy pozitif bir sayı olmalıdır.")
      .min(100, "Boy en az 100 cm olmalıdır.")
      .max(250, "Boy 250 cm'den uzun olamaz.")
      .optional(),

    weight: z.number()
      .positive("Kilo pozitif bir sayı olmalıdır.")
      .min(30, "Kilo en az 30 kg olmalıdır.")
      .max(250, "Kilo 250 kg'dan fazla olamaz.")
      .optional(),
  }).strict(),
});
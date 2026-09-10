import { z } from "zod";

const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Geçersiz UUID formatı"
  );

// ---------------- ATAMA (ASSIGNMENT) ----------------

export const requestAssignmentSchema = z.object({
  body: z
    .object({
      memberPublicId: uuidSchema,
    })
    .strict(),
});

export const getTrainerMembersByStatusQuerySchema = z.object({
  query: z
    .object({
      status: z.enum(["PENDING", "ASSIGNED", "UNASSIGNED"], {
        message: "Durum PENDING, ASSIGNED veya UNASSIGNED olmalıdır",
      }),
    })
    .strict(),
});

export const trainerMemberParamSchema = z.object({
  params: z
    .object({
      memberPublicId: uuidSchema,
    })
    .strict(),
});

// ---------------- ÖLÇÜM (MEASUREMENT) ----------------

export const createMeasurementSchema = z.object({
  params: z
    .object({
      memberId: uuidSchema,
    })
    .strict(),
  body: z
    .object({
      bodyFatRate: z
        .number()
        .min(1, "Vücut yağ oranı en az 1 olmalıdır")
        .max(70, "Vücut yağ oranı gerçekçi değil")
        .optional(),
      muscleMass: z
        .number()
        .positive("Kas kütlesi pozitif bir sayı olmalıdır")
        .max(150, "Kas kütlesi gerçekçi değil (kg)")
        .optional(),
      chest: z.number().positive("Göğüs ölçüsü pozitif olmalıdır").max(200, "Göğüs ölçüsü gerçekçi değil (cm)").optional(),
      waist: z.number().positive("Bel ölçüsü pozitif olmalıdır").max(200, "Bel ölçüsü gerçekçi değil (cm)").optional(),
      arm: z.number().positive("Kol ölçüsü pozitif olmalıdır").max(80, "Kol ölçüsü gerçekçi değil (cm)").optional(),
      hip: z.number().positive("Kalça ölçüsü pozitif olmalıdır").max(200, "Kalça ölçüsü gerçekçi değil (cm)").optional(),
      shoulder: z.number().positive("Omuz ölçüsü pozitif olmalıdır").max(200, "Omuz ölçüsü gerçekçi değil (cm)").optional(),
      photos: z
        .array(z.string().url("Her fotoğraf geçerli bir URL olmalıdır"))
        .max(10, "En fazla 10 fotoğraf yüklenebilir")
        .optional(),
      notes: z.string().trim().max(1000, "Notlar en fazla 1000 karakter olabilir").optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "En az bir ölçüm alanı girilmelidir",
    }),
});

export const deleteMeasurementSchema = z.object({
  params: z
    .object({
      memberId: uuidSchema,
      measurementId: uuidSchema,
    })
    .strict(),
});

// ---------------- ANTRENÖR PROFİLİ ----------------

export const completeTrainerProfileSchema = z.object({
  body: z
    .object({
      phone: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, "Geçersiz telefon numarası formatı")
        .optional(),
      gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        message: "Geçerli bir cinsiyet seçiniz (MALE, FEMALE, OTHER)",
      }).optional(),
      age: z
        .number()
        .int("Yaş tam sayı olmalıdır")
        .min(14, "Yaş en az 14 olmalıdır")
        .max(100, "Yaş 100'den küçük olmalıdır")
        .optional(),
      height: z
        .number()
        .positive("Boy pozitif bir sayı olmalıdır")
        .max(250, "Geçerli bir boy giriniz (cm)")
        .optional(),
      weight: z
        .number()
        .positive("Kilo pozitif bir sayı olmalıdır")
        .max(400, "Geçerli bir kilo giriniz (kg)")
        .optional(),
      avatarUrl: z.string().url("Geçersiz avatar URL'i").optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "En az bir alan girilmelidir",
    }),
});
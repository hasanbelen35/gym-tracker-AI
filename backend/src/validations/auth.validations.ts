import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "E-posta çok kısa")
  .max(254, "E-posta çok uzun")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Geçersiz e-posta formatı"
  );

const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır")
  .max(72, "Şifre en fazla 72 karakter olmalıdır")
  .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
  .regex(/[a-z]/, "En az bir küçük harf içermelidir")
  .regex(/[0-9]/, "En az bir rakam içermelidir");

const loginPasswordSchema = z
  .string()
  .min(1, "Şifre zorunludur")
  .max(72, "Şifre en fazla 72 karakter olmalıdır");

const nameSchema = z
  .string()
  .trim()
  .min(2, "En az 2 karakter olmalıdır")
  .max(50, "En fazla 50 karakter olmalıdır")
  .regex(/^[a-zA-ZÀ-ÿğüşıöçĞÜŞİÖÇ\s'-]+$/, "Rakam veya özel karakter içermemelidir");

const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, "Geçersiz telefon numarası formatı");

const gymIdSchema = z
  .number()
  .int("Salon ID tam sayı olmalıdır")
  .positive("Geçersiz salon ID");

// ---------------- GYM ----------------

export const registerGymSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Salon adı en az 2 karakter olmalıdır")
        .max(100, "Salon adı en fazla 100 karakter olmalıdır"),
      email: emailSchema,
      password: passwordSchema,
      address: z.string().trim().min(5, "Adres en az 5 karakter olmalıdır").max(255, "Adres en fazla 255 karakter olmalıdır").optional(),
      phone: phoneSchema.optional(),
    })
    .strict(),
});

export const loginGymSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: loginPasswordSchema,
    })
    .strict(),
});

// ---------------- MEMBER ----------------

export const registerMemberSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      surname: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      gymId: gymIdSchema,
    })
    .strict(),
});

export const loginMemberSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: loginPasswordSchema,
    })
    .strict(),
});

// ---------------- TRAINER ----------------

export const registerTrainerSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      surname: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      gymId: gymIdSchema,
    })
    .strict(),
});

export const loginTrainerSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: loginPasswordSchema,
    })
    .strict(),
});
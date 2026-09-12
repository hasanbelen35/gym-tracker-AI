import { z } from "zod";

const emailSchema = z.string().email("Geçersiz e-posta formatı");

const passwordSchema = z.string().min(6, "Şifre en az 6 karakter olmalıdır");

const nameSchema = z.string().min(2, "En az 2 karakter olmalıdır");

// ---------------- GYM ----------------

export const registerGymSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Salon adı en az 2 karakter olmalıdır"),
    email: emailSchema,
    password: passwordSchema,
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
});

export const loginGymSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Şifre zorunludur"),
  }),
});

// ---------------- MEMBER ----------------

export const registerMemberSchema = z.object({
  body: z.object({
    name: nameSchema,
    surname: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: z.string().optional(),
    gymId: z.number().or(z.string().transform(val => Number(val))),
    age: z.number().optional(),
  }),
});

export const loginMemberSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Şifre zorunludur"),
  }),
});

// ---------------- TRAINER ----------------

export const registerTrainerSchema = z.object({
  body: z.object({
    name: nameSchema,
    surname: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    gymId: z.number().or(z.string().transform(val => Number(val))),
  }),
});

export const loginTrainerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Şifre zorunludur"),
  }),
});
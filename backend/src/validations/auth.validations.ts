import { z } from "zod";

const emailSchema = z.string().regex(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "Invalid email format"
);

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[0-9]/, "Must contain a number");

export const registerGymSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Gym name must be at least 2 characters long"),
    email: emailSchema,
    password: passwordSchema,
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
});

export const loginGymSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});

export const registerMemberSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    surname: z.string().min(2, "Surname must be at least 2 characters long"),
    email: emailSchema,
    password: passwordSchema,
    gymId: z.number().int().positive("Invalid gym ID"),
  }),
});

export const loginMemberSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});

export const registerTrainerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    surname: z.string().min(2, "Surname must be at least 2 characters long"),
    email: emailSchema,
    password: passwordSchema,
    gymId: z.number().int().positive("Invalid gym ID"),
  }),
});

export const loginTrainerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});
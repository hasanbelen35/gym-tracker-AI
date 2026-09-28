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
      .min(2, "Name must be at least 2 characters long.")
      .max(50, "Name cannot exceed 50 characters.")
      .optional(),

    surname: z.string()
      .min(2, "Surname must be at least 2 characters long.")
      .max(50, "Surname cannot exceed 50 characters.")
      .optional(),

    gender: z.enum(["MALE", "FEMALE"], {
      message: "Invalid gender selection."
    }).optional(),

    phone: z.string()
      .regex(/^\+?[0-9\s\-()]{10,15}$/, "Invalid phone number format.")
      .optional(),

    age: z.number()
      .int("Age must be an integer.")
      .min(18, "Trainer must be at least 18 years old.")
      .max(100, "Please enter a valid age.")
      .optional(),

    height: z.number()
      .positive("Height must be a positive number.")
      .min(100, "Height must be at least 100 cm.")
      .max(250, "Height cannot exceed 250 cm.")
      .optional(),

    weight: z.number()
      .positive("Weight must be a positive number.")
      .min(30, "Weight must be at least 30 kg.")
      .max(250, "Weight cannot exceed 250 kg.")
      .optional(),
  }).strict(),
});
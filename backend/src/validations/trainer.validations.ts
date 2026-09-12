import { z } from "zod";

// ---------------- ATAMA (ASSIGNMENT) ----------------

export const requestAssignmentSchema = z.object({
  body: z.object({
    memberPublicId: z.string(),
  }),
});

export const getTrainerMembersByStatusQuerySchema = z.object({
  query: z.object({
    status: z.string(),
  }),
});

export const trainerMemberParamSchema = z.object({
  params: z.object({
    memberPublicId: z.string(),
  }),
});

// ---------------- ÖLÇÜM (MEASUREMENT) ----------------

export const createMeasurementSchema = z.object({
  params: z.object({
    memberId: z.string(),
  }),
  body: z.object({
    bodyFatRate: z.number().optional(),
    muscleMass: z.number().optional(),
    chest: z.number().optional(),
    waist: z.number().optional(),
    arm: z.number().optional(),
    hip: z.number().optional(),
    shoulder: z.number().optional(),
    photos: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

// ---------------- ANTRENÖR PROFİLİ ----------------

export const completeTrainerProfileSchema = z.object({
  body: z.object({
    phone: z.string().optional(),
    gender: z.string().optional(),
    age: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    avatarUrl: z.string().optional(),
  }),
});
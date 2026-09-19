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

// ---------------- ANTRENÖR PROFİLİ ----------------

export const completeTrainerProfileSchema = z.object({
  body: z.object({}).passthrough().optional(),
});
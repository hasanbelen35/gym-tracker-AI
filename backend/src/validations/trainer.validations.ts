import { z } from "zod";

const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
  "Invalid UUID format"
);

export const requestAssignmentSchema = z.object({
  body: z.object({
    memberPublicId: uuidSchema,
  }),
});

export const getTrainerMembersByStatusQuerySchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "ASSIGNED", "UNASSIGNED"], {
      message: "Status must be PENDING, ASSIGNED, or UNASSIGNED",
    }),
  }),
});

export const trainerMemberParamSchema = z.object({
  params: z.object({
    memberPublicId: uuidSchema,
  }),
});

export const createMeasurementSchema = z.object({
  params: z.object({
    memberId: uuidSchema,
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

export const deleteMeasurementSchema = z.object({
  params: z.object({
    memberId: uuidSchema,
    measurementId: uuidSchema,
  }),
});
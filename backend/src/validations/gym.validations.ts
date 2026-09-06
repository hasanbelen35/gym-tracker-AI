import { z } from "zod";

const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
  "Invalid UUID format"
);

export const memberParamSchema = z.object({
  params: z.object({
    memberId: uuidSchema,
  }),
});

export const trainerParamSchema = z.object({
  params: z.object({
    trainerId: uuidSchema,
  }),
});

export const assignmentSchema = z.object({
  body: z.object({
    memberPublicId: uuidSchema,
  }),
});

export const getMembersByStatusQuerySchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "ASSIGNED", "UNASSIGNED"], {
      message: "Status must be PENDING, ASSIGNED, or UNASSIGNED",
    }),
  }),
});
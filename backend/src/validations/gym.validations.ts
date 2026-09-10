import { z } from "zod";

const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Geçersiz UUID formatı"
  );

export const memberParamSchema = z.object({
  params: z
    .object({
      memberId: uuidSchema,
    })
    .strict(),
});

export const trainerParamSchema = z.object({
  params: z
    .object({
      trainerId: uuidSchema,
    })
    .strict(),
});

export const assignmentSchema = z.object({
  body: z
    .object({
      memberPublicId: uuidSchema,
    })
    .strict(),
});

export const getMembersByStatusQuerySchema = z.object({
  query: z
    .object({
      status: z.enum(["PENDING", "ASSIGNED", "UNASSIGNED"], {
        message: "Durum PENDING, ASSIGNED veya UNASSIGNED olmalıdır",
      }),
    })
    .strict(),
});
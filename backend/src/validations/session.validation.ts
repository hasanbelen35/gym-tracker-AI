import { z } from "zod";

export const sessionParamSchema = z.object({
  params: z.object({
    memberId: z.string().regex(/^\d+$/, "Member ID must be a valid number").transform(Number),
  }),
});

export const gymParamSchema = z.object({
  params: z.object({
    gymId: z.string().regex(/^\d+$/, "Gym ID must be a valid number").transform(Number),
  }),
});

export const checkInSchema = z.object({
  body: z.object({
    gymId: z.number().int().positive("Invalid gym ID"),
  }),
});
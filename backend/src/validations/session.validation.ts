import { z } from "zod";

const numericIdParam = (fieldName: string) =>
  z
    .string()
    .regex(/^\d+$/, `${fieldName} geçerli bir sayı olmalıdır`)
    .transform(Number)
    .refine((val) => val > 0, `${fieldName} pozitif bir sayı olmalıdır`);

export const sessionParamSchema = z.object({
  params: z
    .object({
      memberId: numericIdParam("Üye ID"),
    })
    .strict(),
});

export const gymParamSchema = z.object({
  params: z
    .object({
      gymId: numericIdParam("Salon ID"),
    })
    .strict(),
});

export const checkInSchema = z.object({
  body: z
    .object({
      gymId: z.number().int("Salon ID tam sayı olmalıdır").positive("Geçersiz salon ID"),
    })
    .strict(),
});
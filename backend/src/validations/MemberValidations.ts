import { z } from "zod";
import { Gender } from "@prisma/client";

export const updateMemberProfileSchema = z.object({
  body: z.object({
    age: z.number().int().min(1, "Yaş en az 1 olmalıdır").max(120, "Geçerli bir yaş giriniz").optional(),
    height: z.number().positive("Boy pozitif bir sayı olmalıdır").optional(),
    weight: z.number().positive("Kilo pozitif bir sayı olmalıdır").optional(),
    
    gender: z.enum([Gender.MALE, Gender.FEMALE], {
      message: "Geçerli bir cinsiyet seçiniz (MALE, FEMALE)"
    }).optional(),

    medicalNotes: z.string().max(1000, "Sağlık notları en fazla 1000 karakter olabilir").optional(),
    
    avatarUrl: z.string()
      .refine((val) => !val || URL.canParse(val), {
        message: "Geçerli bir URL olmalıdır",
      })
      .optional(),
  }),
});

export type UpdateMemberProfileInput = z.infer<typeof updateMemberProfileSchema>["body"];
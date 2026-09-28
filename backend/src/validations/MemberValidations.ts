import { z } from "zod";
import { Gender } from "@prisma/client";

export const complateMemberProfileSchema = z.object({
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


// GET MEMBERS PROGRAMS SCHEAMA
export const updateMemberProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "İsim en az 2 karakter olmalıdır")
      .max(50, "İsim en fazla 50 karakter olabilir")
      .optional(),

    surname: z
      .string()
      .trim()
      .min(2, "Soyisim en az 2 karakter olmalıdır")
      .max(50, "Soyisim en fazla 50 karakter olabilir")
      .optional(),

    gender: z
      .enum(["MALE", "FEMALE"], {
        message: "Geçersiz cinsiyet seçimi",
      })
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^(\+90|0)?5\d{9}$/,
        "Geçerli bir telefon numarası giriniz"
      )
      .optional(),

    age: z
      .number()
      .int("Yaş tam sayı olmalıdır")
      .min(13, "Yaş en az 13 olmalıdır")
      .max(100, "Yaş 100'den büyük olamaz")
      .optional(),

    height: z
      .number()
      .positive("Boy geçerli olmalıdır")
      .min(50, "Boy en az 50 cm olmalıdır")
      .max(250, "Boy 250 cm'den fazla olamaz")
      .optional(),

    weight: z
      .number()
      .positive("Kilo geçerli olmalıdır")
      .min(20, "Kilo en az 20 kg olmalıdır")
      .max(500, "Kilo 500 kg'dan fazla olamaz")
      .optional(),

    medicalNotes: z
      .string()
      .trim()
      .max(2000, "Medikal notlar en fazla 2000 karakter olabilir")
      .optional(),
  })
  .strict();
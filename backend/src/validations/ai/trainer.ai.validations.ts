import { z } from "zod";

// URL SCHEMA
export const trainerMemberParamSchema = z.object({
  memberPublicId: z
    .string({
      message: "Üye kimlik bilgisi (publicId) metin formatında olmalıdır.",
    })
    .min(1, { message: "Üye kimlik bilgisi boş bırakılamaz." }),
});
// TRAINER-MEMBER ANALYZE PERFORMANCE SCHEMA 
export const aiAnalysisPayloadSchema = z.object({
  profile: z.object({
    age: z.union([
      z.number().int().positive({ message: "Yaş pozitif bir sayı olmalıdır." }), 
      z.string().min(1, { message: "Yaş bilgisi boş olamaz." })
    ]),
    gender: z.string().min(1, { message: "Cinsiyet belirtilmelidir." }),
    height: z.string().min(1, { message: "Boy bilgisi belirtilmelidir." }),
    weight: z.string().min(1, { message: "Kilo bilgisi belirtilmelidir." }),
    medicalNotes: z.string().min(1, { message: "Tıbbi not alanı boş olamaz." }),
  }),
  hasMeasurements: z.boolean({
    message: "Ölçüm durumu (hasMeasurements) boolean formatında olmalıdır.",
  }),
  recentMeasurements: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Geçersiz tarih formatı (YYYY-MM-DD bekleniyor)." }),
      bodyFatRate: z.number().min(0).max(100).nullable(),
      muscleMass: z.number().min(0).nullable(),
      chest: z.number().min(0).nullable(),
      waist: z.number().min(0).nullable(),
      arm: z.number().min(0).nullable(),
    })
  ),
  activePrograms: z.array(
    z.object({
      title: z.string().min(1, { message: "Program başlığı boş olamaz." }),
      splitType: z.string().nullable(),
      days: z.array(
        z.object({
          dayName: z.string().min(1, { message: "Gün adı boş olamaz." }),
          isRestDay: z.boolean(),
          exercises: z.array(
            z.object({
              name: z.string().min(1, { message: "Egzersiz adı boş olamaz." }),
              notes: z.string().nullable(),
              sets: z.array(
                z.object({
                  r: z.number().int().min(0, { message: "Tekrar sayısı negatif olamaz." }).nullable(),
                  w: z.number().min(0, { message: "Ağırlık negatif olamaz." }).nullable(),
                })
              ).min(1, { message: "Her egzersiz en az bir set içermelidir." }),
            })
          ),
        })
      ),
    })
  ),
});

export type AIAnalysisPayloadInput = z.infer<typeof aiAnalysisPayloadSchema>;
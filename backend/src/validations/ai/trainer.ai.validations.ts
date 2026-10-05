import { z } from "zod";

export const trainerMemberParamSchema = z.object({
  params: z.object({
    memberPublicId: z.string({
      message: "Üye kimlik bilgisi metin formatında olmalıdır.",
    }).min(1, { message: "Üye kimlik bilgisi boş bırakılamaz." }),
  }),
});

export const aiAnalysisPayloadSchema = z.object({
  profile: z.object({
    age: z.any(),
    gender: z.string().nullable().optional(),
    height: z.string().nullable().optional(),
    weight: z.string().nullable().optional(),
    medicalNotes: z.string().nullable().optional(),
  }),
  hasMeasurements: z.boolean(),
  recentMeasurements: z.array(
    z.object({
      date: z.string(),
      bodyFatRate: z.number().nullable().optional(),
      muscleMass: z.number().nullable().optional(),
      chest: z.number().nullable().optional(),
      waist: z.number().nullable().optional(),
      arm: z.number().nullable().optional(),
    })
  ),
  activePrograms: z.array(
    z.object({
      title: z.string(),
      splitType: z.string().nullable().optional(),
      days: z.array(
        z.object({
          dayName: z.string(),
          isRestDay: z.boolean(),
          exercises: z.array(
            z.object({
              name: z.string(),
              notes: z.string().nullable().optional(),
              sets: z.array(
                z.object({
                  r: z.number().nullable().optional(),
                  w: z.number().nullable().optional(),
                })
              ),
            })
          ),
        })
      ),
    })
  ),
});

export type AIAnalysisPayloadInput = z.infer<typeof aiAnalysisPayloadSchema>;
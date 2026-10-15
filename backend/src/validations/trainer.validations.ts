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

// String veya Number gelen girdileri güvenle sayıya dönüştüren yardımcı metot
const numericField = (label: string, maxVal?: number) => {
  let schema = z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    },
    z
      .number({ message: `${label} sayısal bir değer olmalıdır.` })
      .gt(0, `${label} 0'dan büyük olmalıdır.`)
      .optional()
  );

  if (maxVal) {
    schema = z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const parsed = Number(val);
        return isNaN(parsed) ? val : parsed;
      },
      z
        .number({ message: `${label} sayısal bir değer olmalıdır.` })
        .gt(0, `${label} 0'dan büyük olmalıdır.`)
        .max(maxVal, `${label} en fazla ${maxVal} olabilir.`)
        .optional()
    );
  }

  return schema;
};

export const createMeasurementSchema = z.object({
  params: z.object({
    memberPublicId: z
      .string({ message: "Üye kimlik bilgisi (memberPublicId) metin formatında olmalıdır." })
      .trim()
      .min(1, "Üye kimlik bilgisi boş bırakılamaz."),
  }),
  body: z.object({
    bodyFatRate: numericField("Vücut yağ oranı", 100),
    muscleMass: numericField("Kas kütlesi"),
    chest: numericField("Göğüs ölçüsü"),
    waist: numericField("Bel ölçüsü"),
    arm: numericField("Kol ölçüsü"),
    hip: numericField("Kalça ölçüsü"),
    shoulder: numericField("Omuz ölçüsü"),
    notes: z
      .string({ message: "Not alanı metin formatında olmalıdır." })
      .trim()
      .max(1000, "Not alanı en fazla 1000 karakter olabilir.")
      .optional(),
    photos: z
      .array(
        z.string({ message: "Fotoğraf bağlantısı metin formatında olmalıdır." }).url("Geçerli bir fotoğraf bağlantısı (URL) giriniz.")
      )
      .optional(),
  }),
});

// ---------------- TRAINER PROFILE SCHEMAS ----------------

export const completeTrainerProfileSchema = z.object({
  body: z.object({}).passthrough().optional(),
});


export const updateTrainerProfileSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Ad en az 2 karakter olmalıdır.")
      .max(50, "Ad en fazla 50 karakter olabilir.")
      .optional(),

    surname: z.string()
      .min(2, "Soyad en az 2 karakter olmalıdır.")
      .max(50, "Soyad en fazla 50 karakter olabilir.")
      .optional(),

    gender: z.enum(["MALE", "FEMALE"], {
      message: "Geçersiz cinsiyet seçimi."
    }).optional(),

    phone: z.string()
      .regex(/^\+?[0-9\s\-()]{8,15}$/, "Geçersiz telefon numarası formatı.")
      .optional(),

    age: z.number()
      .int("Yaş tam sayı olmalıdır.")
      .min(18, "Eğitmen en az 18 yaşında olmalıdır.")
      .max(100, "Lütfen geçerli bir yaş giriniz.")
      .optional(),

    height: z.number()
      .positive("Boy pozitif bir sayı olmalıdır.")
      .min(100, "Boy en az 100 cm olmalıdır.")
      .max(250, "Boy 250 cm'den uzun olamaz.")
      .optional(),

    weight: z.number()
      .positive("Kilo pozitif bir sayı olmalıdır.")
      .min(30, "Kilo en az 30 kg olmalıdır.")
      .max(250, "Kilo 250 kg'dan fazla olamaz.")
      .optional(),
  }).strict(),
});
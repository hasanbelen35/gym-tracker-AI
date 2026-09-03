import { Gender } from "@prisma/client";

export interface CompleteProfileInput {
  age?: number;
  height?: number;
  weight?: number;
  gender?: Gender;
  medicalNotes?: string;
  avatarUrl?: string;
};

export interface CreateMeasurementType {
    bodyFatRate?: number;
    muscleMass?: number;
    chest?: number;
    waist?: number;
    arm?: number;
    hip?: number;
    shoulder?: number;
    photos?: string[];
    notes?: string;
};
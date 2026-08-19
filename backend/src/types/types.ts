import { Gender } from "@prisma/client";

export interface CompleteProfileInput {
  age?: number;
  height?: number;
  weight?: number;
  gender?: Gender;
  medicalNotes?: string;
  avatarUrl?: string;
}
import { Gender } from "@prisma/client";

export interface CompleteProfileInput {
    age?: number;
    height?: number;
    weight?: number;
    gender?: Gender;
    medicalNotes?: string;
    avatarUrl?: string;

    goal?: 'MUSCLE_GAIN' | 'FAT_LOSS' | 'STRENGTH' | 'GENERAL_FITNESS';
    experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    workoutDaysPerWeek?: number;
    sessionDuration?: number;
    equipmentAccess?: 'GYM' | 'HOME' | 'BODYWEIGHT';
    activityLevel?: 'SEDENTARY' | 'MODERATE' | 'ACTIVE';
    injuries?: string;
    additionalNotes?: string;
}

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
}
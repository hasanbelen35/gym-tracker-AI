// --- Yeni Workout Program Hiyerarşi Tipleri ---

import { TrainerInfo } from "@/types/types";
import { Session } from "inspector/promises";

export interface ProgramExerciseDetail {
  publicId: string;
  name: string;
  category?: string | null;
  bodyPart?: string | null;
  equipment?: string | null;
  targetMuscle?: string | null;
  instructions?: string | null;
  instruction_steps?: string | null;
  gifUrl?: string | null;
  createdAt?: string;
}

export interface WorkoutSetItem {
  publicId: string;
  setNumber: number;
  targetReps?: string | null;
  targetWeight?: number | null;
  rir?: number | null;
}

export interface WorkoutExerciseItem {
  publicId: string;
  orderIndex: number;
  notes?: string | null;
  exercise: ProgramExerciseDetail;
  sets: WorkoutSetItem[];
}

export interface WorkoutDayItem {
  publicId: string;
  dayName: string;
  dayOrder: number;
  isRestDay: boolean;
  exercises: WorkoutExerciseItem[];
}

export interface DetailedProgram {
  publicId: string;
  title: string;
  type: string;
  splitType: string;
  isActive: boolean;
  createdAt: string;
  trainer?: {
    publicId: string;
    name: string;
    surname: string;
    email: string;
  } | null;
  days: WorkoutDayItem[];
};


export interface MemberState {
  trainer: TrainerInfo | null;
  assignmentStatus: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED' | null;
  programs: DetailedProgram[]; 
  profile: {
    name?: string;
    surname?: string;
    email?: string;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    phone?: string | null;
    medicalNotes?: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    avatarUrl?: string | null;
    assignmentStatus?: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED';
    gym?: {
      name: string;
    };
    trainer?: TrainerInfo | null;
    sessions?: Session[];
    [key: string]: unknown;
  } | null;
  loading: boolean;
  error: string | null;
}


export interface ExerciseItemProps {
    exerciseItem: WorkoutExerciseItem;
};
export
interface ProgramCardProps {
    program: DetailedProgram;
};
export 
interface SetTableProps {
    sets: WorkoutSetItem[];
};

export interface WorkoutDayListProps {
    days: WorkoutDayItem[];
};

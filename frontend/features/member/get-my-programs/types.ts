import { Member, TrainerInfo } from "@/types/types";

// --- Workout Program Hiyerarşi Tipleri ---

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
  id?: number;
  publicId: string;
  setNumber: number;
  targetReps?: string | null;
  targetWeight?: number | null;
  rir?: number | null;
}

export interface WorkoutExerciseItem {
  id?: number;
  publicId: string;
  orderIndex: number;
  notes?: string | null;
  exercise: ProgramExerciseDetail;
  sets: WorkoutSetItem[];
}

export interface WorkoutDayItem {
  id?: number;
  publicId: string;
  dayName: string;
  dayOrder: number;
  isRestDay: boolean;
  exercises: WorkoutExerciseItem[];
}

export interface DetailedProgram {
  id?: number;
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
}

export interface MemberState {
  trainer: TrainerInfo | null;
  assignmentStatus: "ASSIGNED" | "PENDING" | "UNASSIGNED" | null;
  programs: DetailedProgram[];
  profile: Member | null;
  loading: boolean;
  workoutLogLoading: boolean;
  workoutLogSuccess: boolean;
  error: string | null;
  successMessage?: string | null;
}

// --- Component Props Interfaces ---

export interface ExerciseItemProps {
  exerciseItem: WorkoutExerciseItem;
}

export interface ProgramCardProps {
  program: DetailedProgram;
}

export interface SetTableProps {
  sets: WorkoutSetItem[];
}

export interface WorkoutDayListProps {
  days: WorkoutDayItem[];
}
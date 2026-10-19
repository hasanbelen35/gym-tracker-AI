import { Member, TrainerInfo } from "@/types/types";

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
    archivedAt?: string | null;
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
    archivedAt?: string | null;
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
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// --- Component Props Interfaces ---
export interface ExerciseItemProps {
    exerciseItem: WorkoutExerciseItem;
    position?: number;
}

export interface ProgramCardProps {
    program: DetailedProgram;
    variant?: 'active' | 'archived';
    defaultOpen?: boolean;
    index?: number;
}

export interface SetTableProps {
    sets: WorkoutSetItem[];
}

export interface WorkoutDayListProps {
    days: WorkoutDayItem[];
    compact?: boolean;
}
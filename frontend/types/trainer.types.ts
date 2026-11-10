import { Member, MemberMeasurement, Session, Program } from '@/types/types';

// TRAINER PROFILE PAGE REDUX INTERFACE
export interface TrainerProfile {
    id: number;
    name: string;
    surname: string;
    email: string;
    gender?: string;
    age?: number;
    height?: number;
    weight?: number;
    phone?: string;
    avatarUrl?: string;
    createdAt: string;
    gym: {
        name: string;
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// WORKOUT LOG SUB-TYPES
export interface ExerciseSetLog {
    id: number;
    publicId: string;
    setNumber: number;
    targetReps?: string | null;
    targetWeight?: number | null;
    targetRir?: number | null;
    actualReps?: number | null;
    actualWeight?: number | null;
    actualRir?: number | null;
    status: string;
}

export interface ExerciseLog {
    id: number;
    publicId: string;
    exerciseName: string;
    orderIndex: number;
    notes?: string | null;
    setLogs: ExerciseSetLog[];
}

export interface WorkoutLog {
    id: number;
    publicId: string;
    startedAt: string;
    completedAt?: string | null;
    durationMinutes?: number | null;
    status: string;
    memberNote?: string | null;
    aiFeedback?: string | null;
    workoutDay?: {
        id: number;
        publicId: string;
        dayName: string;
        dayOrder: number;
    } | null;
    exerciseLogs: ExerciseLog[];
}

export interface TrainerState {
    pendingMembers: Member[];
    approvedMembers: Member[];
    availableMembers: Member[];

    selectedMemberProfile: Member | null;

    measurements: MemberMeasurement[];
    measurementsPagination: PaginationMeta | null;
    measurementsLoading: boolean;

    sessions: Session[];
    sessionsPagination: PaginationMeta | null;
    sessionsLoading: boolean;

    programs: Program[];
    programsPagination: PaginationMeta | null;
    programsLoading: boolean;

    workoutLogs: WorkoutLog[];
    workoutLogsPagination: PaginationMeta | null;
    workoutLogsLoading: boolean;

    loading: boolean;
    error: string | null;

    trainerProfile: TrainerProfile;
}
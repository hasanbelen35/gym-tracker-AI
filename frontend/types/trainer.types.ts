
import { Member, MemberMeasurement, Session, Program } from '@/types/types'
// TRAINER PROFILE PAGE REFUX INTERFACE
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
};

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

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

    loading: boolean;
    error: string | null;

    trainerProfile: TrainerProfile;
}
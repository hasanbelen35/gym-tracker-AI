
import { Member, MemberMeasurement } from '@/types/types'
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

// trainer state
export interface TrainerState {
    pendingMembers: Member[];
    approvedMembers: Member[];
    availableMembers: Member[];
    selectedMemberDetail: Member | null;
    measurements: MemberMeasurement[];
    measurementsLoading: boolean;
    loading: boolean;
    error: string | null;

    trainerProfile: TrainerProfile ;
}
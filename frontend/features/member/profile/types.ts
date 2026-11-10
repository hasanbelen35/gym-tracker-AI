import { Member, Trainer, Session, TrainerInfo } from '@/types/types';
import { PaginationInfo } from "@/store/slices/gymSlice";

type Gender = "MALE" | "FEMALE";

export interface UpdateMemberProfileData {
    name?: string;
    surname?: string;
    gender?: Gender;
    phone?: string;
    age?: number;
    height?: number;
    weight?: number;
    medicalNotes?: string;
}

export interface ProfileHeaderProps {
    profile: Partial<Member> | null | undefined;
    assignmentStatus: string | null | undefined;
}

export interface PhysicalStatsCardProps {
    profile: Partial<Member> | null | undefined;
}
export interface TrainerAndSessionsCardProps {
    trainer: Trainer | TrainerInfo | null | undefined;
    sessions?: Session[] | null | undefined;
}

// MEASUREMENT
export interface MeasurementItem {
    id?: number | string;
    bodyFatRate?: number | null;
    muscleMass?: number | null;
    chest?: number | null;
    waist?: number | null;
    arm?: number | null;
    hip?: number | null;
    shoulder?: number | null;
    notes?: string | null;
    measuredAt?: string;
    createdAt?: string;
};


export interface MemberMeasurementsCardProps {
    measurements?: MeasurementItem[];
    pagination?: PaginationInfo | null;
    loading?: boolean;
    onPageChange?: (page: number) => void;
};


export interface MemberProfileGoalsGridProps {
    member: {
        goal?: string | null;
        experienceLevel?: string | null;
        workoutDaysPerWeek?: number | null;
        sessionDuration?: number | null;
        equipmentAccess?: string | null;
        activityLevel?: string | null;
        additionalNotes?: string | null;
    };
};

export
    interface MemberProfileHeaderProps {
    member: {
        name?: string;
        surname?: string;
        email?: string;
        avatarUrl?: string | null;
        createdAt?: string;
    };
    getStatusBadge?: (status?: string | null) => React.ReactNode;
    assignmentStatus?: string | null;
};


export
    interface MemberProfileMedicalNotesProps {
    medicalNotes?: string | null;
};

export
    interface MemberProfileStatsGridProps {
    member: {
        age?: number | null;
        gender?: string | null;
        height?: number | null;
        weight?: number | null;
        phone?: string | null;
    };
    getGenderLabel: (gender?: string | null) => string;
};

export
    interface ProgramItem {
    id?: number | string;
    publicId?: string;
    title?: string;
    type?: string;
    splitType?: string;
    isActive?: boolean;
    createdAt?: string;
};

export interface MemberProgramsCardProps {
    programs?: ProgramItem[];
    pagination?: PaginationInfo | null;
    loading?: boolean;
    onProgramClick?: (publicId: string) => void;
    onPageChange?: (page: number) => void;
};


export
    interface SessionItem {
    id?: number | string;
    checkIn: string;
    checkOut?: string | null;
    duration?: number | null;
};

export interface MemberSessionsCardProps {
    sessions?: SessionItem[];
    pagination?: PaginationInfo | null;
    loading?: boolean;
    onPageChange?: (page: number) => void;
};

export
    interface TrainerItem {
    name?: string;
    surname?: string;
    email?: string;
    phone?: string | null;
    avatarUrl?: string | null;
};

export
    interface MemberTrainerCardProps {
    trainer?: TrainerItem | null;
    assignmentStatus?: string | null;
};
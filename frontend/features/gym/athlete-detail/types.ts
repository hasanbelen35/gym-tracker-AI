import { Program } from "@/types/types";
import { Session } from "@/types/types";

export interface MemberDetailData {
    publicId: string;
    name: string;
    surname: string;
    email: string;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    phone?: string | null;
    gender?: string | null;
    avatarUrl?: string | null;
    assignmentStatus?: string;
    isProfileCompleted?: boolean;
    medicalNotes?: string | null;
    createdAt?: string;
    updatedAt?: string;
    gym?: {
        publicId?: string; 
        name: string;
    } | null;
    trainer?: {
        publicId?: string;
        name: string;
        surname: string;
    } | null;
    sessions?: Array<{
        id?: number;
        checkIn: string;
        checkOut?: string | null;
        duration?: number | null;
    }>;
    programs?: Array<{
        id?: number;
        publicId?: string;
        type?: string;
        title?: string;
        splitType?: string;
        isActive?: boolean;
        createdAt?: string;
    }>;
}
export interface MemberHeaderProps {
    member: MemberDetailData;
    getStatusBadge: (status?: string) => React.ReactNode;
}

export interface MemberMedicalNotesProps {
    medicalNotes?: string | null;
}

export interface MemberProgramsCardProps {
    programs?: Program[];
    memberPublicId: string;
    onProgramClick: (publicId: string) => void;
    onCreateClick: () => void;
}

export interface MemberSessionsCardProps {
    sessions?: Session[];
}

export interface MemberStatsGridProps {
    member: MemberDetailData;
    getGenderLabel: (gender?: string | null) => string;
}
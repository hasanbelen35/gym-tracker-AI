import { Member } from "@/types/types";
import { Program } from "@/types/types";
import { Session } from "@/types/types";

export interface MemberHeaderProps {
    member: Member;
    getStatusBadge: (status?: string) => React.ReactNode;
};

export
    interface MemberMedicalNotesProps {
    medicalNotes?: string | null;
};

export
    interface MemberProgramsCardProps {
    programs?: Program[];
    memberPublicId: string;
    onProgramClick: (programPublicId: string) => void;
    onCreateClick: () => void;
};

export
    interface MemberSessionsCardProps {
    sessions?: Session[];
};

export interface MemberStatsGridProps {
    member: Member;
    getGenderLabel: (gender?: string | null) => string;
}

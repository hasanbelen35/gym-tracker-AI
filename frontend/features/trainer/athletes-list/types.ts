import { Member } from "@/types/types";

export interface AthleteCardProps {
    member: Member;
    type: 'pending' | 'approved';
    onClick?: () => void;
};

export
    interface AthleteSectionProps {
    title: string;
    icon: string;
    members: Member[];
    loading: boolean;
    type: 'pending' | 'approved';
    emptyText: string;
    onMemberClick?: (publicId: string) => void;
}
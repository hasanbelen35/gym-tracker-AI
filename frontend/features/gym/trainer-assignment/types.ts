import { Member } from '@/types/types';

export interface AssignedColumnProps {
    members: Member[];
};
export
    interface PendingColumnProps {
    members: Member[];
    onApprove: (publicId: string) => void;
    onReject: (publicId: string) => void;
};

export
    interface UnassignedColumnProps {
    members: Member[];
};
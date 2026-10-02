import { Member } from '@/types/types';

export 
interface MembersTableProps {
    members: Member[];
    onRowClick: (id: string) => void;
    onDeleteClick: (e: React.MouseEvent, member: Member) => void;
    deletingId: string | null;
};
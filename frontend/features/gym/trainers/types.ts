import { Gym, Member, Program } from "@/types/types";


export interface Trainer{
    id: number;
    publicId: string;
    name: string;
    surname: string;
    email: string;
    phone?: string | null;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    gender?: 'MALE' | 'FEMALE' | null;
    avatarUrl?: string | null;
    isProfileCompleted?: boolean;
    gymId?: number;
    gym?: Gym;
    myMembers?: Member[];
    programs?: Program[];
    createdAt?: string;
}

export interface TrainersTableProps {
    trainers: Trainer[];
    onRowClick: (publicId: string) => void;
    onDeleteClick: (e: React.MouseEvent<HTMLElement>, trainer: Trainer) => void;
    deletingId: string | null;
}
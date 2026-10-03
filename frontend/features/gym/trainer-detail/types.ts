
export interface TrainerMember {
    id: number;
    publicId: string;
    name: string;
    surname: string;
    email: string;
}

export interface TrainerProgramMember {
    id: number;
    publicId: string;
    name: string;
    surname: string;
}

export interface TrainerProgram {
    id: number;
    title: string;
    splitType: string;
    isActive: boolean;
    createdAt: string | Date;
    member?: TrainerProgramMember | null;
}

export interface TrainerDetailModel {
    id?: number;
    publicId?: string;
    name?: string;
    surname?: string;
    email?: string;
    avatarUrl?: string | null; 
    createdAt?: string | Date;
    myMembers?: TrainerMember[];
    programs?: TrainerProgram[];
}

export interface TrainerInfoCardProps {
    trainer: TrainerDetailModel;
}
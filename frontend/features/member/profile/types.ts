import { Member, Trainer, Session, TrainerInfo } from '@/types/types';

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
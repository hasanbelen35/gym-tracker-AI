import { Gender } from "@prisma/client";

export interface UpdateMemberProfileData {
    name?: string;
    surname?: string;
    gender?: Gender;
    phone?: string;
    age?: number;
    height?: number;
    weight?: number;
    medicalNotes:string;
};
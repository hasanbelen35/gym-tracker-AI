export interface UpdateTrainerProfileData {
    name?: string;
    surname?: string;
    gender?: "MALE" | "FEMALE";
    phone?: string;
    age?: number;
    height?: number;
    weight?: number;
}
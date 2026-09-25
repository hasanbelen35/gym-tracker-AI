export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface TrainerProfileFormData {
    phone: string;
    age: string;
    height: string;
    weight: string;
    gender: Gender;
    avatarUrl: string;
}

export interface TrainerProfilePayload {
    phone?: string;
    age?: number;
    height?: number;
    weight?: number;
    gender?: Gender;
    avatarUrl?: string;
}

export type FieldConfig =
    | {
        name: keyof Omit<TrainerProfileFormData, "gender">;
        label: string;
        type: "text" | "number";
        placeholder?: string;
        step?: string;
        span: "full" | "third";
    }
    | {
        name: "gender";
        label: string;
        type: "select";
        options: { value: Gender; label: string }[];
        span: "full" | "third";
    };
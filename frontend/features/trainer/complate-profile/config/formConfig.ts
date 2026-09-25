import { FieldConfig, TrainerProfileFormData } from "../types";

export const FIELDS: FieldConfig[] = [
    { name: "phone", label: "Telefon", type: "text", placeholder: "5XXXXXXXXX", span: "full" },
    { name: "age", label: "Yaş", type: "number", placeholder: "28", span: "third" },
    { name: "height", label: "Boy (cm)", type: "number", step: "0.01", placeholder: "180", span: "third" },
    { name: "weight", label: "Kilo (kg)", type: "number", step: "0.01", placeholder: "80", span: "third" },
    {
        name: "gender",
        label: "Cinsiyet",
        type: "select",
        span: "full",
        options: [
            { value: "MALE", label: "Erkek" },
            { value: "FEMALE", label: "Kadın" },
            { value: "OTHER", label: "Diğer" },
        ],
    },
    { name: "avatarUrl", label: "Avatar URL", type: "text", placeholder: "https://example.com/avatar.jpg", span: "full" },
];

export const NUMERIC_FIELDS = new Set<keyof TrainerProfileFormData>(["age", "height", "weight"]);

export const INITIAL_FORM_DATA: TrainerProfileFormData = {
    phone: "",
    age: "",
    height: "",
    weight: "",
    gender: "MALE",
    avatarUrl: "",
};

export const inputClass =
    "w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all";
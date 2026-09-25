export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface DietItem {
    publicId?: string;
    foodName: string;
    amount: number;
    unit: string;
    calories?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
    notes?: string | null;
}

export interface Meal {
    publicId?: string;
    mealType: MealType;
    mealTitle?: string | null;
    orderIndex?: number;
    items?: DietItem[];
}

export interface DietDay {
    publicId?: string;
    dayName: string;
    dayOrder: number;
    meals?: Meal[];
}

export interface NutritionProgram {
    publicId: string;
    title: string;
    isActive: boolean;
    createdAt: string;
    trainer?: {
        name: string;
        surname: string;
    };
    days?: DietDay[];
}

export interface CreateDietProgramPayload {
    memberPublicId: string;
    title: string;
    days: DietDay[];
}

export interface NutritionState {
    programs: NutritionProgram[];
    currentProgram: NutritionProgram | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}
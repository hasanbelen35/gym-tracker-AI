import { MealType } from "@prisma/client";

export interface MealItemInput {
    foodName: string;
    amount: number;
    unit: string;
    calories?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
    notes?: string | null;
}

export interface MealInput {
    mealType: MealType;
    mealTitle?: string | null;
    orderIndex?: number;
    items: MealItemInput[];
}

export interface DietDayInput {
    dayName: string;
    dayOrder: number;
    meals: MealInput[];
}

export interface CreateDietProgramInput {
    trainerId: number;
    memberPublicId: string;
    title: string;
    days: DietDayInput[];
}
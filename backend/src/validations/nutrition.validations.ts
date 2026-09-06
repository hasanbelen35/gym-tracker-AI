import { z } from "zod";

export const createDietProgramSchema = z.object({
    title: z.string({ message: "Title is required." }).min(1, "Title cannot be empty."),
    days: z.array(
        z.object({
            dayName: z.string({ message: "Day name is required." }),
            dayOrder: z.number({ message: "Day order is required." }),
            meals: z.array(
                z.object({
                    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "PRE_WORKOUT", "POST_WORKOUT"], {
                        message: "Valid meal type is required.",
                    }),
                    mealTitle: z.string().optional().nullable(),
                    orderIndex: z.number().optional(),
                    items: z.array(
                        z.object({
                            foodName: z.string({ message: "Food name is required." }),
                            amount: z.number({ message: "Amount is required." }),
                            unit: z.string({ message: "Unit is required." }),
                            calories: z.number().optional().nullable(),
                            protein: z.number().optional().nullable(),
                            carbs: z.number().optional().nullable(),
                            fat: z.number().optional().nullable(),
                            notes: z.string().optional().nullable(),
                        })
                    ).optional(),
                })
            ).optional(),
        })
    ).min(1, "At least one day plan is required."),
});

export const programParamSchema = z.object({
    programPublicId: z.string({ message: "Program public ID parameter is required." }),
});

export const memberParamSchema = z.object({
    memberPublicId: z.string({ message: "Member public ID parameter is required." }),
});
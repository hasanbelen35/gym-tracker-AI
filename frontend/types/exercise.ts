export interface Exercise {
    publicId: string;
    name: string;
    targetMuscle?: string;
    equipment?: string;
    bodyPart?: string;
    gifUrl?: string;
    instructions?: string;
    instruction_steps?: string[];
}

export interface SetInput {
    setNumber: number;
    targetReps?: string | null;
    targetWeight?: number | null;
    rir?: number | null;
}

export interface ProgramExerciseInput {
    exercisePublicId: string;
    orderIndex: number;
    notes?: string | null;
    sets: SetInput[];
}

export interface ProgramDayInput {
    dayOrder: number;
    dayName: string;
    isRestDay?: boolean;
    exercises: ProgramExerciseInput[];
}
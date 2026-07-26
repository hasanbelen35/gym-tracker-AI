/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import { Exercise } from "@/components/exercises/Exercises";
import { IconClose, IconPlus, IconTarget, IconDumbbell } from "@/icons/icon";

interface ExerciseDetailModalProps {
    exercise: Exercise | null;
    onClose: () => void;
    onStartConfig: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
    exercise,
    onClose,
    onStartConfig,
}) => {
    if (!exercise) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-nav-border bg-nav-bg p-6 shadow-2xl cursor-default [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-nav-border bg-background text-foreground/70 hover:bg-brand-500 hover:text-white transition-colors"
                >
                    <IconClose className="h-4 w-4" />
                </button>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => onStartConfig(exercise)}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-brand-600 active:scale-95 cursor-pointer"
                    >
                        <IconPlus className="h-4 w-4" />
                        Programa Ekle
                    </button>
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4 pr-10">
                    {exercise.name}
                </h2>

                {exercise.gifUrl && (
                    <div className="mb-6 flex justify-center rounded-xl overflow-hidden border border-nav-border bg-background p-2">
                        <img
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            className="h-64 object-contain rounded-lg"
                        />
                    </div>
                )}

                <div className="mb-6 flex flex-wrap gap-2">
                    {exercise.bodyPart && (
                        <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase text-brand-500">
                            Body Part: {exercise.bodyPart}
                        </span>
                    )}
                    {exercise.targetMuscle && (
                        <span className="rounded-full border border-nav-border bg-background px-3 py-1 text-xs font-semibold uppercase text-foreground/85">
                            Target: {exercise.targetMuscle}
                        </span>
                    )}
                    {exercise.equipment && (
                        <span className="rounded-full border border-nav-border bg-background px-3 py-1 text-xs font-semibold uppercase text-foreground/85">
                            Equipment: {exercise.equipment}
                        </span>
                    )}
                </div>

                {exercise.instruction_steps && exercise.instruction_steps.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500">
                            Instruction Steps
                        </h3>
                        <ol className="space-y-2">
                            {exercise.instruction_steps.map((step, index) => (
                                <li key={index} className="flex items-start gap-3 rounded-lg border border-nav-border bg-background p-3 text-sm text-foreground/80">
                                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-500">
                                        {index + 1}
                                    </span>
                                    <span className="mt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
};
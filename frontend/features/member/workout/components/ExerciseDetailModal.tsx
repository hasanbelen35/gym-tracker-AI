"use client";
import React from 'react';
export interface InstructionStep {
    stepNumber?: number;
    title?: string;
    description?: string;
    [key: string]: unknown;
}

interface ExerciseDetailModalProps {
    exercise: {
        exerciseName: string;
        notes?: string | null;
        exerciseDetails?: {
            category?: string | null;
            bodyPart?: string | null;
            equipment?: string | null;
            targetMuscle?: string | null;
            instructions?: string | null;
            instruction_steps?: InstructionStep[] | Record<string, unknown> | unknown | null;
            gifUrl?: string | null;
        };
    } | null;
    onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
    if (!exercise) return null;

    const details = exercise.exerciseDetails;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-nav-bg border border-nav-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-nav-border">
                    <div>
                        <span className="text-xs font-bold text-brand-text uppercase tracking-wider">Egzersiz Rehberi</span>
                        <h3 className="text-2xl font-black text-foreground capitalize mt-1">
                            {exercise.exerciseName}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-background/80 hover:bg-background border border-nav-border flex items-center justify-center text-foreground font-bold transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Gif / Görsel Alanı */}
                {details?.gifUrl && (
                    <div className="w-full flex justify-center bg-background/50 rounded-2xl p-4 border border-nav-border">
                        <img 
                            src={details.gifUrl} 
                            alt={exercise.exerciseName}
                            className="max-h-56 rounded-xl object-contain"
                        />
                    </div>
                )}

                {/* Etiketler (Kas Grubu, Ekipman vs.) */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                    {details?.targetMuscle && (
                        <div className="bg-background/40 border border-nav-border p-3 rounded-xl">
                            <span className="text-foreground/40 block font-semibold">Hedef Kas</span>
                            <span className="font-bold text-foreground capitalize">{details.targetMuscle}</span>
                        </div>
                    )}
                    {details?.equipment && (
                        <div className="bg-background/40 border border-nav-border p-3 rounded-xl">
                            <span className="text-foreground/40 block font-semibold">Ekipman</span>
                            <span className="font-bold text-foreground capitalize">{details.equipment}</span>
                        </div>
                    )}
                </div>

                {/* Açıklamalar ve Adımlar */}
                <div className="space-y-4 text-sm">
                    {details?.instructions && (
                        <div>
                            <h4 className="font-bold text-foreground mb-1">Genel Bilgi</h4>
                            <p className="text-foreground/70 leading-relaxed">{details.instructions}</p>
                        </div>
                    )}

                    {exercise.notes && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-amber-600 dark:text-amber-400">
                            <span className="font-bold block text-xs uppercase mb-0.5">Antrenör Notu:</span>
                            {exercise.notes}
                        </div>
                    )}
                </div>

                {/* Kapat Butonu */}
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow transition"
                >
                    Anladım, Kapat
                </button>
            </div>
        </div>
    );
};
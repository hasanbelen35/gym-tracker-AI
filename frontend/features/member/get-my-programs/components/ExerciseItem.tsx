import React, { useState } from 'react';
import { ExerciseItemProps } from '../types';
import { SetTable } from './SetTable';

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ exerciseItem, position }) => {
    const { exercise, sets, notes, orderIndex } = exerciseItem;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const number = position ?? orderIndex ?? 1;

    return (
        <>
            <div className="h-full space-y-4 rounded-xl border border-nav-border bg-background p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/60 hover:shadow-lg hover:shadow-brand-500/5">
                <div className="flex items-start gap-3.5">
                    {exercise?.gifUrl ? (
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            aria-label={`${exercise.name} hareketini büyüt`}
                            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-nav-border bg-foreground/5 cursor-pointer"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={exercise.gifUrl}
                                alt={exercise.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                                Büyüt
                            </span>
                            <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-md bg-brand-500 text-[11px] font-bold text-white tabular-nums">
                                {number}
                            </span>
                        </button>
                    ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white shadow-md shadow-brand-500/25 tabular-nums">
                            {number}
                        </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-2">
                        <h5 className="text-base font-bold leading-snug">{exercise?.name}</h5>

                        <div className="flex flex-wrap gap-1.5">
                            {exercise?.targetMuscle && (
                                <span className="rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-text">
                                    {exercise.targetMuscle}
                                </span>
                            )}
                            {exercise?.equipment && (
                                <span className="rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground/70">
                                    {exercise.equipment}
                                </span>
                            )}
                            {exercise?.bodyPart && (
                                <span className="rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground/70">
                                    {exercise.bodyPart}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {notes && (
                    <p className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm leading-relaxed text-foreground/85">
                        <span className="font-bold text-brand-text">Eğitmen notu: </span>
                        {notes}
                    </p>
                )}

                <SetTable sets={sets} />
            </div>

            {isModalOpen && exercise?.gifUrl && (
                <div
                    onClick={() => setIsModalOpen(false)}
                    className="ui-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-label={exercise.name}
                        className="ui-pop-in w-full max-w-lg space-y-3 rounded-2xl border border-nav-border bg-nav-bg p-4 shadow-2xl"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-bold">{exercise.name}</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Kapat"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-sm transition-colors hover:bg-brand-500 hover:text-white cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-nav-border bg-foreground/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={exercise.gifUrl}
                                alt={exercise.name}
                                className="mx-auto max-h-[60vh] w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
import React, { useState } from 'react';
import { ExerciseItemProps } from '../types';
import { SetTable } from './SetTable';


export const ExerciseItem: React.FC<ExerciseItemProps> = ({ exerciseItem }) => {
    const { exercise, sets, notes, orderIndex } = exerciseItem;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-nav-border pb-3">
                    <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0">
                            #{orderIndex}
                        </span>
                        <div>
                            <h4 className="font-bold text-brand-text text-sm sm:text-base">{exercise.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {exercise.targetMuscle && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-500/10 text-brand-600">
                                        {exercise.targetMuscle}
                                    </span>
                                )}
                                {exercise.equipment && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {exercise.equipment}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {exercise.gifUrl && (
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="w-16 h-16 rounded-xl overflow-hidden border border-nav-border shrink-0 bg-slate-100 cursor-pointer group relative hover:opacity-95 transition-opacity"
                            title="Büyütmek için tıklayın"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">Büyüt</span>
                            </div>
                        </div>
                    )}
                </div>

                {notes && (
                    <p className="text-xs italic text-slate-500 bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 p-2.5 rounded-xl">
                        <span className="font-semibold not-italic">Not:</span> {notes}
                    </p>
                )}

                <SetTable sets={sets} />
            </div>

            {isModalOpen && exercise.gifUrl && (
                <div
                    onClick={() => setIsModalOpen(false)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white dark:bg-nav-bg border border-nav-border rounded-3xl p-4 max-w-md w-full shadow-2xl space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-nav-border pb-3">
                            <h3 className="font-bold text-brand-text text-sm sm:text-base">{exercise.name}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-text flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-nav-border bg-slate-100 dark:bg-slate-900 flex items-center justify-center max-h-[70vh]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-auto object-contain max-h-[60vh]" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
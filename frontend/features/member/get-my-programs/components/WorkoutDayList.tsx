import React, { useState } from 'react';
import { WorkoutDayListProps } from '../types';
import { ExerciseItem } from './ExerciseItem';

export const WorkoutDayList: React.FC<WorkoutDayListProps> = ({ days }) => {
    const [selectedDayId, setSelectedDayId] = useState<string>(days[0]?.publicId || '');

    if (!days || days.length === 0) return <p className="text-sm text-slate-400">Bu programa ait gün bulunmuyor.</p>;

    const activeDay = days.find(d => d.publicId === selectedDayId) || days[0];

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="flex overflow-x-auto gap-2.5 py-1 px-0.5 no-scrollbar sm:scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {days.map((day) => {
                        const isSelected = day.publicId === activeDay.publicId;
                        return (
                            <button
                                key={day.publicId}
                                onClick={() => setSelectedDayId(day.publicId)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all shrink-0 shadow-xs ${isSelected
                                        ? 'bg-brand-600 text-white shadow-brand-500/20 scale-102'
                                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {day.dayName} {day.isRestDay && "(Dinlenme)"}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3">
                {activeDay.isRestDay ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 border border-nav-border rounded-2xl">
                        <p className="text-sm font-semibold text-slate-500">Bugün dinlenme günü! Kendini toparla 🚀</p>
                    </div>
                ) : (
                    activeDay.exercises.map((exerciseItem) => (
                        <ExerciseItem key={exerciseItem.publicId} exerciseItem={exerciseItem} />
                    ))
                )}
            </div>
        </div>
    );
};
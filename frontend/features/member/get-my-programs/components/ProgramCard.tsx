import React, { useState } from 'react';
import { ProgramCardProps } from '../types';
import { WorkoutDayList } from './WorkoutDayList';
import { IconArrowRight, IconDumbbell } from '@/icons/icon';

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-4 transition-all">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
                        <IconDumbbell className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-brand-text">{program.title}</h3>
                            {program.isActive && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                    Aktif Program
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Tür: <span className="font-semibold text-brand-text">{program.type}</span> • Split: <span className="font-semibold text-brand-text">{program.splitType}</span>
                            {program.trainer && ` • Eğitmen: ${program.trainer.name} ${program.trainer.surname}`}
                        </p>
                    </div>
                </div>

                <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
                    <IconArrowRight className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Accordion Detay Alanı */}
            {isOpen && (
                <div className="pt-4 border-t border-nav-border animate-in fade-in duration-300 space-y-4">
                    <WorkoutDayList days={program.days} />
                </div>
            )}
        </div>
    );
};
'use client';

import React, { useState } from "react";
import { ProgramExerciseDetail } from "@/store/slices/exerciseSlice";
import { IconChevron } from '@/icons/icon';

interface ExerciseCardProps {
    exerciseItem: ProgramExerciseDetail;
    index: number;
}

export const ExerciseCard = ({ exerciseItem, index }: ExerciseCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-linear-to-br from-nav-bg/90 via-nav-bg to-brand-500/2 border border-nav-border/80 hover:border-brand-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl">
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none group transition-colors"
            >
                <div className="flex items-center gap-5 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10 text-brand-500 text-sm font-extrabold border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        #{index + 1}
                    </div>

                    {exerciseItem.exercise?.gifUrl ? (
                        <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-nav-border bg-background shadow-inner">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={exerciseItem.exercise.gifUrl} 
                                alt={exerciseItem.exercise.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ) : (
                        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-dashed border-nav-border/80 flex items-center justify-center text-[10px] text-foreground/40 font-bold uppercase tracking-wider bg-background/50">
                            Görsel Yok
                        </div>
                    )}

                    <div className="space-y-1.5 min-w-0">
                        <h4 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight truncate group-hover:text-brand-500 transition-colors">
                            {exerciseItem.exercise?.name}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/10 text-brand-500 border border-brand-500/20">
                                {exerciseItem.exercise?.targetMuscle || "Egzersiz"}
                            </span>
                            
                            {exerciseItem.sets?.length > 0 && (
                                <span className="text-xs font-semibold text-foreground/50">
                                    • {exerciseItem.sets.length} Set
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="shrink-0 pl-4">
                    <div className="w-9 h-9 rounded-full bg-nav-border/30 flex items-center justify-center text-foreground/70 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <IconChevron className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-6 pt-3 border-t border-nav-border/60 bg-background/40 animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
                    {exerciseItem.notes && (
                        <div className="relative p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs sm:text-sm text-foreground/80 leading-relaxed shadow-sm">
                            <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-brand-500 text-white rounded-md text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                                Not
                            </div>
                            <p className="mt-1">{exerciseItem.notes}</p>
                        </div>
                    )}
                    
                    <div className="overflow-x-auto rounded-xl border border-nav-border/80 bg-nav-bg shadow-sm">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-nav-border/20 text-foreground/60 border-b border-nav-border/60 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Set</th>
                                    <th className="py-3 px-4 text-center">Tekrar</th>
                                    <th className="py-3 px-4 text-center">Ağırlık</th>
                                    <th className="py-3 px-4 text-right">RIR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-nav-border/40 font-medium">
                                {exerciseItem.sets?.map((set, i) => (
                                    <tr key={i} className="hover:bg-brand-500/3 transition-colors text-foreground/90">
                                        <td className="py-3.5 px-4 font-bold text-brand-500">
                                            Set {set.setNumber}
                                        </td>
                                        <td className="py-3.5 px-4 text-center font-semibold">
                                            {set.targetReps || "-"}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            {set.targetWeight ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-nav-border/30 font-bold text-foreground border border-nav-border/50">
                                                    {set.targetWeight} <span className="text-[10px] opacity-70">kg</span>
                                                </span>
                                            ) : "-"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-bold">
                                            {set.rir !== null && set.rir !== undefined ? (
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500 text-xs border border-brand-500/20">
                                                    {set.rir}
                                                </span>
                                            ) : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
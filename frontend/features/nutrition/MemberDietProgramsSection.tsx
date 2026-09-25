'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight } from "@/icons/icon";
import {MemberDietProgramsSectionProps} from '@/types/nutrition.types';


export const MemberDietProgramsSection: React.FC<MemberDietProgramsSectionProps> = ({
    memberPublicId,
    dietPrograms = []
}) => {
    const router = useRouter();

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-100 text-brand-dark">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </span>
                    <span>Beslenme (Diyet) Programları</span>
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-dark">
                        {dietPrograms.length}
                    </span>
                    <button
                        onClick={() => router.push(`/trainer/create-new-nutrition-program/${memberPublicId}`)}
                        className="px-2.5 py-1 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        title="Yeni Diyet Programı Ekle"
                    >
                        <span>+ Yeni</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-1">
                {dietPrograms && dietPrograms.length > 0 ? (
                    dietPrograms.map((program, index: number) => (
                        <div
                            key={program.publicId || index}
                            onClick={() => router.push(`/trainer/athletes/dietProgramDetail/${program.publicId}`)}
                            className="p-3.5 rounded-xl cursor-pointer bg-background border border-nav-border hover:border-brand-500/50 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-2.5 truncate">
                                <span className="font-medium text-sm group-hover:text-brand-500 transition-colors truncate">
                                    {program.title || `Diyet Programı #${index + 1}`}
                                </span>
                                {program.isActive && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 shrink-0">
                                        Aktif
                                    </span>
                                )}
                            </div>
                            <IconArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center text-center py-8 opacity-60">
                        <p className="text-sm">Kayıtlı diyet programı bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
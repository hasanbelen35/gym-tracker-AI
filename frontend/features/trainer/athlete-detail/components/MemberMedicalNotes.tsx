import React from "react";
import { MemberMedicalNotesProps } from '@/features/trainer/athlete-detail/types';


export const MemberMedicalNotes: React.FC<MemberMedicalNotesProps> = ({ medicalNotes }) => {
    if (!medicalNotes) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-linear-to-br from-red-500/10 via-red-500/5 to-transparent p-5">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-red-500/10 blur-2xl" />
            <div className="relative flex items-start gap-3">
                <div className="shrink-0 p-2.5 rounded-xl bg-red-500/15 border border-red-500/20 text-red-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Sağlık Notları</p>
                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 text-[10px] font-bold border border-red-500/20">
                            Dikkat
                        </span>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">{medicalNotes}</p>
                </div>
            </div>
        </div>
    );
};
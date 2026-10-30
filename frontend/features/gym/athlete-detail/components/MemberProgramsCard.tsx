import React from "react";
import { MemberProgramsCardProps } from '@/features/gym/athlete-detail/types';

export const MemberProgramsCard: React.FC<MemberProgramsCardProps> = ({
    programs = [],
    onProgramClick,
    onCreateClick,
}) => {
    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[42vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </span>
                    <span>Antrenman Programları</span>
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                        {programs.length}
                    </span>
                    <button
                        onClick={onCreateClick}
                        className="px-2.5 py-1 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        title="Yeni Program Ekle"
                    >
                        <span>+ Yeni</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {programs.length > 0 ? (
                    programs.map((program, index) => (
                        <div
                            key={program.id || index}
                            onClick={() => program.publicId && onProgramClick(program.publicId)}
                            className="p-3.5 rounded-xl cursor-pointer bg-background border border-nav-border hover:border-brand-500/50 transition-all flex items-center justify-between group"
                        >
                            <span className="font-medium text-sm text-gray-200 group-hover:text-brand-500 transition-colors">
                                {program.title || `Antrenman Programı #${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500 group-hover:text-brand-500 transition-colors">Görüntüle →</span>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 text-gray-500">
                        <p className="text-sm">Kayıtlı antrenman programı bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
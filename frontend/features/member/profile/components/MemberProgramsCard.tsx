'use client';

import React, { useEffect, useRef } from "react";
import { MemberProgramsCardProps } from '@/features/member/profile/types';


export const MemberProgramsCard: React.FC<MemberProgramsCardProps> = ({
    programs = [],
    pagination,
    loading = false,
    onProgramClick,
    onPageChange,
}) => {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const hasMore = !!pagination && pagination.page < pagination.totalPages;

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el || !hasMore || loading || !onPageChange || !pagination) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                onPageChange(pagination.page + 1);
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, loading, pagination, onPageChange]);

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[46vh] justify-between">
            <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </span>
                        <span>Antrenman Programlarım</span>
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                        {pagination ? pagination.total : programs.length}
                    </span>
                </div>

                <div className="overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[26vh]">
                    {loading && programs.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-gray-400 text-xs animate-pulse">
                            Programlar yükleniyor...
                        </div>
                    ) : programs.length > 0 ? (
                        <>
                            {programs.map((program, index) => (
                                <div
                                    key={program.id || program.publicId || index}
                                    onClick={() => program.publicId && onProgramClick && onProgramClick(program.publicId)}
                                    className="p-3.5 rounded-xl cursor-pointer bg-background border border-nav-border hover:border-brand-500/50 transition-all flex items-center justify-between group"
                                >
                                    <div className="space-y-0.5">
                                        <span className="font-medium text-sm text-gray-200 group-hover:text-brand-500 transition-colors block">
                                            {program.title || `Antrenman Programı #${index + 1}`}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            {program.type && <span className="uppercase">{program.type}</span>}
                                            {program.splitType && <span>• {program.splitType}</span>}
                                            {program.isActive && <span className="text-emerald-500 font-bold">• Aktif</span>}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 group-hover:text-brand-500 transition-colors">Görüntüle →</span>
                                </div>
                            ))}

                            {hasMore && <div ref={loadMoreRef} className="h-4" />}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
                            <p className="text-sm">Kayıtlı antrenman programınız bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
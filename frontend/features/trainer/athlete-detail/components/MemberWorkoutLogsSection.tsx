'use client';

import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAssignedMemberWorkoutLogs } from "@/store/slices/trainerSlice";
import { WorkoutLog } from "@/types/trainer.types";

interface MemberWorkoutLogsSectionProps {
    memberPublicId: string;
}

export const MemberWorkoutLogsSection: React.FC<MemberWorkoutLogsSectionProps> = ({ memberPublicId }) => {
    const dispatch = useAppDispatch();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { 
        workoutLogs, 
        workoutLogsPagination, 
        workoutLogsLoading 
    } = useAppSelector((state) => state.trainer);

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const currentPage = workoutLogsPagination?.page ?? 1;
    const hasMore = workoutLogsPagination ? currentPage < workoutLogsPagination.totalPages : false;

    useEffect(() => {
        if (memberPublicId) {
            dispatch(fetchAssignedMemberWorkoutLogs({ memberPublicId, page: 1, limit: 10 }));
        }
    }, [dispatch, memberPublicId]);

    // TRIGGER NEXT PAGE WHEN LIST SCROLLS NEAR THE BOTTOM
    const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 20 && hasMore && !workoutLogsLoading) {
            dispatch(fetchAssignedMemberWorkoutLogs({ memberPublicId, page: currentPage + 1, limit: 10 }));
        }
    };

    const activeLog: WorkoutLog | undefined = workoutLogs[selectedIndex];

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">Tamamlandı</span>;
            case 'IN_PROGRESS':
                return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold">Devam Ediyor</span>;
            case 'CANCELLED':
                return <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold">İptal</span>;
            default:
                return <span className="px-2 py-0.5 rounded-md bg-foreground/10 text-foreground/70 text-xs font-semibold">{status}</span>;
        }
    };

    const getSetStatusBadge = (status: string) => {
        switch (status) {
            case 'MATCHED':
                return <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">Tam Uyum</span>;
            case 'MODIFIED':
                return <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">Farklı Değer</span>;
            case 'SKIPPED':
                return <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold">Atlandı</span>;
            default:
                return <span className="px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/60 text-[10px]">{status}</span>;
        }
    };

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav custom-scrollbar">
            {/* BAŞLIK BAR */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-100 text-brand-dark">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </span>
                    <span>Antrenman Geçmişi (Loglar)</span>
                </h2>

                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-100 text-brand-dark">
                    Toplam {workoutLogsPagination?.total || workoutLogs.length} Kayıt
                </span>
            </div>

            {workoutLogsLoading && workoutLogs.length === 0 ? (
                <div className="flex items-center justify-center py-10 gap-3">
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs opacity-60">Antrenman logları yükleniyor...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* RIGHT SIDE DATE LIST  */}
                    <div
                        onScroll={handleListScroll}
                        className="flex flex-col space-y-2 max-h-87.5 overflow-y-auto pr-1"
                    >
                        <p className="text-xs font-semibold opacity-50 px-1 uppercase tracking-wider mb-1">
                            Antrenman Tarihleri
                        </p>

                        {workoutLogs.length > 0 ? (
                            <>
                                {workoutLogs.map((log, index) => {
                                    const isSelected = selectedIndex === index;
                                    return (
                                        <div
                                            key={log.publicId || log.id || index}
                                            onClick={() => setSelectedIndex(index)}
                                            className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                                                isSelected
                                                    ? "bg-brand-500/10 border-brand-500 text-brand-500"
                                                    : "bg-background border-nav-border hover:border-brand-500/50 text-foreground"
                                            }`}
                                        >
                                            <div className="flex flex-col truncate">
                                                <span className="font-medium text-xs">
                                                    {formatDate(log.startedAt)}
                                                </span>
                                                <span className="text-[10px] opacity-60 truncate">
                                                    {log.workoutDay?.dayName || "Serbest Antrenman"}
                                                </span>
                                            </div>
                                            <span className="text-xs opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</span>
                                        </div>
                                    );
                                })}

                                {workoutLogsLoading && (
                                    <div className="text-center py-2 text-xs opacity-60 animate-pulse">
                                        Daha fazla yükleniyor...
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-6 text-center bg-background border border-nav-border rounded-xl opacity-60 flex flex-col items-center justify-center space-y-2">
                                <p className="text-xs">Henüz kayıtlı antrenman logu bulunmuyor.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE DETAIL VISUAL */}
                    <div className="md:col-span-2 bg-background border border-nav-border rounded-2xl p-5 flex flex-col justify-between max-h-87.5 overflow-y-auto custom-scrollbar">
                        {activeLog ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-nav-border">
                                    <div>
                                        <h3 className="text-sm font-semibold capitalize">
                                            {activeLog.workoutDay?.dayName || "Serbest Antrenman"}
                                        </h3>
                                        <p className="text-[11px] opacity-60 mt-0.5">
                                            {formatDate(activeLog.startedAt)} • {formatTime(activeLog.startedAt)} - {formatTime(activeLog.completedAt || undefined)} ({activeLog.durationMinutes || 0} dk)
                                        </p>
                                    </div>
                                    {getStatusBadge(activeLog.status)}
                                </div>

                                {activeLog.memberNote && (
                                    <div className="p-3 rounded-xl bg-nav-bg border border-nav-border text-xs">
                                        <span className="text-[10px] font-bold text-brand-500 uppercase block mb-1">Sporcu Notu</span>
                                        <p className="opacity-80">{activeLog.memberNote}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {activeLog.exerciseLogs && activeLog.exerciseLogs.length > 0 ? (
                                        activeLog.exerciseLogs.map((ex) => (
                                            <div key={ex.id} className="p-3.5 rounded-xl bg-nav-bg border border-nav-border space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-brand-500 capitalize">
                                                        {ex.orderIndex + 1}. {ex.exerciseName}
                                                    </span>
                                                    {ex.notes && (
                                                        <span className="text-[10px] opacity-60 italic">Not: {ex.notes}</span>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    {ex.setLogs && ex.setLogs.map((setLog) => (
                                                        <div 
                                                            key={setLog.id}
                                                            className="flex items-center justify-between bg-background px-3 py-1.5 rounded-lg border border-nav-border text-xs"
                                                        >
                                                            <span className="font-medium opacity-60 text-[11px] w-12">
                                                                {setLog.setNumber}. Set
                                                            </span>

                                                            <div className="flex items-center gap-3 text-[11px]">
                                                                <span className="opacity-70">
                                                                    Hedef: <strong className="text-foreground">{setLog.targetWeight ?? 0} kg</strong> × <strong className="text-foreground">{setLog.targetReps ?? 0}</strong>
                                                                </span>
                                                                <span className="opacity-30">|</span>
                                                                <span>
                                                                    Gerçekleşen: <strong className="text-brand-500">{setLog.actualWeight ?? 0} kg</strong> × <strong className="text-brand-500">{setLog.actualReps ?? 0}</strong>
                                                                </span>
                                                            </div>

                                                            <div>
                                                                {getSetStatusBadge(setLog.status)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-center py-6 opacity-60">Egzersiz kaydı bulunmuyor.</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center py-16 opacity-60 text-xs">
                                Detayları görmek için soldan bir antrenman seçin.
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};
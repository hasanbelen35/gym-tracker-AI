'use client'
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail } from "@/store/slices/trainerSlice";
import { useParams, useRouter } from "next/navigation";
import { Program, Session } from "@/types/types";
import { IconClock, IconArrowRight } from '@/icons/icon';

export const MemberDetail: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const memberPublicId = params?.memberPublicId as string;
    const { selectedMemberDetail, loading, error } = useAppSelector((state) => state.trainer);

    useEffect(() => {
        if (memberPublicId) {
            dispatch(fetchMemberDetail(memberPublicId));
        }
    }, [dispatch, memberPublicId]);

    if (loading && !selectedMemberDetail) {
        return (
            <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--brand-500)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium opacity-70 tracking-wide">Sporcu bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] p-6 sm:p-10 flex items-center justify-center">
                <div className="max-w-md w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center shadow-lg">
                    <p className="font-semibold mb-1">Bir Hata Oluştu</p>
                    <p className="opacity-90">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedMemberDetail) {
        return null;
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'ASSIGNED':
                return <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">Aktif Sporcu</span>;
            case 'PENDING':
                return <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">Onay Bekliyor</span>;
            default:
                return <span className="text-xs px-3 py-1 rounded-full bg-[var(--brand-100)] text-[var(--brand-dark)] font-bold">{status || 'Bilinmiyor'}</span>;
        }
    };

    return (
        <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">

                {/* Üst Navigasyon & Durum */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border)] text-sm font-medium hover:border-[var(--brand-500)] hover:text-[var(--brand-500)] transition-all shadow-sm"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Geri Dön
                    </button>
                    {getStatusBadge(selectedMemberDetail.assignmentStatus)}
                </div>

                {/* Profil Kartı */}
                <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-nav)] backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {selectedMemberDetail.name} {selectedMemberDetail.surname}
                            </h1>
                            <p className="text-sm opacity-70 mt-1">{selectedMemberDetail.email}</p>
                        </div>

                        {/* Sağ Üst Kısım: Gym Adı ve Kayıt Tarihi */}
                        <div className="flex flex-col items-start sm:items-end gap-2 self-start sm:self-auto">
                            {selectedMemberDetail.gym?.name && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold tracking-wide shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {selectedMemberDetail.gym.name}
                                </div>
                            )}
                            {selectedMemberDetail.createdAt && (
                                <div className="text-xs opacity-60 bg-[var(--background)] px-3 py-1.5 rounded-lg border border-[var(--nav-border)]">
                                    Kayıt: {new Date(selectedMemberDetail.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ölçüm İstatistikleri */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--nav-border)]">
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] hover:border-[var(--brand-500)]/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Yaş</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">{selectedMemberDetail.age ?? "-"}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] hover:border-[var(--brand-500)]/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Boy</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">
                                {selectedMemberDetail.height ? `${selectedMemberDetail.height} cm` : "-"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] hover:border-[var(--brand-500)]/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Kilo</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">
                                {selectedMemberDetail.weight ? `${selectedMemberDetail.weight} kg` : "-"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] hover:border-[var(--brand-500)]/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Telefon</p>
                            <p className="text-base sm:text-lg font-bold mt-1 tracking-tight truncate">
                                {selectedMemberDetail.phone ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Programlar ve Seanslar Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Antrenman Programları */}
                    <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6 shadow-[var(--shadow-nav)] flex flex-col h-[42vh]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--nav-border)]">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-[var(--brand-100)] text-[var(--brand-dark)]">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </span>
                                <span>Antrenman Programları</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-dark)]">
                                    {selectedMemberDetail.programs?.length || 0}
                                </span>
                                <button
                                    onClick={() => router.push(`/trainer/create-new-program/${memberPublicId}`)}
                                    className="px-2.5 py-1 rounded-lg bg-[var(--brand-500)] text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1"
                                    title="Yeni Program Ekle"
                                >
                                    <span>+ Yeni</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {selectedMemberDetail.programs && selectedMemberDetail.programs.length > 0 ? (
                                selectedMemberDetail.programs.map((program: Program, index: number) => (
                                    <div
                                        key={program.id || index}
                                        className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] hover:border-[var(--brand-500)]/50 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-medium text-sm group-hover:text-[var(--brand-500)] transition-colors">
                                            {program.title || `Antrenman Programı #${index + 1}`}
                                        </span>
                                        <IconArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
                                    <p className="text-sm">Kayıtlı antrenman programı bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Son Seanslar */}
                    <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6 shadow-[var(--shadow-nav)] flex flex-col h-[42vh]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--nav-border)]">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <IconClock className="w-4 h-4 text-[var(--brand-500)]" />
                                <span>Son Seanslar & Check-in</span>
                            </h2>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-dark)]">
                                {selectedMemberDetail.sessions?.length || 0}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {selectedMemberDetail.sessions && selectedMemberDetail.sessions.length > 0 ? (
                                selectedMemberDetail.sessions.map((session: Session, index: number) => {
                                    const isCompleted = session.checkOut !== null && session.checkOut !== undefined;

                                    return (
                                        <div
                                            key={session.id || index}
                                            className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] flex items-center justify-between text-sm transition-all hover:bg-[var(--brand-50)]/5"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs opacity-60">Giriş Zamanı</span>
                                                <span className="font-semibold mt-0.5">
                                                    {new Date(session.checkIn).toLocaleString('tr-TR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${isCompleted
                                                ? 'bg-[var(--brand-50)] text-[var(--brand-text)] border border-[var(--brand-100)]'
                                                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse'
                                            }`}>
                                                {isCompleted
                                                    ? (session.duration !== null && session.duration !== undefined ? `${session.duration} dk` : "Tamamlandı")
                                                    : "Devam Ediyor"}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
                                    <p className="text-sm">Geçmiş seans kaydı bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MemberDetail;
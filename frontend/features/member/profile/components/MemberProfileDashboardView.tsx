'use client';

import React from 'react';
import { ArrowLeftIcon } from "@/icons/icon";
import { Member, MemberMeasurement, Session } from "@/types/types";
import { DetailedProgram } from "@/features/member/get-my-programs/types";

interface MemberProfileDashboardViewProps {
    profile: Member | null;
    programs: DetailedProgram[] | any[];
    sessions: Session[] | any[];
    measurements: MemberMeasurement[];
    sessionsTotal: number;
    programsTotal: number;
    activeMeasurement: MemberMeasurement | null;
    selectedMeasurementIndex: number;
    onSelectMeasurement: (index: number) => void;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onNewMeasurement: () => void;
    onNewProgram: () => void;
}

export default function MemberProfileDashboardView({
    profile,
    programs,
    sessions,
    measurements,
    sessionsTotal,
    programsTotal,
    activeMeasurement,
    selectedMeasurementIndex,
    onSelectMeasurement,
    loading,
    onBack,
    onNewMeasurement,
    onNewProgram,
}: MemberProfileDashboardViewProps) {
    if (loading && !profile) {
        return (
            <div className="min-h-screen w-full bg-[#0d0f12] text-white flex items-center justify-center">
                <div className="animate-pulse text-sm text-gray-400">Profil Yükleniyor...</div>
            </div>
        );
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return `${date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
    };

    return (
        <div className="min-h-screen w-full bg-[#0d0f12] text-white p-4 sm:p-6 lg:p-8 font-sans">
            {/* Sayfayı ortalayan ve maks genişlik sınırlaması getiren konteyner */}
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* TOP BAR */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16191e] border border-[#23272f] text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-all cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer">
                            <span>🤖</span> AI Performans Analizi
                        </button>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
                            • Aktif Sporcu
                        </span>
                    </div>
                </div>

                {/* HEADER CARD */}
                <div className="bg-[#14171d] border border-[#21252d] rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={profile?.avatarUrl || "https://avatar.iran.liara.run/public"}
                                alt="Avatar"
                                className="w-16 h-16 rounded-2xl object-cover border border-[#2a2f3a]"
                            />
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight capitalize">
                                        {profile?.name} {profile?.surname}
                                    </h1>
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-medium">
                                        Aktif Sporcu
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mt-0.5">{profile?.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                • {profile?.gym?.name || "IRONFIT"}
                            </span>
                            <span className="text-xs text-gray-500">
                                Kayıt: {formatDate(profile?.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-3.5">
                            <span className="text-xs text-gray-400 font-medium block mb-1">Yaş</span>
                            <span className="text-lg font-bold">{profile?.age || "-"}</span>
                        </div>
                        <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-3.5">
                            <span className="text-xs text-gray-400 font-medium block mb-1">Cinsiyet</span>
                            <span className="text-lg font-bold">
                                {profile?.gender === "MALE" ? "Erkek" : profile?.gender === "FEMALE" ? "Kadın" : "-"}
                            </span>
                        </div>
                        <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-3.5">
                            <span className="text-xs text-gray-400 font-medium block mb-1">Boy</span>
                            <span className="text-lg font-bold">{profile?.height ? `${profile.height} cm` : "-"}</span>
                        </div>
                        <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-3.5">
                            <span className="text-xs text-gray-400 font-medium block mb-1">Kilo</span>
                            <span className="text-lg font-bold">{profile?.weight ? `${profile.weight} kg` : "-"}</span>
                        </div>
                        <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-3.5 col-span-2 sm:col-span-1">
                            <span className="text-xs text-gray-400 font-medium block mb-1">Telefon</span>
                            <span className="text-lg font-bold truncate block">{profile?.phone || "-"}</span>
                        </div>
                    </div>

                    {/* MEDICAL NOTES */}
                    <div className="bg-[#241517] border border-[#3e1d21] rounded-xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-950 border border-red-800/60 flex items-center justify-center text-red-500 font-bold shrink-0">
                            !
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-red-400 tracking-wider">SAĞLIK NOTLARI</span>
                                <span className="px-1.5 py-0.2 rounded bg-red-900/50 text-red-300 text-[10px]">Dikkat</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-0.5">{profile?.medicalNotes || "Kayıtlı sağlık notu bulunmuyor."}</p>
                        </div>
                    </div>
                </div>

                {/* MEASUREMENTS HISTORY */}
                <div className="bg-[#14171d] border border-[#21252d] rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500 text-lg">📊</span>
                            <h2 className="text-lg font-bold tracking-tight">Vücut Ölçümleri Geçmişi</h2>
                        </div>
                        <button
                            onClick={onNewMeasurement}
                            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                            + Yeni Ölçüm Ekle
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold text-gray-500 tracking-wider block mb-2">ÖLÇÜM TARİHLERİ</span>
                            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                {measurements.length === 0 ? (
                                    <div className="text-xs text-gray-500 py-4 text-center">Ölçüm kaydı yok</div>
                                ) : (
                                    measurements.map((m, idx) => (
                                        <button
                                            key={m.id || idx}
                                            onClick={() => onSelectMeasurement(idx)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                                selectedMeasurementIndex === idx
                                                    ? "bg-[#281c1c] border-orange-600 text-orange-400"
                                                    : "bg-[#181b22] border-[#252933] text-gray-400 hover:border-gray-600 hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${selectedMeasurementIndex === idx ? "bg-orange-500" : "bg-gray-600"}`} />
                                                <span>{formatDate(m.measuredAt || m.createdAt)}</span>
                                            </div>
                                            <span>→</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-[#181b22] border border-[#252933] rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#252933]">
                                <span className="text-xs text-gray-400 font-medium">
                                    Ölçüm Tarihi: {formatDate(activeMeasurement?.measuredAt || activeMeasurement?.createdAt)}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 text-xs font-semibold border border-emerald-800/40">
                                    Detay Görünümü
                                </span>
                            </div>

                            {activeMeasurement ? (
                                <>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Yağ Oranı</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.bodyFatRate ? `%${activeMeasurement.bodyFatRate}` : "-"}
                                            </span>
                                        </div>
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Kas Kütlesi</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.muscleMass ? `${activeMeasurement.muscleMass} kg` : "-"}
                                            </span>
                                        </div>
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Göğüs</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.chest ? `${activeMeasurement.chest} cm` : "-"}
                                            </span>
                                        </div>
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Bel</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.waist ? `${activeMeasurement.waist} cm` : "-"}
                                            </span>
                                        </div>
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Kol</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.arm ? `${activeMeasurement.arm} cm` : "-"}
                                            </span>
                                        </div>
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Kalça</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.hip ? `${activeMeasurement.hip} cm` : "-"}
                                            </span>
                                        </div>
                                        <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3 col-span-3">
                                            <span className="text-[11px] text-gray-500 font-medium block">Omuz</span>
                                            <span className="text-base font-bold text-white">
                                                {activeMeasurement.shoulder ? `${activeMeasurement.shoulder} cm` : "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#121419] border border-[#20242e] rounded-xl p-3">
                                        <span className="text-[11px] text-gray-500 font-medium block mb-1">Notlar</span>
                                        <p className="text-xs text-gray-300">{activeMeasurement.notes || "Bu ölçüm için not eklenmemiş."}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-xs text-gray-500 py-12 text-center">Seçili ölçüm detayı bulunamadı.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Programs */}
                    <div className="bg-[#14171d] border border-[#21252d] rounded-2xl p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-500">📋</span>
                                <h3 className="text-base font-bold">Antrenman Programları</h3>
                                <span className="px-2 py-0.5 rounded-md bg-[#222630] text-gray-300 text-xs font-bold">
                                    {programsTotal}
                                </span>
                            </div>
                            <button
                                onClick={onNewProgram}
                                className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer"
                            >
                                + Yeni
                            </button>
                        </div>

                        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                            {programs.length === 0 ? (
                                <div className="text-xs text-gray-500 py-8 text-center">Kayıtlı program bulunmuyor.</div>
                            ) : (
                                programs.map((program) => (
                                    <div
                                        key={program.id || program.publicId}
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-[#181b22] border border-[#252933] hover:border-gray-600 transition-all cursor-pointer"
                                    >
                                        <span className="text-xs font-bold text-gray-200">
                                            {program.title}
                                        </span>
                                        <span className="text-gray-500 text-xs">→</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sessions */}
                    <div className="bg-[#14171d] border border-[#21252d] rounded-2xl p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-500">🕒</span>
                                <h3 className="text-base font-bold">Son Seanslar & Check-in</h3>
                                <span className="px-2 py-0.5 rounded-md bg-[#222630] text-gray-300 text-xs font-bold">
                                    {sessionsTotal}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                            {sessions.length === 0 ? (
                                <div className="text-xs text-gray-500 py-8 text-center">Giriş kaydı bulunmuyor.</div>
                            ) : (
                                sessions.map((session) => (
                                    <div
                                        key={session.id || session.publicId}
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-[#181b22] border border-[#252933]"
                                    >
                                        <div>
                                            <span className="text-[11px] text-gray-500 block font-medium">Giriş Zamanı</span>
                                            <span className="text-xs font-bold text-gray-200">
                                                {formatDateTime(session.checkIn)}
                                            </span>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-lg bg-[#25201d] border border-[#3e2b22] text-orange-400 text-xs font-bold">
                                            {session.duration ? `${session.duration} dk` : "Devam ediyor"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
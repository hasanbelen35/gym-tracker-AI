'use client'
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail } from "@/store/slices/trainerSlice";
import { useParams, useRouter } from "next/navigation";
import { Program, Session } from "@/types/types";
import { IconClock, IconArrowRight, ArrowLeftIcon } from '@/icons/icon';
import { MemberMeasurementsSection } from "@/components/trainer/MemberMeasurementBox";
import Image from "next/image";
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

    const handleMeasurementAdded = () => {
        if (memberPublicId) {
            dispatch(fetchMemberDetail(memberPublicId));
        }
    };

    if (loading && !selectedMemberDetail) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium opacity-70 tracking-wide">Sporcu bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 flex items-center justify-center">
                <div className="max-w-md w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center shadow-lg">
                    <p className="font-semibold mb-1">Bir Hata Oluştu</p>
                    <p className="opacity-90">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all cursor-pointer"
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
                return <span className="text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-dark font-bold">{status || 'Bilinmiyor'}</span>;
        }
    };

    const getGenderLabel = (gender?: string | null) => {
        switch (gender) {
            case 'MALE':
                return 'Erkek';
            case 'FEMALE':
                return 'Kadın';
            default:
                return gender || '-';
        }
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>
                    {getStatusBadge(selectedMemberDetail.assignmentStatus)}
                </div>

                <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {selectedMemberDetail.avatarUrl ? (
                                <Image
                                    src={selectedMemberDetail.avatarUrl}
                                    alt={`${selectedMemberDetail.name} ${selectedMemberDetail.surname}`}
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-nav-border shadow-sm"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-100 text-brand-dark flex items-center justify-center text-xl font-bold border border-nav-border shadow-sm">
                                    {selectedMemberDetail.name?.[0]}{selectedMemberDetail.surname?.[0]}
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    {selectedMemberDetail.name} {selectedMemberDetail.surname}
                                </h1>
                                <p className="text-sm opacity-70 mt-1">{selectedMemberDetail.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 self-start sm:self-auto">
                            {selectedMemberDetail.gym?.name && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold tracking-wide shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {selectedMemberDetail.gym.name}
                                </div>
                            )}
                            {selectedMemberDetail.createdAt && (
                                <div className="text-xs opacity-60 bg-background px-3 py-1.5 rounded-lg border border-nav-border">
                                    Kayıt: {new Date(selectedMemberDetail.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-nav-border">
                        <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Yaş</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">{selectedMemberDetail.age ?? "-"}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Cinsiyet</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">{getGenderLabel(selectedMemberDetail.gender)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Boy</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">
                                {selectedMemberDetail.height ? `${selectedMemberDetail.height} cm` : "-"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Kilo</p>
                            <p className="text-xl font-bold mt-1 tracking-tight">
                                {selectedMemberDetail.weight ? `${selectedMemberDetail.weight} kg` : "-"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                            <p className="text-xs opacity-60 font-medium">Telefon</p>
                            <p className="text-base sm:text-lg font-bold mt-1 tracking-tight truncate">
                                {selectedMemberDetail.phone ?? "-"}
                            </p>
                        </div>
                    </div>

                    {selectedMemberDetail.medicalNotes && (
                        <div className="mt-4 relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-5">
                            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-red-500/10 blur-2xl" />
                            <div className="relative flex items-start gap-3">
                                <div className="flex-shrink-0 p-2.5 rounded-xl bg-red-500/15 border border-red-500/20 text-red-500">
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
                                    <p className="text-sm opacity-90 leading-relaxed">{selectedMemberDetail.medicalNotes}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <MemberMeasurementsSection
                    memberPublicId={memberPublicId}
                    measurements={selectedMemberDetail.measurements || []}
                    onMeasurementAdded={handleMeasurementAdded}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[42vh]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-brand-100 text-brand-dark">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </span>
                                <span>Antrenman Programları</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-dark">
                                    {selectedMemberDetail.programs?.length || 0}
                                </span>
                                <button
                                    onClick={() => router.push(`/trainer/create-new-workout-program/${memberPublicId}`)}
                                    className="px-2.5 py-1 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
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
                                        onClick={() => router.push(`/trainer/athletes/programDetail/${program.publicId}`)}
                                        className="p-3.5 rounded-xl cursor-pointer bg-background border border-nav-border hover:border-brand-500/50 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-medium text-sm group-hover:text-brand-500 transition-colors">
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

                    <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[42vh]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <IconClock className="w-4 h-4 text-brand-500" />
                                <span>Son Seanslar & Check-in</span>
                            </h2>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-dark">
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
                                            className="p-3.5 rounded-xl bg-background border border-nav-border flex items-center justify-between text-sm transition-all hover:bg-brand-50/5"
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
                                                ? 'bg-brand-50 text-brand-text border border-brand-100'
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
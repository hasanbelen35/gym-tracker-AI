"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMembersByStatus, requestAssignment, cancelAssignment } from '@/store/slices/trainerSlice';
import type { Member } from '@/types/types';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import ConfirmModal from '@/components/ConfirmModel';
import { IconPlus, IconClock, IconCheck, IconArrowRight, IconUserX } from '@/icons/icon';

// Avatar initials chip, shared across all columns
const Avatar = ({ name, surname }: { name: string; surname: string }) => (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-nav-border bg-(--background) text-xs font-black uppercase text-(--foreground)/70">
        {name?.[0]}{surname?.[0]}
    </span>
);

export default function TrainerAthletesPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { availableMembers, pendingMembers, approvedMembers, loading, error } = useAppSelector(state => state.trainer);

    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'request' | 'cancel'>('cancel');

    const gymId = user?.gymPublicId;

    useEffect(() => {
        if (!gymId) return;

        dispatch(fetchMembersByStatus({ gymId, status: 'UNASSIGNED' }));
        dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
        dispatch(fetchMembersByStatus({ gymId, status: 'ASSIGNED' }));
    }, [dispatch, gymId]);

    const openRequestModal = (memberPublicId: string) => {
        setSelectedMemberId(memberPublicId);
        setModalType('request');
        setIsModalOpen(true);
    };

    const openCancelModal = (memberPublicId: string) => {
        setSelectedMemberId(memberPublicId);
        setModalType('cancel');
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (!gymId || !selectedMemberId) return;

        if (modalType === 'request') {
            dispatch(requestAssignment(selectedMemberId))
                .unwrap()
                .then(() => {
                    dispatch(fetchMembersByStatus({ gymId, status: 'UNASSIGNED' }));
                    dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
                    setIsModalOpen(false);
                    setSelectedMemberId(null);
                });
        } else {
            dispatch(cancelAssignment(selectedMemberId))
                .unwrap()
                .then(() => {
                    dispatch(fetchMembersByStatus({ gymId, status: 'UNASSIGNED' }));
                    dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
                    dispatch(fetchMembersByStatus({ gymId, status: 'ASSIGNED' }));
                    setIsModalOpen(false);
                    setSelectedMemberId(null);
                });
        }
    };

    if (authLoading) return <Loading />;

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-(--background)">
                <p className="text-sm font-semibold text-brand-dark">Lütfen giriş yapın.</p>
            </div>
        );
    }

    if (!gymId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-(--background)">
                <p className="text-sm font-semibold text-brand-text">Gym ID verisi bulunamadı.</p>
            </div>
        );
    }

    const stages = [
        {
            step: "01",
            title: "Havuz",
            subtitle: "Boştaki sporcular",
            emptyText: "Havuzda uygun sporcu bulunamadı.",
            members: availableMembers,
            icon: IconClock,
        },
        {
            step: "02",
            title: "Bekleyen Talepler",
            subtitle: "Onay bekliyor",
            emptyText: "Bekleyen talep bulunmuyor.",
            members: pendingMembers,
            icon: IconClock,
        },
        {
            step: "03",
            title: "Sporcularım",
            subtitle: "Atama tamamlandı",
            emptyText: "Henüz onaylı sporcunuz yok.",
            members: approvedMembers,
            icon: IconCheck,
        },
    ];

    return (
        <div className="min-h-screen bg-(--background) py-10 font-sans text-(--foreground)">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                {/* BACK BUTTON */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Geri Dön
                    </button>
                </div>

                {/* HEADER */}
                <div className="mb-8 border-b border-nav-border pb-6">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-500">
                        Sporcu Yönetimi
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
                        Atama Merkezi
                    </h1>
                    <p className="mt-1.5 text-sm text-(--foreground)/60">
                        Sporcular havuzdan talep aşamasına, oradan da onaylı listenize geçer.
                    </p>
                </div>

                {/* PIPELINE STRIP */}
                <div className="mb-6 hidden items-center gap-3 md:flex">
                    {stages.map((s, i) => (
                        <div key={s.step} className="flex flex-1 items-center gap-3">
                            <div className="flex items-center gap-2.5 rounded-lg border border-nav-border bg-nav-bg px-3.5 py-2.5">
                                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-brand-500 text-[10px] font-black text-brand-500">
                                    {s.step}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wide text-(--foreground)/80">{s.title}</span>
                            </div>
                            {i < stages.length - 1 && (
                                <IconArrowRight className="h-4 w-4 flex-none text-(--foreground)/25" />
                            )}
                        </div>
                    ))}
                </div>

                {/* ERROR STATE */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-brand-600/40 bg-brand-50 p-4">
                        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-black text-brand-500">!</span>
                        <p className="text-sm font-medium text-brand-text">{error}</p>
                    </div>
                )}

                {/* STAGE BOARD */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stages.map((stage) => {
                        const StageIcon = stage.icon;
                        return (
                            <section
                                key={stage.step}
                                className="flex h-[65vh] flex-col rounded-xl border border-nav-border bg-nav-bg shadow-nav"
                            >
                                <div className="flex items-center justify-between border-b border-nav-border p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-brand-500 text-xs font-black text-brand-500">
                                            {stage.step}
                                        </span>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wide">{stage.title}</h2>
                                            <p className="text-[11px] text-(--foreground)/50">{stage.subtitle}</p>
                                        </div>
                                    </div>
                                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500/15 px-2 text-xs font-black text-brand-500">
                                        {stage.members.length}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-2 overflow-y-auto p-3">
                                    {loading && stage.members.length === 0 ? (
                                        <p className="py-10 text-center text-sm text-(--foreground)/45">Yükleniyor...</p>
                                    ) : stage.members.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-nav-border py-10 text-center">
                                            <StageIcon className="h-6 w-6 text-nav-border" />
                                            <p className="px-4 text-xs text-(--foreground)/45">{stage.emptyText}</p>
                                        </div>
                                    ) : stage.step === "01" ? (
                                        stage.members.map((m: Member) => (
                                            <button
                                                key={m.publicId}
                                                onClick={() => openRequestModal(m.publicId)}
                                                className="group flex w-full items-center justify-between gap-3 rounded-lg border border-nav-border bg-(--background) p-3 text-left transition-colors hover:border-brand-500/55"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={m.name} surname={m.surname} />
                                                    <div>
                                                        <p className="text-sm font-semibold">{m.name} {m.surname}</p>
                                                        <p className="text-xs text-(--foreground)/50">{m.email}</p>
                                                    </div>
                                                </div>
                                                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                                                    <IconPlus className="h-3.5 w-3.5" />
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        stage.members.map((m: Member) => (
                                            <div
                                                key={m.publicId}
                                                className="flex items-center justify-between gap-3 rounded-lg border border-nav-border bg-(--background) p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={m.name} surname={m.surname} />
                                                    <div>
                                                        <p className="text-sm font-semibold">{m.name} {m.surname}</p>
                                                        <p className="text-xs text-(--foreground)/50">{m.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => openCancelModal(m.publicId)}
                                                    className="flex cursor-pointer flex-none items-center gap-1 rounded-lg border border-nav-border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-(--foreground)/55 transition-colors hover:border-brand-600/40 hover:text-brand-text"
                                                >
                                                    <IconUserX className="h-3.5 w-3.5" />
                                                    Geri Çek
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title={modalType === 'request' ? "Sporcuyu Üzerime Ata" : "Sporcuyu Geri Çek"}
                message={
                    modalType === 'request'
                        ? "Bu sporcuyu üzerinize almak istediğinizden emin misiniz? İşlem sonrasında talep onay bekleyenler listesine geçecektir."
                        : "Bu sporcuyu geri çekmek istediğinizden emin misiniz? İşlem sonrasında sporcu boştaki havuzuna dönecektir."
                }
                confirmText={modalType === 'request' ? "Evet, Üzerime Ata" : "Evet, Geri Çek"}
                cancelText="Vazgeç"
                loading={loading}
                onConfirm={handleConfirm}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedMemberId(null);
                }}
            />
        </div>
    );
}
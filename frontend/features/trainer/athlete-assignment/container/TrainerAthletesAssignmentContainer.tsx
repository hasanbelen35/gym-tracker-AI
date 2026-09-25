"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMembersByStatus, requestAssignment, cancelAssignment } from '@/store/slices/trainerSlice';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import ConfirmModal from '@/components/ConfirmModel';
import { IconClock, IconCheck } from '@/icons/icon';
import { PipelineStrip } from '../components/PipelineStrip';
import { StageColumn } from '../components/StageColumn';

export function TrainerAthletesContainer() {
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
                        className="group flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm"
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
                <PipelineStrip stages={stages} />

                {/* ERROR STATE */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-brand-600/40 bg-brand-50 p-4">
                        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-black text-brand-500">!</span>
                        <p className="text-sm font-medium text-brand-text">{error}</p>
                    </div>
                )}

                {/* STAGE BOARD */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stages.map((stage) => (
                        <StageColumn
                            key={stage.step}
                            stage={stage}
                            loading={loading}
                            onRequest={openRequestModal}
                            onCancel={openCancelModal}
                        />
                    ))}
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
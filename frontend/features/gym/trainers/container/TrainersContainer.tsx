"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllTrainers, removeTrainerFromGym } from "@/store/slices/gymSlice";
import { Trainer } from "../types";
import ConfirmModal from "@/components/ConfirmModel";
import Loading from '@/components/Loading';
import { TrainersTable } from "@/features/gym/trainers/components/TrainersTable";

export default function TrainersContainer() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { trainers, trainersLoading, trainersError } = useAppSelector((state) => state.gym);

    const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (trainers.length === 0) {
            dispatch(fetchAllTrainers());
        }
    }, [dispatch, trainers.length]);

    const handleConfirmDelete = async () => {
        if (!trainerToDelete) return;
        
        setDeletingId(trainerToDelete.publicId);
        
        try {
            await dispatch(removeTrainerFromGym(trainerToDelete.publicId)).unwrap();
        } catch (err) {
            console.error("Antrenör silinemedi:", err);
        } finally {
            setDeletingId(null);
            setTrainerToDelete(null);
        }
    };

    const handleRowClick = (publicId: string) => {
        router.push(`/gym/trainers/${publicId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, trainer: Trainer) => {
        e.stopPropagation();
        setTrainerToDelete(trainer);
    };

    if (trainersLoading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-300">
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                    PERSONEL YÖNETİMİ
                </span>
                <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                    ANTRENÖRLER
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Salonunuzda görev yapan antrenörleri görüntüleyin, detaylarına erişin veya sistemden kaldırın.
                </p>
                <hr className="mt-6 border-nav-border" />
            </div>

            {trainersError && (
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-sm font-semibold text-red-500">{trainersError}</p>
                </div>
            )}

            <TrainersTable 
                trainers={trainers} 
                onRowClick={handleRowClick} 
                onDeleteClick={handleDeleteClick} 
                deletingId={deletingId} 
            />

            <ConfirmModal
                isOpen={!!trainerToDelete}
                title="Antrenörü Sil"
                message={
                    trainerToDelete 
                        ? `${trainerToDelete.name} ${trainerToDelete.surname} adlı antrenörü silmek üzeresiniz. Bu işlem geri alınamaz.` 
                        : ""
                }
                confirmText="Evet, Sil"
                cancelText="İptal"
                loading={!!deletingId}
                onConfirm={handleConfirmDelete}
                onCancel={() => setTrainerToDelete(null)}
            />
        </div>
    );
}
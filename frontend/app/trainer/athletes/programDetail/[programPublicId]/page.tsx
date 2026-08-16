'use client';

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchProgramDetail, deleteProgram, ProgramDayDetail } from "@/store/slices/exerciseSlice";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, IconTrash } from '@/icons/icon';
import { ExerciseCard } from "@/components/exercises/ExerciseDetailCard";
import ConfirmModal from "@/components/ConfirmModel";

export default function ProgramDetail() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();

    const programPublicId = params?.programPublicId as string;
    const { currentProgramDetail, programDetailLoading } = useAppSelector((state) => state.exercises);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (programPublicId) {
            dispatch(fetchProgramDetail(programPublicId));
        }
    }, [dispatch, programPublicId]);

    const handleDeleteProgram = async () => {
        setIsDeleting(true);
        try {
            await dispatch(deleteProgram(programPublicId)).unwrap();
            router.push('/trainer/athletes');
        } catch (error) {
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (programDetailLoading && !currentProgramDetail) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin shadow-md" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 animate-pulse">Program Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!currentProgramDetail) return null;

    const totalDays = currentProgramDetail.days?.length || 0;
    const totalExercises = currentProgramDetail.days?.reduce((acc, day) => acc + (day.exercises?.length || 0), 0) || 0;

    return (
        <div className="min-h-screen w-full bg-background text-foreground selection:bg-brand-500 selection:text-white p-4 sm:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nav-bg border border-nav-border/80 text-xs font-bold uppercase tracking-wider hover:border-brand-500/60 hover:bg-brand-500/5 transition-all shadow-sm"
                    >
                        <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1 " /> 
                        <span>Geri Dön</span>
                    </button>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer bg-red-500/10 border border-red-500/30 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        <IconTrash className="w-4 h-4 " />
                        <span>Programı Sil</span>
                    </button>
                </div>

                <div className="relative bg-linear-to-br from-nav-bg via-nav-bg to-brand-500/5 border border-nav-border/80 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden max-w-4xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500 text-white shadow-sm">
                                {currentProgramDetail.type}
                            </span>
                            <span className="text-foreground/30">•</span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-nav-border/30 text-foreground/80 border border-nav-border/50">
                                {currentProgramDetail.splitType}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            {currentProgramDetail.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-foreground/60 border-t border-nav-border/40">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-500" />
                                <span>{totalDays} Antrenman Günü</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-500/50" />
                                <span>{totalExercises} Toplam Egzersiz</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {currentProgramDetail.days?.map((day: ProgramDayDetail) => (
                        <div key={day.publicId || day.dayOrder} className="bg-nav-bg/40 border border-nav-border/60 rounded-3xl p-6 space-y-6 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center justify-between border-b border-nav-border/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 text-xs font-extrabold border border-brand-500/20 shadow-sm">
                                        {day.dayOrder}
                                    </span>
                                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
                                        {day.dayName}
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-nav-border/30 text-foreground/70">
                                    {day.isRestDay ? "Dinlenme" : `${day.exercises?.length || 0} Egzersiz`}
                                </span>
                            </div>
                            
                            {day.isRestDay ? (
                                <div className="p-10 rounded-2xl border border-dashed border-nav-border/80 text-center text-xs font-bold uppercase tracking-widest text-foreground/40 bg-nav-bg/30">
                                    Dinlenme Günü — Kasların Gelişim Zamanı 🚀
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {day.exercises.map((ex, idx) => (
                                        <ExerciseCard key={ex.publicId || idx} exerciseItem={ex} index={idx} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Programı Sil"
                message="Bu antrenman programını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
                confirmText="Evet, Sil"
                cancelText="Vazgeç"
                loading={isDeleting}
                onConfirm={handleDeleteProgram}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
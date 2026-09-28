'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMemberPrograms } from '@/store/slices/memberSlice';
import { ProgramCard } from '../components/ProgramCard';
import Loading from '@/components/Loading';
import { ErrorBox } from '@/components/ui/ErrorBox';
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from '@/icons/icon';

export const MyProgramsContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { programs, loading, error } = useAppSelector((state) => state.member);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchMemberPrograms());
    }, [dispatch]);

    if (loading && programs.length === 0) {
        return <Loading />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
            >
                <ArrowLeftIcon /> Geri Dön
            </button>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-extrabold text-brand-text">Antrenman Programlarım</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Eğitmeniniz tarafından hazırlanan tüm aktif programlarınızı ve detaylarını buradan inceleyebilirsiniz.
                </p>
            </div>

            {error && <ErrorBox message={error} />}

            {!loading && programs.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-8 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Henüz atanmış bir antrenman programınız bulunmuyor.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {programs.map((program) => (
                        <ProgramCard key={program.publicId} program={program} />
                    ))}
                </div>
            )}
        </div>
    );
};
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMemberPrograms } from '@/store/slices/memberSlice';
import { ProgramCard } from '../components/ProgramCard';
import Loading from '@/components/Loading';
import { ErrorBox } from '@/components/ui/ErrorBox';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@/icons/icon';

export const MyProgramsContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { programs, pagination, loading, error } = useAppSelector((state) => state.member);
    const router = useRouter();

    const [archivePage, setArchivePage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        dispatch(fetchMemberPrograms({ onlyActive: true }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchMemberPrograms({ onlyActive: false, page: archivePage, limit: 10 }))
            .unwrap()
            .then(() => setIsFetchingMore(false))
            .catch(() => setIsFetchingMore(false));
    }, [dispatch, archivePage]);

    const activeProgram = useMemo(
        () => programs.find((p) => p.isActive && !p.archivedAt),
        [programs]
    );

    const archivedPrograms = useMemo(
        () =>
            programs
                .filter((p) => !!p.archivedAt)
                .sort(
                    (a, b) =>
                        new Date(b.archivedAt as string).getTime() -
                        new Date(a.archivedAt as string).getTime()
                ),
        [programs]
    );

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        
        if (scrollHeight - scrollTop <= clientHeight + 20) {
            if (!isFetchingMore && archivePage < pagination.totalPages) {
                setIsFetchingMore(true);
                setArchivePage((prev) => prev + 1);
            }
        }
    };

    const activeTrainingDays = activeProgram?.days?.filter((d) => !d.isRestDay).length ?? 0;
    const activeExercises =
        activeProgram?.days?.reduce((acc, d) => acc + (d.exercises?.length || 0), 0) ?? 0;

    if (loading && programs.length === 0) {
        return <Loading />;
    }

    const stats = [
        { label: 'gün', value: activeTrainingDays },
        { label: 'egzersiz', value: activeExercises },
        { label: 'arşiv toplam', value: pagination.total },
    ];

    return (
        <div className="w-full min-h-screen px-4 sm:px-8 xl:px-12 py-6 space-y-6">
            {/* HEAD */}
            <header className="ui-fade-in flex flex-wrap items-center justify-between gap-4 border-b border-nav-border pb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        aria-label="Geri dön"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-nav-border bg-nav-bg text-foreground/70 transition-all hover:border-brand-500 hover:text-brand-500 hover:-translate-x-0.5 cursor-pointer"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                            Antrenman programlarım
                        </h1>
                        <p className="text-xs text-foreground/55">
                            Güncel programın ve geçmiş programların
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {stats.map((s) => (
                        <span
                            key={s.label}
                            className="rounded-lg border border-nav-border bg-nav-bg px-3 py-1.5 text-xs font-medium text-foreground/70"
                        >
                            <b className="mr-1 text-sm font-bold text-brand-text tabular-nums">
                                {s.value}
                            </b>
                            {s.label}
                        </span>
                    ))}
                </div>
            </header>

            {error && <ErrorBox message={error} />}

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
                {/* ACTIVE */}
                <section className="min-w-0 space-y-3">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                        </span>
                        Aktif program
                    </h2>

                    {activeProgram ? (
                        <ProgramCard
                            key={activeProgram.publicId}
                            program={activeProgram}
                            variant="active"
                            defaultOpen
                        />
                    ) : (
                        <div className="ui-pop-in rounded-2xl border border-dashed border-nav-border bg-nav-bg/60 p-12 text-center">
                            <p className="font-bold">Aktif programın yok</p>
                            <p className="mt-1 text-sm text-foreground/60">
                                Eğitmenin yeni program atadığında burada görünecek.
                            </p>
                        </div>
                    )}
                </section>

                {/* ARCHIVE & INFINITE SCROLL */}
                <aside className="min-w-0 space-y-3 xl:sticky xl:top-6">
                    <h2 className="flex items-center justify-between text-sm font-semibold text-foreground/70">
                        <span>Geçmiş programlar</span>
                        <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-dark tabular-nums">
                            {pagination.total}
                        </span>
                    </h2>

                    {archivedPrograms.length > 0 ? (
                        <div className="space-y-3">
                            <div 
                                onScroll={handleScroll}
                                className="space-y-2.5 xl:max-h-[72vh] xl:overflow-y-auto xl:pr-1 custom-scrollbar"
                            >
                                {archivedPrograms.map((program, i) => {
                                    const itemIndex = i + 1;

                                    return (
                                        <div
                                            key={`${program.publicId ?? i}-${i}`}
                                            style={{ '--delay': `${(i % 10) * 50}ms` } as React.CSSProperties}
                                            className="ui-slide-right"
                                        >
                                            <ProgramCard 
                                                program={program} 
                                                variant="archived" 
                                                index={itemIndex} 
                                            />
                                        </div>
                                    );
                                })}

                                {isFetchingMore && (
                                    <div className="py-3 text-center text-xs text-foreground/50 font-medium">
                                        Daha fazla yükleniyor...
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-nav-border bg-nav-bg/60 p-8 text-center">
                            <p className="text-sm text-foreground/60">Arşivlenmiş program yok.</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};
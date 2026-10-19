import React, { useState } from 'react';
import { ProgramCardProps } from '../types';
import { WorkoutDayList } from './WorkoutDayList';
import { IconArrowRight, IconDumbbell } from '@/icons/icon';

export const ProgramCard: React.FC<ProgramCardProps> = ({
    program,
    variant = 'active',
    defaultOpen = false,
    index,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const isArchived = variant === 'archived';

    const days = program.days ?? [];
    const trainingDays = days.filter((d) => !d.isRestDay).length;
    const totalExercises = days.reduce((acc, d) => acc + (d.exercises?.length || 0), 0);

    const archivedDate =
        isArchived && program.archivedAt
            ? new Date(program.archivedAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : null;

    /* ARCHIVE CARD */
    if (isArchived) {
        return (
            <article className="relative overflow-hidden rounded-xl border border-nav-border bg-nav-bg transition-all duration-300 hover:border-brand-400/60 hover:shadow-md">
                <div className="absolute inset-y-0 left-0 w-1 bg-foreground/15" />

                <button
                    type="button"
                    onClick={() => setIsOpen((v) => !v)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 py-3.5 pl-4 pr-4 text-left cursor-pointer"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Sıra Numarası Rozeti */}
                        {typeof index === 'number' && (
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-xs font-bold text-foreground/70 tabular-nums">
                                {index}
                            </span>
                        )}

                        <div className="min-w-0 space-y-1">
                            <h3 className="truncate text-sm font-bold">{program.title}</h3>
                            <p className="text-xs text-foreground/55">
                                {[program.splitType, `${trainingDays} gün`, `${totalExercises} egzersiz`]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                            {archivedDate && (
                                <p className="text-[11px] text-foreground/40">
                                    {archivedDate} tarihinde arşivlendi
                                </p>
                            )}
                        </div>
                    </div>

                    <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground/60 transition-transform duration-300 ${
                            isOpen ? 'rotate-90 bg-brand-100 text-brand-dark' : ''
                        }`}
                    >
                        <IconArrowRight className="h-3.5 w-3.5" />
                    </span>
                </button>

                {isOpen && (
                    <div className="ui-fade-in border-t border-nav-border p-4">
                        <WorkoutDayList days={days} compact />
                    </div>
                )}
            </article>
        );
    }

    return (
        /* ACTIVE CARD */
        <article className="ui-fade-up overflow-hidden rounded-2xl border border-brand-500/30 bg-nav-bg shadow-lg shadow-brand-500/5">
            <div className="h-1 bg-linear-to-r from-brand-500 via-brand-400 to-brand-500" />

            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 bg-brand-50 p-5 sm:p-6 text-left cursor-pointer"
            >
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                        <IconDumbbell className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                                {program.title}
                            </h3>
                            <span className="rounded-md bg-brand-500 px-2 py-0.5 text-xs font-semibold text-white">
                                Aktif
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/65">
                            {program.type && <span>{program.type}</span>}
                            {program.splitType && <span>{program.splitType}</span>}
                            <span className="tabular-nums">{trainingDays} antrenman günü</span>
                            <span className="tabular-nums">{totalExercises} egzersiz</span>
                            {program.trainer && (
                                <span>
                                    Eğitmen:{' '}
                                    <b className="text-foreground">
                                        {program.trainer.name} {program.trainer.surname}
                                    </b>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-nav-border bg-nav-bg text-foreground/70 transition-transform duration-300 ${
                        isOpen ? 'rotate-90' : ''
                    }`}
                >
                    <IconArrowRight className="h-4 w-4" />
                </span>
            </button>

            {isOpen && (
                <div className="ui-fade-in border-t border-nav-border p-5 sm:p-6">
                    <WorkoutDayList days={days} />
                </div>
            )}
        </article>
    );
};
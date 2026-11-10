import React, { useState, useRef } from 'react';
import { WorkoutDayListProps } from '../types';
import { ExerciseItem } from './ExerciseItem';
import { ArrowLeftIcon, ArrowRightIcon } from '@/icons/icon';

export const WorkoutDayList: React.FC<WorkoutDayListProps> = ({ days, compact = false }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!days || days.length === 0) {
        return <p className="text-sm text-foreground/50">Bu programa ait gün bulunmuyor.</p>;
    }

    const safeIndex = activeIndex < days.length ? activeIndex : 0;
    const activeDay = days[safeIndex];
    const exercises = activeDay.exercises ?? [];

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleSelectDay = (idx: number) => {
        setActiveIndex(idx);
        if (scrollContainerRef.current) {
            const buttonNode = scrollContainerRef.current.children[idx] as HTMLElement;
            if (buttonNode) {
                buttonNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    };

    return (
        <div className="space-y-5">
            <div className="relative flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => handleScroll('left')}
                    aria-label="Önceki günleri göster"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-nav-border bg-background text-foreground/70 transition-all hover:border-brand-500 hover:text-brand-500 cursor-pointer"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                </button>

                <div
                    ref={scrollContainerRef}
                    role="tablist"
                    aria-label="Antrenman günleri"
                    className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
                >
                    {days.map((day, idx) => {
                        const selected = idx === safeIndex;
                        return (
                            <button
                                key={day.publicId ?? `day-${idx}`}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                onClick={() => handleSelectDay(idx)}
                                className={`shrink-0 rounded-xl border px-4 py-2.5 text-left transition-all duration-200 cursor-pointer ${
                                    selected
                                        ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/25'
                                        : 'border-nav-border bg-background text-foreground/80 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-text'
                                }`}
                            >
                                <span
                                    className={`block text-[11px] font-medium tabular-nums ${
                                        selected ? 'text-white/75' : 'text-foreground/45'
                                    }`}
                                >
                                    {idx + 1}. gün {day.isRestDay ? '(Dinlenme)' : ''}
                                </span>
                                <span className="block whitespace-nowrap text-sm font-bold">
                                    {day.dayName}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => handleScroll('right')}
                    aria-label="Sonraki günleri göster"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-nav-border bg-background text-foreground/70 transition-all hover:border-brand-500 hover:text-brand-500 cursor-pointer"
                >
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>

            <div key={safeIndex} role="tabpanel" className="space-y-4">
                <div className="ui-fade-in flex items-center justify-between gap-3">
                    <h4 className="text-lg sm:text-xl font-bold tracking-tight">
                        {activeDay.dayName}
                    </h4>
                    {!activeDay.isRestDay && (
                        <span className="rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-dark tabular-nums">
                            {exercises.length} egzersiz
                        </span>
                    )}
                </div>

                {activeDay.isRestDay ? (
                    <div className="ui-pop-in rounded-2xl border border-dashed border-nav-border bg-background px-6 py-12 text-center">
                        <p className="font-bold">Dinlenme günü</p>
                        <p className="mt-1 text-sm text-foreground/60">
                            Bugün antrenman yok. Kasların toparlanıyor.
                        </p>
                    </div>
                ) : exercises.length === 0 ? (
                    <div className="ui-pop-in rounded-2xl border border-dashed border-nav-border bg-background px-6 py-10 text-center">
                        <p className="text-sm text-foreground/60">
                            Bu güne henüz egzersiz eklenmemiş.
                        </p>
                    </div>
                ) : (
                    <ol
                        className={`grid gap-3 ${
                            compact ? 'grid-cols-1' : 'grid-cols-1 2xl:grid-cols-2'
                        }`}
                    >
                        {exercises.map((exerciseItem, idx) => (
                            <li
                                key={exerciseItem.publicId ?? `ex-${idx}`}
                                style={{ '--delay': `${idx * 60}ms` } as React.CSSProperties}
                                className="ui-fade-up"
                            >
                                <ExerciseItem exerciseItem={exerciseItem} position={idx + 1} />
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
};
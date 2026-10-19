import React from 'react';
import { SetTableProps } from '../types';

const rirStyle = (rir?: number | null) => {
    if (rir === null || rir === undefined) return 'text-foreground/40';
    if (rir <= 1) return 'bg-brand-500 text-white';
    if (rir === 2) return 'bg-brand-100 text-brand-dark';
    return 'bg-foreground/5 text-foreground/60';
};

export const SetTable: React.FC<SetTableProps> = ({ sets }) => {
    if (!sets || sets.length === 0) {
        return <p className="text-xs text-foreground/50">Bu harekete set eklenmemiş.</p>;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-nav-border">
            <div className="grid grid-cols-[3rem_1fr_1fr_3.5rem] bg-foreground/5 px-3 py-2 text-xs font-semibold text-foreground/60">
                <span>Set</span>
                <span>Tekrar</span>
                <span>Ağırlık</span>
                <span className="text-center">RIR</span>
            </div>

            <ul className="divide-y divide-nav-border">
                {sets.map((set, idx) => (
                    <li
                        key={set.publicId ?? `set-${idx}`}
                        className="grid grid-cols-[3rem_1fr_1fr_3.5rem] items-center px-3 py-2 text-sm tabular-nums transition-colors hover:bg-brand-50"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white">
                            {set.setNumber}
                        </span>

                        <span className="font-bold">{set.targetReps || '-'}</span>

                        <span>
                            {set.targetWeight ? (
                                <span className="rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-text">
                                    {set.targetWeight} kg
                                </span>
                            ) : (
                                <span className="text-foreground/40">-</span>
                            )}
                        </span>

                        <span className="flex justify-center">
                            <span
                                className={`min-w-6 rounded-md px-1.5 py-0.5 text-center text-xs font-bold ${rirStyle(
                                    set.rir
                                )}`}
                            >
                                {set.rir ?? '-'}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
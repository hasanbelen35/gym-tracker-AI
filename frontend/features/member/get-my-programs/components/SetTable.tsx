import React from 'react';
import { SetTableProps } from '../types';

export const SetTable: React.FC<SetTableProps> = ({ sets }) => {
    if (!sets || sets.length === 0) return <p className="text-xs text-slate-400">Set bilgisi eklenmemiş.</p>;

    return (
        <div className="overflow-x-auto rounded-xl border border-nav-border bg-slate-50/50 dark:bg-slate-800/30">
            <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="px-3 py-2 text-center">Set</th>
                        <th className="px-3 py-2">Tekrar (Reps)</th>
                        <th className="px-3 py-2">Ağırlık (kg)</th>
                        <th className="px-3 py-2 text-center">RIR</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-nav-border">
                    {sets.map((set) => (
                        <tr key={set.publicId} className="hover:bg-brand-50/30 transition-colors">
                            <td className="px-3 py-2 text-center font-bold text-brand-600">{set.setNumber}</td>
                            <td className="px-3 py-2 font-medium text-brand-text">{set.targetReps || "-"}</td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                {set.targetWeight ? `${set.targetWeight} kg` : "-"}
                            </td>
                            <td className="px-3 py-2 text-center text-slate-500">{set.rir ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
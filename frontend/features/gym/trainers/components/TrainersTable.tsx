import React from 'react';
import { TrainersTableProps } from "@/features/gym/trainers/types";

export const TrainersTable: React.FC<TrainersTableProps> = ({ 
    trainers, 
    onRowClick, 
    onDeleteClick, 
    deletingId 
}) => {
    if (!trainers || trainers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-nav-border py-16 text-center bg-nav-bg/30">
                <p className="text-sm text-gray-500">Kayıtlı antrenör bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-nav-border bg-nav-bg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-nav-border bg-black/20 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Ad</th>
                            <th className="px-6 py-4">Soyad</th>
                            <th className="px-6 py-4">E-posta</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-nav-border/50">
                        {trainers.map((trainer) => (
                            <tr
                                key={trainer.publicId}
                                onClick={() => onRowClick(trainer.publicId)}
                                className="group cursor-pointer bg-transparent transition-colors hover:bg-brand-500/5"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-white group-hover:text-brand-500 transition-colors">
                                        {trainer.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {trainer.surname}
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {trainer.email}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={(e) => onDeleteClick(e, trainer)}
                                        disabled={deletingId === trainer.publicId}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingId === trainer.publicId ? "Siliniyor..." : "Sil"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
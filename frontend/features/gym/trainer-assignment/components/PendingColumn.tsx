import React from 'react';
import { PendingColumnProps } from '@/features/gym/trainer-assignment/types';

export const PendingColumn: React.FC<PendingColumnProps> = ({ members, onApprove, onReject }) => {
    return (
        <section className="flex h-[65vh] w-1/3 flex-col rounded-xl border border-nav-border bg-nav-bg shadow-sm">
            <div className="flex items-center justify-between border-b border-nav-border p-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-brand-500 text-xs font-black text-brand-500">
                        02
                    </span>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide text-white">BEKLEYEN TALEPLER</h2>
                        <p className="text-[11px] text-gray-500">Onay bekliyor</p>
                    </div>
                </div>
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500/15 px-2 text-xs font-black text-brand-500">
                    {members.length}
                </span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {members.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-nav-border text-center mt-2">
                        <p className="px-4 text-xs text-gray-500">Bekleyen talep bulunmuyor.</p>
                    </div>
                ) : (
                    members.map((m) => (
                        <div
                            key={m.publicId}
                            className="flex flex-col gap-3 rounded-lg border border-nav-border bg-black/20 p-3 transition-colors hover:border-brand-500/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white">{m.name} {m.surname}</p>
                                    {m.trainer && (
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            Talep eden: {m.trainer.name} {m.trainer.surname}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onApprove(m.publicId)}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border border-nav-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-300 transition-colors hover:border-brand-500 hover:text-brand-500"
                                    >
                                        Onayla
                                    </button>
                                    <button
                                        onClick={() => onReject(m.publicId)}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border border-nav-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-300 transition-colors hover:border-red-500 hover:text-red-500"
                                    >
                                        Reddet
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};
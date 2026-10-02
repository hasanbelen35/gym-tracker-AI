import React from 'react';
import { PendingColumnProps } from '@/features/gym/trainer-assignment/types';


export const PendingColumn: React.FC<PendingColumnProps> = ({ members, onApprove, onReject }) => {
    return (
        <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-yellow-50/40">
            
            {/* COLUMN HEADER */}
            <h3 className="font-bold text-lg mb-4 text-yellow-800 border-b border-yellow-200 pb-2">
                Bekleyen Talepler
            </h3>
            
            {/* COLUMN CONTENT */}
            <div className="flex flex-col gap-2">
                {members.length === 0 ? (
                    <p className="text-yellow-600/60 text-sm italic">Bekleyen talep bulunmuyor.</p>
                ) : (
                    members.map((m) => (
                        <div
                            key={m.publicId}
                            className="flex flex-col gap-2 px-4 py-3 border border-yellow-200 bg-white rounded-xl text-gray-700 font-medium shadow-sm"
                        >
                            
                            {/* MEMBER INFO */}
                            <div className="flex items-center justify-between">
                                <span>{m.name} {m.surname}</span>
                            </div>
                            
                            {/* TRAINER INFO */}
                            {m.trainer && (
                                <span className="text-xs text-gray-400">
                                    Talep eden: {m.trainer.name} {m.trainer.surname}
                                </span>
                            )}
                            
                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={() => onApprove(m.publicId)}
                                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 font-semibold transition-all"
                                >
                                    Onayla
                                </button>
                                <button
                                    onClick={() => onReject(m.publicId)}
                                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-semibold transition-all"
                                >
                                    Reddet
                                </button>
                            </div>
                            
                        </div>
                    ))
                )}
            </div>
            
        </div>
    );
};
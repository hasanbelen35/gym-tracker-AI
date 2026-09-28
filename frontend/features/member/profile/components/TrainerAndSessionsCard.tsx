import React from 'react';
import { TrainerAndSessionsCardProps } from '@/features/member/profile/types';

export const TrainerAndSessionsCard: React.FC<TrainerAndSessionsCardProps> = ({ trainer, sessions }) => {
    return (
        <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3 mb-4">Eğitmenim</h2>
                    {trainer ? (
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold text-lg">
                                {trainer.name?.[0]}{trainer.surname?.[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-text text-base">{trainer.name} {trainer.surname}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{trainer.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Henüz atanmış bir eğitmeniniz bulunmuyor.</p>
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3 mb-4">Antrenman Geçmişi (Session)</h2>
                    {sessions && sessions.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {sessions.map((session, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border flex flex-col gap-1 text-xs"
                                >
                                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-brand-text">Giriş:</span>
                                        <span>{new Date(session.checkIn).toLocaleString('tr-TR')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-brand-text">Çıkış:</span>
                                        <span>
                                            {session.checkOut
                                                ? new Date(session.checkOut).toLocaleString('tr-TR')
                                                : 'Devam ediyor...'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Henüz kaydedilmiş bir oturum (session) bulunmuyor.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
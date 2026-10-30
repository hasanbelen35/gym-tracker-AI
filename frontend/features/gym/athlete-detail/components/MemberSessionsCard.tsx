import React from "react";
import { MemberSessionsCardProps } from '@/features/gym/athlete-detail/types';

export const MemberSessionsCard: React.FC<MemberSessionsCardProps> = ({ sessions = [] }) => {
    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[42vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </span>
                    <span>Son Seanslar & Check-in</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    {sessions.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {sessions.length > 0 ? (
                    sessions.map((session, index) => {
                        const isCompleted = session.checkOut !== null && session.checkOut !== undefined;

                        return (
                            <div
                                key={session.id || index}
                                className="p-3.5 rounded-xl bg-background border border-nav-border flex items-center justify-between text-sm transition-all hover:bg-brand-500/5"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-xs text-gray-500">Giriş Zamanı</span>
                                    <span className="font-semibold text-gray-200 mt-0.5">
                                        {new Date(session.checkIn).toLocaleString('tr-TR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                                    isCompleted
                                        ? 'bg-nav-bg text-gray-300 border border-nav-border'
                                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse'
                                }`}>
                                    {isCompleted
                                        ? (session.duration !== null && session.duration !== undefined ? `${session.duration} dk` : "Tamamlandı")
                                        : "Devam Ediyor"}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 text-gray-500">
                        <p className="text-sm">Geçmiş seans kaydı bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
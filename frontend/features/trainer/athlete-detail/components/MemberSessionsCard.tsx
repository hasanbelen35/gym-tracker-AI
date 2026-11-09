import React, { useRef } from "react";
import { IconClock } from '@/icons/icon';
import { MemberSessionsCardProps } from '@/features/trainer/athlete-detail/types';

interface ExtendedMemberSessionsProps extends MemberSessionsCardProps {
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean;
}

export const MemberSessionsCard: React.FC<ExtendedMemberSessionsProps> = ({ 
    sessions = [], 
    onLoadMore, 
    hasMore = false, 
    loading = false 
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 20 && hasMore && !loading && onLoadMore) {
            onLoadMore();
        }
    };

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[42vh] custom-scrollbar">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold flex items-center gap-2">
                    <IconClock className="w-4 h-4 text-brand-500" />
                    <span>Son Seanslar & Check-in</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-dark">
                    {sessions.length}
                </span>
            </div>

            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto space-y-3 pr-1"
            >
                {sessions.length > 0 ? (
                    <>
                        {sessions.map((session, index) => {
                            const isCompleted = session.checkOut !== null && session.checkOut !== undefined;

                            return (
                                <div
                                    key={session.publicId || session.id || index}
                                    className="p-3.5 rounded-xl bg-background border border-nav-border flex items-center justify-between text-sm transition-all hover:bg-brand-50/5"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-xs opacity-60">Giriş Zamanı</span>
                                        <span className="font-semibold mt-0.5">
                                            {new Date(session.checkIn).toLocaleString('tr-TR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${isCompleted
                                        ? 'bg-brand-50 text-brand-text border border-brand-100'
                                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse'
                                    }`}>
                                        {isCompleted
                                            ? (session.duration !== null && session.duration !== undefined ? `${session.duration} dk` : "Tamamlandı")
                                            : "Devam Ediyor"}
                                    </span>
                                </div>
                            );
                        })}
                        {loading && (
                            <div className="text-center py-2 text-xs opacity-60 animate-pulse">
                                Yükleniyor...
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
                        <p className="text-sm">Geçmiş seans kaydı bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
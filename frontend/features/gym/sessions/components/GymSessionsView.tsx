import React from 'react';
import { ErrorBox } from '@/components/ui/ErrorBox';
import {  GymSessionsViewProps } from '@/features/gym/sessions/types';

// TEXT CONFIG 
const TEXT = {
    header: {
        title: "Salon Oturum & Giriş Yönetimi",
        subtitle: "Anlık aktif katılımı takip edin ve tüm geçmiş seans kayıtlarını inceleyin.",
        activeLabel: "Aktif",
    },
    sections: {
        active: "Aktif Oturumlar",
        history: "Tüm Oturum Geçmişi",
    },
    empty: {
        active: "Şu an salonda aktif seans/oturum bulunmuyor.",
        history: "Henüz kaydedilmiş oturum bulunmuyor.",
    },
    fallback: {
        memberName: "Bilinmeyen Üye",
        memberInitial: "Ü",
        emptyDate: "—",
    },
    status: {
        completed: "Tamamlandı",
        active: "Devam Ediyor",
    },
    pagination: {
        prev: "Önceki",
        next: "Sonraki",
        page: "Sayfa"
    }
} as const;

// TABLE COLUMN CONFIG 
const TABLE_COLUMNS = [
    { key: 'name', label: 'Üye Adı' },
    { key: 'checkIn', label: 'Giriş Zamanı' },
    { key: 'checkOut', label: 'Çıkış Zamanı' },
    { key: 'status', label: 'Durum' }
] as const;

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString('tr-TR');

const getMemberName = (name?: string) => name || TEXT.fallback.memberName;
const getMemberInitial = (name?: string) => name ? name.charAt(0).toUpperCase() : TEXT.fallback.memberInitial;

// VIEW COMPONENT
export const GymSessionsView: React.FC<GymSessionsViewProps> = ({
    allSessions,
    activeSessions,
    error,
    loading,
    currentPage,
    totalPages,
    onPageChange
}) => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">

            {/* ERROR */}
            {error && <ErrorBox message={error} />}

            {/* HEADER */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-(--nav-bg) border border-(--nav-border) p-6 rounded-2xl shadow-(--shadow-nav)">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-(--foreground) flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        {TEXT.header.title}
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {TEXT.header.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {TEXT.header.activeLabel}: {activeSessions.length} Üye
                    </div>
                </div>
            </header>

            {/* ACTIVE SESSIONS */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-(--foreground) flex items-center gap-2">
                        {TEXT.sections.active}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                            {activeSessions.length}
                        </span>
                    </h2>
                </div>

                {activeSessions.length === 0 ? (
                    <div className="bg-(--nav-bg) border border-(--nav-border) rounded-2xl p-10 text-center text-zinc-500 shadow-(--shadow-nav)">
                        {TEXT.empty.active}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {activeSessions.map((session, index) => (
                            <div
                                key={session.id ?? `active-${index}`}
                                className="bg-(--nav-bg) border border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-2xl shadow-(--shadow-nav) transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/20">
                                        {getMemberInitial(session.memberName)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-(--foreground) group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {getMemberName(session.memberName)}
                                        </h4>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                            Giriş: {formatTime(session.checkIn)}
                                        </p>
                                    </div>
                                </div>
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* HISTORY TABLE & PAGINATION */}
            <section className="space-y-4 pt-2">
                <h2 className="text-lg font-semibold text-(--foreground)">
                    {TEXT.sections.history}
                </h2>

                <div className="bg-(--nav-bg) border border-(--nav-border) rounded-2xl shadow-(--shadow-nav) overflow-hidden">
                    <div className="overflow-x-auto relative">
                        <table className={`w-full text-sm text-left transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                            <thead className="bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-b border-(--nav-border)">
                                <tr>
                                    {TABLE_COLUMNS.map((col) => (
                                        <th key={col.key} className="px-5 py-3.5 font-medium">
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--nav-border)">
                                {allSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={TABLE_COLUMNS.length} className="p-12 text-center text-zinc-500">
                                            {TEXT.empty.history}
                                        </td>
                                    </tr>
                                ) : (
                                    allSessions.map((session, index) => {
                                        const isCompleted = !!session.checkOut;
                                        return (
                                            <tr key={session.id ?? `history-${index}`} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-5 py-4 font-semibold text-(--foreground) flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-dark/20 text-brand-500 text-xs font-bold flex items-center justify-center shrink-0">
                                                        {getMemberInitial(session.memberName)}
                                                    </div>
                                                    {getMemberName(session.memberName)}
                                                </td>
                                                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                                                    {formatDateTime(session.checkIn)}
                                                </td>
                                                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                                                    {isCompleted ? formatDateTime(session.checkOut!) : TEXT.fallback.emptyDate}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {isCompleted ? (
                                                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                                                            {TEXT.status.completed}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                            {TEXT.status.active}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-4 border-t border-(--nav-border) bg-black/5 dark:bg-white/5">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="px-4 py-2 text-sm font-medium rounded-xl border border-(--nav-border) bg-(--nav-bg) text-(--foreground) hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {TEXT.pagination.prev}
                            </button>

                            <span className="text-sm text-zinc-500">
                                {TEXT.pagination.page} <span className="font-semibold text-(--foreground)">{currentPage}</span> / {totalPages}
                            </span>

                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                className="px-4 py-2 text-sm font-medium rounded-xl border border-(--nav-border) bg-(--nav-bg) text-(--foreground) hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {TEXT.pagination.next}
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};
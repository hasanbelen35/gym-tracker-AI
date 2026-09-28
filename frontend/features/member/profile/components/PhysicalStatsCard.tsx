import React from 'react';
import { PhysicalStatsCardProps } from '@/features/member/profile/types';

export const PhysicalStatsCard: React.FC<PhysicalStatsCardProps> = ({ profile }) => {
    return (
        <div className="md:col-span-2 bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3">Fiziksel Bilgiler</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                    <span className="text-xs text-slate-400 block mb-1">Yaş</span>
                    <span className="text-xl font-bold text-brand-text">{profile?.age ?? "-"}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                    <span className="text-xs text-slate-400 block mb-1">Boy (cm)</span>
                    <span className="text-xl font-bold text-brand-text">{profile?.height ?? "-"}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                    <span className="text-xs text-slate-400 block mb-1">Kilo (kg)</span>
                    <span className="text-xl font-bold text-brand-text">{profile?.weight ?? "-"}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                    <span className="text-xs text-slate-400 block mb-1">Cinsiyet</span>
                    <span className="text-xl font-bold text-brand-text">{profile?.gender ?? "-"}</span>
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Telefon Numarası</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                    {profile?.phone || "Belirtilmemiş"}
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sağlık Notları</span>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text min-h-20">
                    {profile?.medicalNotes || "Herhangi bir sağlık notu bulunmuyor."}
                </div>
            </div>
        </div>
    );
};
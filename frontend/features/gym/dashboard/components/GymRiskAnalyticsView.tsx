import React, { useState } from 'react';
import { RiskAnalyticsData } from '@/types/risk.types';
import { 
    IconCheck, 
    IconUserX, 
    IconReset, 
    IconArrowRight, 
    RobotIcon 
} from '@/icons/icon'; 

interface Props {
    analytics: RiskAnalyticsData;
    onRefresh: () => void;
    loading: boolean;
}

export const GymRiskAnalyticsView: React.FC<Props> = ({ analytics, onRefresh, loading }) => {
    const [activeTab, setActiveTab] = useState<'atRisk' | 'ghosts' | 'regulars'>('atRisk');

    const { summary, atRiskMembers, ghostMembers, regularMembers, lastCalculatedAt } = analytics;

    const getReasonBadge = (reason: string) => {
        switch (reason) {
            case 'ABSENCE_ABOVE_USUAL_PATTERN':
                return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-brand-50 text-brand-text dark:bg-brand-100 border border-brand-400/30">Alışılmışın Dışında Uzaklaşma</span>;
            case 'VISIT_FREQUENCY_DROPPED':
                return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Sıklık Düştü</span>;
            case 'NO_VISIT_10_PLUS':
                return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">10+ Gündür Kayıp</span>;
            case 'NO_VISIT_30_PLUS':
                return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">30+ Gün (Ghost)</span>;
            case 'NEVER_VISITED':
                return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">Hiç Gelmedi</span>;
            default:
                return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Aktif / Düzenli</span>;
        }
    };

    const activeList = activeTab === 'atRisk' ? atRiskMembers : activeTab === 'ghosts' ? ghostMembers : regularMembers;

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-(--nav-bg) border border-(--nav-border) p-6 rounded-2xl shadow-(--shadow-nav)">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-(--foreground) flex items-center gap-2">
                        <RobotIcon className="w-6 h-6 text-brand-500" />
                        Üye  & Risk Analitiği
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Son hesaplama: {new Date(lastCalculatedAt).toLocaleString('tr-TR')} 
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-lg shadow-(--color-brand-500)/20 disabled:opacity-50 cursor-pointer"
                >
                    <IconReset className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Analizi Yenile
                </button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                    onClick={() => setActiveTab('regulars')}
                    className={`cursor-pointer bg-(--nav-bg) border transition-all p-5 rounded-2xl shadow-(--shadow-nav) ${activeTab === 'regulars' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-(--nav-border) hover:border-zinc-400'}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Sadık Üyeler</span>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <IconCheck className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-(--foreground)">{summary.regularCount}</span>
                        <span className="text-xs text-zinc-500">/ {summary.total} toplam</span>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveTab('atRisk')}
                    className={`cursor-pointer bg-(--nav-bg) border transition-all p-5 rounded-2xl shadow-(--shadow-nav) ${activeTab === 'atRisk' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-(--nav-border) hover:border-zinc-400'}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Risk Altındakiler</span>
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-brand-500">
                            <RobotIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-(--foreground)">{summary.atRiskCount}</span>
                        <span className="text-xs text-orange-500 font-medium">Acil müdahale önerilir</span>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveTab('ghosts')}
                    className={`cursor-pointer bg-(--nav-bg) border transition-all p-5 rounded-2xl shadow-(--shadow-nav) ${activeTab === 'ghosts' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-(--nav-border) hover:border-zinc-400'}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Hayalet Üyeler (Ghost)</span>
                        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                            <IconUserX className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-(--foreground)">{summary.ghostCount}</span>
                        <span className="text-xs text-red-500 font-medium">30+ gündür gelmeyen</span>
                    </div>
                </div>
            </div>

            {/* Members List Table / Cards Container */}
            <div className="bg-(--nav-bg) border border-(--nav-border) rounded-2xl shadow-(--shadow-nav) overflow-hidden">
                <div className="p-5 border-b border-(--nav-border) flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-(--foreground)">
                        {activeTab === 'atRisk' && `Risk Altındaki Üyeler (${atRiskMembers.length})`}
                        {activeTab === 'ghosts' && `Hayalet Üyeler (${ghostMembers.length})`}
                        {activeTab === 'regulars' && `Sadık Üyeler (${regularMembers.length})`}
                    </h3>
                </div>

                <div className="divide-y divide-(--nav-border) overflow-x-auto">
                    {activeList.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">Bu kategoride listelenecek üye bulunmuyor.</div>
                    ) : (
                        activeList.map((member) => (
                            <div key={member.memberId} className="p-4 sm:p-5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-dark/20 text-brand-500 font-bold flex items-center justify-center shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-(--foreground)">{member.name}</h4>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{member.email || 'E-posta belirtilmemiş'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="hidden md:block text-right">
                                        <p className="text-xs text-zinc-500">Son Ziyaret</p>
                                        <p className="text-sm font-semibold text-(--foreground)">{member.lastVisitDaysAgo} gün önce</p>
                                    </div>
                                    
                                    <div className="hidden lg:block">
                                        {getReasonBadge(member.reason)}
                                    </div>

                                    <button 
                                        onClick={() => alert(`Yapay zeka asistanı yakında ${member.name} için özel koçluk önerisi üretecek!`)}
                                        className="p-2 rounded-xl border border-(--nav-border) hover:border-brand-500 text-(--foreground) hover:text-brand-500 transition-all cursor-pointer"
                                        title="Kişiye Özel AI Çözüm Üret"
                                    >
                                        <IconArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { RiskAnalyticsData } from '@/types/risk.types';
import { IconCheck, IconUserX, IconReset, IconArrowRight, RobotIcon } from '@/icons/icon';
import {
    MemberDetailModal,
    MemberAvatar,
    getRiskReason,
    RiskAnalyticsMember,
} from './MemberDetailModal';

interface Props {
    analytics: RiskAnalyticsData;
    onRefresh: () => void;
    loading: boolean;
}

type TabKey = 'atRisk' | 'ghosts' | 'regulars';

export const GymRiskAnalyticsView: React.FC<Props> = ({ analytics, onRefresh, loading }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('atRisk');
    const [selectedMember, setSelectedMember] = useState<RiskAnalyticsMember | null>(null);

    const { summary, atRiskMembers, ghostMembers, regularMembers, lastCalculatedAt } = analytics;

    const tabs: {
        key: TabKey;
        label: string;
        title: string;
        count: number;
        members: RiskAnalyticsMember[];
        icon: React.ReactNode;
        iconWrapClass: string;
        hint: React.ReactNode;
    }[] = [
        {
            key: 'regulars',
            label: 'Sadık Üyeler',
            title: 'Sadık Üyeler',
            count: summary.regularCount,
            members: regularMembers,
            icon: <IconCheck className="w-5 h-5" />,
            iconWrapClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            hint: <span className="text-xs text-zinc-500">/ {summary.total} toplam</span>,
        },
        {
            key: 'atRisk',
            label: 'Risk Altındakiler',
            title: 'Risk Altındaki Üyeler',
            count: summary.atRiskCount,
            members: atRiskMembers,
            icon: <RobotIcon className="w-5 h-5" />,
            iconWrapClass: 'bg-orange-500/10 text-brand-500',
            hint: <span className="text-xs text-orange-500 font-medium">Acil müdahale önerilir</span>,
        },
        {
            key: 'ghosts',
            label: 'Hayalet Üyeler (Ghost)',
            title: 'Hayalet Üyeler',
            count: summary.ghostCount,
            members: ghostMembers,
            icon: <IconUserX className="w-5 h-5" />,
            iconWrapClass: 'bg-red-500/10 text-red-600 dark:text-red-400',
            hint: <span className="text-xs text-red-500 font-medium">30+ gündür gelmeyen</span>,
        },
    ];

    const currentTab = tabs.find((t) => t.key === activeTab)!;
    const activeList = currentTab.members;

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-(--nav-bg) border border-(--nav-border) p-6 rounded-2xl shadow-(--shadow-nav)">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-(--foreground) flex items-center gap-2">
                        <RobotIcon className="w-6 h-6 text-brand-500" />
                        Üye & Risk Analitiği
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Son hesaplama: {new Date(lastCalculatedAt).toLocaleString('tr-TR')}
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
                >
                    <IconReset className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Analizi Yenile
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {tabs.map((tab) => (
                    <div
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`cursor-pointer bg-(--nav-bg) border transition-all p-5 rounded-2xl shadow-(--shadow-nav) ${
                            activeTab === tab.key
                                ? 'border-brand-500 ring-1 ring-brand-500'
                                : 'border-(--nav-border) hover:border-zinc-400'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{tab.label}</span>
                            <div className={`p-2.5 rounded-xl ${tab.iconWrapClass}`}>{tab.icon}</div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-(--foreground)">{tab.count}</span>
                            {tab.hint}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-(--nav-bg) border border-(--nav-border) rounded-2xl shadow-(--shadow-nav) overflow-hidden">
                <div className="p-5 border-b border-(--nav-border)">
                    <h3 className="font-semibold text-lg text-(--foreground)">
                        {currentTab.title} ({activeList.length})
                    </h3>
                </div>

                <div className="divide-y divide-(--nav-border) overflow-x-auto">
                    {activeList.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            Bu kategoride listelenecek üye bulunmuyor.
                        </div>
                    ) : (
                        activeList.map((member) => {
                            const reason = getRiskReason(member.reason);
                            return (
                                <div
                                    key={member.memberId}
                                    onClick={() => setSelectedMember(member)}
                                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <MemberAvatar name={member.name} avatarUrl={member.avatarUrl} />
                                        <div>
                                            <h4 className="font-semibold text-(--foreground)">{member.name}</h4>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {member.email || 'E-posta belirtilmemiş'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:block text-right">
                                            <p className="text-xs text-zinc-500">Son Ziyaret</p>
                                            <p className="text-sm font-semibold text-(--foreground)">
                                                {member.neverVisited ? 'Hiç gelmedi' : `${member.lastVisitDaysAgo} gün önce`}
                                            </p>
                                        </div>

                                        <div className="hidden lg:block">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${reason.badgeClass}`}>
                                                {reason.badgeLabel}
                                            </span>
                                        </div>

                                        <button
                                            className="p-2 rounded-xl border border-(--nav-border) hover:border-brand-500 text-(--foreground) hover:text-brand-500 transition-all cursor-pointer"
                                            title="Detayları Görüntüle"
                                        >
                                            <IconArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <MemberDetailModal
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
};
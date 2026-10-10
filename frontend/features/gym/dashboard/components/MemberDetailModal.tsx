import React, { useEffect } from 'react';
import { IconClose } from '@/icons/icon';
import { AIAnalyzeButton } from '@/components/AIAnalyzeButton';
import { ReasonConfig, RiskAnalyticsMember } from '../types';

const REASONS: Record<string, ReasonConfig> = {
    ABSENCE_ABOVE_USUAL_PATTERN: {
        badgeLabel: 'Alışılmışın Dışında Uzaklaşma',
        description: 'Alışılmışın Dışında Uzaklaşma (Normal seans aralığının çok üstüne çıktı)',
        badgeClass: 'bg-brand-50 text-brand-text dark:bg-brand-100 border-brand-400/30',
    },
    VISIT_FREQUENCY_DROPPED: {
        badgeLabel: 'Sıklık Düştü',
        description: 'Ziyaret Sıklığı Düştü (Son 14 günde belirgin düşüş var)',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    NO_VISIT_10_PLUS: {
        badgeLabel: '10+ Gündür Kayıp',
        description: '10+ Gündür Salona Gelmiyor',
        badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    },
    NO_VISIT_30_PLUS: {
        badgeLabel: '30+ Gün (Ghost)',
        description: '30+ Gündür Kayıp (Ghost Üye)',
        badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    NEVER_VISITED: {
        badgeLabel: 'Hiç Gelmedi',
        description: 'Sisteme Kayıtlı Fakat Hiç Gelmedi',
        badgeClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    },
    NEW_MEMBER: {
        badgeLabel: 'Yeni Üye',
        description: 'Yeni Üye (Grace - Deneme Dönemi)',
        badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    },
};

const ACTIVE_REASON: ReasonConfig = {
    badgeLabel: 'Aktif / Düzenli',
    description: 'Aktif / Düzenli Ziyaretçi',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

export const getRiskReason = (reason: string): ReasonConfig => REASONS[reason] ?? ACTIVE_REASON;

export const MemberAvatar: React.FC<{
    name: string;
    avatarUrl?: string | null;
    size?: 'md' | 'lg';
}> = ({ name, avatarUrl, size = 'md' }) => {
    const base = `${size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10'} rounded-xl shrink-0`;

    if (avatarUrl) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={avatarUrl} alt={name} className={`${base} object-cover`} />;
    }

    return (
        <div className={`${base} bg-brand-100 dark:bg-brand-dark/20 text-brand-500 font-bold flex items-center justify-center`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

interface MemberDetailModalProps {
    member: RiskAnalyticsMember | null;
    onClose: () => void;
    onAnalyze?: (member: RiskAnalyticsMember) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose, onAnalyze }) => {
    useEffect(() => {
        if (!member) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [member, onClose]);

    if (!member) return null;

    const stats = [
        {
            label: 'Son Ziyaret',
            value: member.neverVisited ? 'Hiç gelmedi' : `${member.lastVisitDaysAgo} gün önce`,
        },
        {
            label: 'Ortalama Ziyaret Aralığı',
            value: member.avgGapDays !== null ? `Her ${member.avgGapDays} günde bir` : 'Veri yok',
        },
        { label: 'Son 14 Günde Ziyaret', value: `${member.visitsLast14Days} seans` },
        { label: 'Önceki 14 Günde Ziyaret', value: `${member.visitsPrev14Days} seans` },
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
        >
            <div className="bg-(--nav-bg) border border-(--nav-border) rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6 text-(--foreground)">
                <div className="flex items-center justify-between border-b border-(--nav-border) pb-4">
                    <div className="flex items-center gap-3">
                        <MemberAvatar name={member.name} avatarUrl={member.avatarUrl} size="lg" />
                        <div>
                            <h3 className="text-lg font-bold">{member.name}</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {member.email || 'E-posta belirtilmemiş'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Kapat"
                        className="p-2 rounded-xl border border-(--nav-border) hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
                    >
                        <IconClose className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-100/10 border border-brand-400/20">
                    <h4 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
                        Analiz Edilen Risk Nedeni
                    </h4>
                    <p className="text-sm font-medium mt-0.5">{getRiskReason(member.reason).description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {stats.map(({ label, value }) => (
                        <div
                            key={label}
                            className="p-3.5 rounded-xl border border-(--nav-border) bg-black/5 dark:bg-white/5"
                        >
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
                            <p className="text-base font-bold mt-1">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-(--nav-border)">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-sm border border-(--nav-border) hover:border-zinc-400 transition-all cursor-pointer"
                    >
                        Kapat
                    </button>
                    <AIAnalyzeButton
                        onClick={() => onAnalyze?.(member)}
                        label="AI Koçluk Önerisi Üret"
                    />
                </div>
            </div>
        </div>
    );
};
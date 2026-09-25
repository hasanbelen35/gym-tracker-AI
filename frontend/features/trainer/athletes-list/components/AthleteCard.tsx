import React from "react";
import { AthleteCardProps } from '@/features/trainer/athletes-list/types';

export const AthleteCard: React.FC<AthleteCardProps> = ({ member, type, onClick }) => {
    const isApproved = type === 'approved';

    // İsim baş harflerini almak için güvenli bir yardımcı
    const initials = `${member.name?.[0] || ''}${member.surname?.[0] || ''}`.toUpperCase();

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl bg-background border border-nav-border flex items-center justify-between transition-all ${
                isApproved ? 'hover:border-brand-500 cursor-pointer group' : ''
            }`}
        >
            <div className="flex items-center gap-3">
                {/* AVATAR BÖLÜMÜ */}
                <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full border border-nav-border bg-nav-bg text-xs font-bold text-foreground/80">
                    {member.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={member.avatarUrl}
                            alt={`${member.name} ${member.surname}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>

                {/* İSİM VE E-POSTA */}
                <div>
                    <h3 className={`font-semibold text-base ${isApproved ? 'group-hover:text-brand-500 transition-colors' : ''}`}>
                        {member.name} {member.surname}
                    </h3>
                    <p className="text-xs opacity-70">{member.email}</p>
                </div>
            </div>

            {/* DURUM ROZETİ */}
            {isApproved ? (
                <span className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white font-medium shadow-sm">
                    Detay &rarr;
                </span>
            ) : (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-text font-medium">
                    Onay Bekliyor
                </span>
            )}
        </div>
    );
};
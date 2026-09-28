import React from 'react';
import { IconUser } from "@/icons/icon";
import { ProfileHeaderProps } from '@/features/member/profile/types';


export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, assignmentStatus }) => {
    return (
        <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <IconUser className="w-10 h-10" />
                )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
                <h1 className="text-2xl font-bold text-brand-text">
                    {profile?.name} {profile?.surname}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                    {profile?.gym?.name && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-600 border border-brand-100 dark:border-brand-500/20">
                            {profile.gym.name}
                        </span>
                    )}
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase border ${assignmentStatus === 'ASSIGNED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20'
                        }`}>
                        Durum: {assignmentStatus || 'UNASSIGNED'}
                    </span>
                </div>
            </div>
        </div>
    );
};
import React from 'react';
import { IconUser } from "@/icons/icon";
import { Member } from '@/types/types';
import { UpdateMemberProfileData } from '../types';
interface ProfileHeaderProps {
    profile: Partial<Member> | null | undefined;
    assignmentStatus: string | null | undefined;
    isEditing: boolean;
    formData: UpdateMemberProfileData;
    onChange: (field: keyof UpdateMemberProfileData, value: string | number | undefined) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, assignmentStatus, isEditing, formData, onChange }) => {
    return (
        <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative">
            <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <IconUser className="w-10 h-10" />
                )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2 w-full">
                {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={formData.name || ""}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="px-3 py-2 border border-nav-border rounded-lg bg-transparent text-brand-text w-full focus:outline-brand-500"
                            placeholder="Ad"
                        />
                        <input
                            type="text"
                            value={formData.surname || ""}
                            onChange={(e) => onChange('surname', e.target.value)}
                            className="px-3 py-2 border border-nav-border rounded-lg bg-transparent text-brand-text w-full focus:outline-brand-500"
                            placeholder="Soyad"
                        />
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold text-brand-text">
                        {profile?.name} {profile?.surname}
                    </h1>
                )}
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
import React from "react";
import { MemberStatsGridProps } from '@/features/trainer/athlete-detail/types';


export const MemberStatsGrid: React.FC<MemberStatsGridProps> = ({ member, getGenderLabel }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                <p className="text-xs opacity-60 font-medium">Yaş</p>
                <p className="text-xl font-bold mt-1 tracking-tight">{member.age ?? "-"}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                <p className="text-xs opacity-60 font-medium">Cinsiyet</p>
                <p className="text-xl font-bold mt-1 tracking-tight">{getGenderLabel(member.gender)}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                <p className="text-xs opacity-60 font-medium">Boy</p>
                <p className="text-xl font-bold mt-1 tracking-tight">
                    {member.height ? `${member.height} cm` : "-"}
                </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                <p className="text-xs opacity-60 font-medium">Kilo</p>
                <p className="text-xl font-bold mt-1 tracking-tight">
                    {member.weight ? `${member.weight} kg` : "-"}
                </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                <p className="text-xs opacity-60 font-medium">Telefon</p>
                <p className="text-base sm:text-lg font-bold mt-1 tracking-tight truncate">
                    {member.phone ?? "-"}
                </p>
            </div>
        </div>
    );
};
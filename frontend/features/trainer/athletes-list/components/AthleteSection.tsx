import React from "react";
import { AthleteCard } from "./AthleteCard";
import Loading from "@/components/Loading";
import { AthleteSectionProps } from '@/features/trainer/athletes-list/types';


export const AthleteSection: React.FC<AthleteSectionProps> = ({
    title,
    icon,
    members,
    loading,
    type,
    emptyText,
    onMemberClick,
}) => {
    return (
        <section className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col h-[70vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>{icon} {title}</span>
                </h2>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-100 text-brand-dark">
                    {members.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {loading && members.length === 0 ? (
                    type === 'pending' ? <Loading /> : <p className="text-center text-sm opacity-60 py-10">Yükleniyor...</p>
                ) : members.length === 0 ? (
                    <p className="text-center text-sm opacity-60 py-10">{emptyText}</p>
                ) : (
                    members.map((member) => (
                        <AthleteCard
                            key={member.publicId}
                            member={member}
                            type={type}
                            onClick={onMemberClick ? () => onMemberClick(member.publicId) : undefined}
                        />
                    ))
                )}
            </div>
        </section>
    );
};
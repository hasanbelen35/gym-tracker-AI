import React from "react";
import Image from "next/image";
import { MemberHeaderProps } from "@/features/trainer/athlete-detail/types"; 


export const MemberHeader: React.FC<MemberHeaderProps> = ({ member, getStatusBadge }) => {
    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    {member.avatarUrl ? (
                        <Image
                            src={member.avatarUrl}
                            alt={`${member.name} ${member.surname}`}
                            width={80}
                            height={80}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-nav-border shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-100 text-brand-dark flex items-center justify-center text-xl font-bold border border-nav-border shadow-sm">
                            {member.name?.[0]}{member.surname?.[0]}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {member.name} {member.surname}
                            </h1>
-                            {getStatusBadge && getStatusBadge(member.assignmentStatus)}
                        </div>
                        <p className="text-sm opacity-70 mt-1">{member.email}</p>
                    </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2 self-start sm:self-auto">
                    {member.gym?.name && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold tracking-wide shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {member.gym.name}
                        </div>
                    )}
                    {member.createdAt && (
                        <div className="text-xs opacity-60 bg-background px-3 py-1.5 rounded-lg border border-nav-border">
                            Kayıt: {new Date(member.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
import React from "react";
import Image from "next/image";

import { MemberProfileHeaderProps } from '@/features/member/profile/types';

export const MemberProfileHeader: React.FC<MemberProfileHeaderProps> = ({ member, getStatusBadge, assignmentStatus }) => {
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
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                {member.name} {member.surname}
                            </h1>
                            {getStatusBadge && assignmentStatus !== undefined && getStatusBadge(assignmentStatus)}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{member.email}</p>
                    </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2 self-start sm:self-auto">
                    {member.createdAt && (
                        <div className="text-xs text-gray-400 bg-background px-3 py-1.5 rounded-lg border border-nav-border">
                            Kayıt: {new Date(member.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
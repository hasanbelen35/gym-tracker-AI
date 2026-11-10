'use client';

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MemberTrainerCardProps } from '@/features/member/profile/types'


export const MemberTrainerCard: React.FC<MemberTrainerCardProps> = ({ trainer, assignmentStatus }) => {
    const router = useRouter();

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </span>
                    <span>Antrenörüm</span>
                </h2>
            </div>

            {trainer ? (
                <div
                    onClick={() => router.push('/athlete/myTrainer')}
                    className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/50 transition-all flex items-center justify-between gap-4 cursor-pointer"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        {trainer.avatarUrl ? (
                            <Image
                                src={trainer.avatarUrl}
                                alt={`${trainer.name} ${trainer.surname}`}
                                width={56}
                                height={56}
                                className="w-14 h-14 rounded-xl object-cover border border-nav-border"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-xl bg-brand-100 text-brand-dark flex items-center justify-center text-base font-bold border border-nav-border">
                                {trainer.name?.[0]}{trainer.surname?.[0]}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{trainer.name} {trainer.surname}</p>
                            {trainer.email && <p className="text-xs text-gray-400 truncate mt-0.5">{trainer.email}</p>}
                            {trainer.phone && <p className="text-xs text-gray-400 truncate">{trainer.phone}</p>}
                        </div>
                    </div>
                    {assignmentStatus === 'ASSIGNED' && (
                        <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Aktif
                        </span>
                    )}
                    {assignmentStatus === 'PENDING' && (
                        <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Onay Bekliyor
                        </span>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500">
                    <p className="text-sm">Henüz atanmış bir antrenörünüz bulunmuyor.</p>
                </div>
            )}
        </div>
    );
};
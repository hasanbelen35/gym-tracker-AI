import React from "react";
import { Avatar } from "./Avatar";
import { IconPlus, IconUserX } from "@/icons/icon";
import { MemberCardProps } from '@/features/trainer/athlete-assignment/types'

export const MemberCard: React.FC<MemberCardProps> = ({ member, step, onRequest, onCancel }) => {
    if (step === "01") {
        return (
            <button
                onClick={() => onRequest(member.publicId)}
                className="group flex w-full items-center justify-between gap-3 rounded-lg border border-nav-border bg-(--background) p-3 text-left transition-colors hover:border-brand-500/55 cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <Avatar name={member.name} surname={member.surname} />
                    <div>
                        <p className="text-sm font-semibold">{member.name} {member.surname}</p>
                        <p className="text-xs text-(--foreground)/50">{member.email}</p>
                    </div>
                </div>
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <IconPlus className="h-3.5 w-3.5" />
                </span>
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-nav-border bg-(--background) p-3">
            <div className="flex items-center gap-3">
                <Avatar name={member.name} surname={member.surname} />
                <div>
                    <p className="text-sm font-semibold">{member.name} {member.surname}</p>
                    <p className="text-xs text-(--foreground)/50">{member.email}</p>
                </div>
            </div>
            <button
                onClick={() => onCancel(member.publicId)}
                className="flex cursor-pointer flex-none items-center gap-1 rounded-lg border border-nav-border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-(--foreground)/55 transition-colors hover:border-brand-600/40 hover:text-brand-text"
            >
                <IconUserX className="h-3.5 w-3.5" />
                Geri Çek
            </button>
        </div>
    );
};
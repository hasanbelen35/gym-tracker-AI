import React from "react";
import { MemberCard } from "./MemberCard";
import { StageColumnProps } from '@/features/trainer/athlete-assignment/types'


export const StageColumn: React.FC<StageColumnProps> = ({ stage, loading, onRequest, onCancel }) => {
    const StageIcon = stage.icon;

    return (
        <section className="flex h-[65vh] flex-col rounded-xl border border-nav-border bg-nav-bg shadow-nav">
            <div className="flex items-center justify-between border-b border-nav-border p-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-brand-500 text-xs font-black text-brand-500">
                        {stage.step}
                    </span>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide">{stage.title}</h2>
                        <p className="text-[11px] text-(--foreground)/50">{stage.subtitle}</p>
                    </div>
                </div>
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500/15 px-2 text-xs font-black text-brand-500">
                    {stage.members.length}
                </span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {loading && stage.members.length === 0 ? (
                    <p className="py-10 text-center text-sm text-(--foreground)/45">Yükleniyor...</p>
                ) : stage.members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-nav-border py-10 text-center">
                        <StageIcon className="h-6 w-6 text-nav-border" />
                        <p className="px-4 text-xs text-(--foreground)/45">{stage.emptyText}</p>
                    </div>
                ) : (
                    stage.members.map((member) => (
                        <MemberCard
                            key={member.publicId}
                            member={member}
                            step={stage.step}
                            onRequest={onRequest}
                            onCancel={onCancel}
                        />
                    ))
                )}
            </div>
        </section>
    );
};
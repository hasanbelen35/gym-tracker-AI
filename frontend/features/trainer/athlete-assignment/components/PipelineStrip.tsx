import React from "react";
import { IconArrowRight } from "@/icons/icon";
import { PipelineStripProps } from '@/features/trainer/athlete-assignment/types'


export const PipelineStrip: React.FC<PipelineStripProps> = ({ stages }) => (
    <div className="mb-6 hidden items-center gap-3 md:flex">
        {stages.map((s, i) => (
            <div key={s.step} className="flex flex-1 items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-nav-border bg-nav-bg px-3.5 py-2.5">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-brand-500 text-[10px] font-black text-brand-500">
                        {s.step}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-(--foreground)/80">{s.title}</span>
                </div>
                {i < stages.length - 1 && (
                    <IconArrowRight className="h-4 w-4 flex-none text-(--foreground)/25" />
                )}
            </div>
        ))}
    </div>
);
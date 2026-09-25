import React from "react";
import { IconArrowRight } from "@/icons/icon";
import { MemberMeasurement } from "@/types/types"; 

interface MeasurementItemProps {
    measurement: MemberMeasurement;
    isSelected: boolean;
    displayDate: string;
    index: number;
    totalCount: number;
    onSelect: () => void;
}

export const MeasurementItem: React.FC<MeasurementItemProps> = ({
    isSelected,
    displayDate,
    index,
    totalCount,
    onSelect,
}) => {
    return (
        <div
            onClick={onSelect}
            className={`p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-sm'
                    : 'bg-background border-nav-border hover:border-brand-500/40 text-foreground/80'
                }`}
        >
            <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-500' : 'bg-nav-border'}`} />
                <span>
                    {displayDate !== "-" ? displayDate : `Ölçüm #${totalCount - index}`}
                </span>
            </div>
            <IconArrowRight
                className={`w-4 h-4 transition-transform ${isSelected ? 'opacity-150 translate-x-0.5' : 'opacity-40'
                    }`}
            />
        </div>
    );
};
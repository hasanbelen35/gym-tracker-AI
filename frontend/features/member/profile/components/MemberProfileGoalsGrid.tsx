import React from "react";
import { MemberProfileGoalsGridProps } from '@/features/member/profile/types';


const GOAL_LABELS: Record<string, string> = {
    MUSCLE_GAIN: "Kas Kazanımı",
    FAT_LOSS: "Yağ Yakımı",
    STRENGTH: "Güç Artışı",
    GENERAL_FITNESS: "Genel Kondisyon",
};

const LEVEL_LABELS: Record<string, string> = {
    BEGINNER: "Başlangıç",
    INTERMEDIATE: "Orta",
    ADVANCED: "İleri",
};

const EQUIPMENT_LABELS: Record<string, string> = {
    GYM: "Spor Salonu",
    HOME: "Ev",
    BODYWEIGHT: "Vücut Ağırlığı",
};

const ACTIVITY_LABELS: Record<string, string> = {
    SEDENTARY: "Hareketsiz",
    MODERATE: "Orta Aktif",
    ACTIVE: "Aktif",
};

export const MemberProfileGoalsGrid: React.FC<MemberProfileGoalsGridProps> = ({ member }) => {
    const hasAnyData =
        member.goal ||
        member.experienceLevel ||
        member.workoutDaysPerWeek ||
        member.sessionDuration ||
        member.equipmentAccess ||
        member.activityLevel ||
        member.additionalNotes;

    if (!hasAnyData) return null;

    const items = [
        { label: "Hedef", value: member.goal ? GOAL_LABELS[member.goal] || member.goal : "-" },
        { label: "Deneyim Seviyesi", value: member.experienceLevel ? LEVEL_LABELS[member.experienceLevel] || member.experienceLevel : "-" },
        { label: "Haftalık Antrenman", value: member.workoutDaysPerWeek ? `${member.workoutDaysPerWeek} gün` : "-" },
        { label: "Seans Süresi", value: member.sessionDuration ? `${member.sessionDuration} dk` : "-" },
        { label: "Ekipman", value: member.equipmentAccess ? EQUIPMENT_LABELS[member.equipmentAccess] || member.equipmentAccess : "-" },
        { label: "Aktivite Seviyesi", value: member.activityLevel ? ACTIVITY_LABELS[member.activityLevel] || member.activityLevel : "-" },
    ];

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Hedefler & Tercihler</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-background border border-nav-border hover:border-brand-500/40 transition-all">
                        <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                        <p className="text-base font-bold mt-1 tracking-tight text-white">{item.value}</p>
                    </div>
                ))}
            </div>
            {member.additionalNotes && (
                <p className="text-xs text-gray-300 bg-background p-3 rounded-xl border border-nav-border leading-relaxed">
                    {member.additionalNotes}
                </p>
            )}
        </div>
    );
};
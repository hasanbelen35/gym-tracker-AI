import React from "react";
import Image from "next/image";
import { MemberHeaderProps } from "@/features/trainer/athlete-detail/types";
import { Goal, ExperienceLevel, EquipmentAccess, ActivityLevel } from "@/types/types";

const goalLabels: Record<Goal, string> = {
    MUSCLE_GAIN: "Kas Kazanımı",
    FAT_LOSS: "Yağ Yakımı",
    STRENGTH: "Kuvvet",
    GENERAL_FITNESS: "Genel Fitness",
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
    BEGINNER: "Başlangıç",
    INTERMEDIATE: "Orta Seviye",
    ADVANCED: "İleri Seviye",
};

const equipmentAccessLabels: Record<EquipmentAccess, string> = {
    GYM: "Spor Salonu",
    HOME: "Ev Tipi Ekipman",
    BODYWEIGHT: "Sadece Vücut Ağırlığı",
};

const activityLevelLabels: Record<ActivityLevel, string> = {
    SEDENTARY: "Hareketsiz",
    MODERATE: "Orta Derecede Aktif",
    ACTIVE: "Aktif",
};

export const MemberHeader: React.FC<MemberHeaderProps> = ({ member, getStatusBadge }) => {
    const profile = member.profile;

    const profileMetrics = [
        profile?.goal && { label: "Hedef", value: goalLabels[profile.goal] || profile.goal },
        profile?.experienceLevel && { label: "Deneyim", value: experienceLevelLabels[profile.experienceLevel] || profile.experienceLevel },
        profile?.workoutDaysPerWeek && { label: "Haftalık Antrenman", value: `${profile.workoutDaysPerWeek} Gün / Hafta` },
        profile?.sessionDuration && { label: "Antrenman Süesi", value: `${profile.sessionDuration} Dakika` },
        profile?.equipmentAccess && { label: "Ekipman", value: equipmentAccessLabels[profile.equipmentAccess] || profile.equipmentAccess },
        profile?.activityLevel && { label: "Aktivite", value: activityLevelLabels[profile.activityLevel] || profile.activityLevel },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <div className="space-y-4">
            <div className="bg-nav-bg border border-nav-border rounded-2xl p-5 sm:p-6 shadow-nav backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        {member.avatarUrl ? (
                            <Image
                                src={member.avatarUrl}
                                alt={`${member.name} ${member.surname}`}
                                width={64}
                                height={64}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-nav-border shadow-sm flex-shrink-0"
                            />
                        ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-100 text-brand-dark flex items-center justify-center text-lg font-bold border border-nav-border shadow-sm flex-shrink-0">
                                {member.name?.[0]}{member.surname?.[0]}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                    {member.name} {member.surname}
                                </h1>
                                {getStatusBadge && getStatusBadge(member.assignmentStatus)}
                            </div>
                            <p className="text-xs sm:text-sm opacity-70 mt-0.5">{member.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center sm:items-end gap-2 sm:flex-col">
                        {member.gym?.name && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold tracking-wide shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {member.gym.name}
                            </div>
                        )}
                        {member.createdAt && (
                            <div className="text-xs opacity-60 bg-background px-2.5 py-1 rounded-lg border border-nav-border">
                                Kayıt: {new Date(member.createdAt).toLocaleDateString("tr-TR")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {profileMetrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {profileMetrics.map((item, index) => (
                        <div key={index} className="bg-nav-bg border border-nav-border rounded-xl p-3 shadow-sm flex flex-col justify-between">
                            <span className="text-[11px] opacity-60 font-medium">{item.label}</span>
                            <span className="text-xs sm:text-sm font-semibold mt-1">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {profile?.additionalNotes && (
                <div className="bg-nav-bg border border-nav-border rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] opacity-60 font-medium block mb-1">Ek Notlar</span>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                        {profile.additionalNotes}
                    </p>
                </div>
            )}
        </div>
    );
};
// ==========================================
// COMPLETE PROFILE STEP TWO VIEW
// ==========================================

'use client';

import React from 'react';
import { ArrowLeftIcon } from "@/icons/icon";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";

interface CompleteProfileStepTwoProps {
    formData: {
        goal: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
        experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
        workoutDaysPerWeek: string;
        sessionDuration: string;
        equipmentAccess: "GYM" | "HOME" | "BODYWEIGHT";
        activityLevel: "SEDENTARY" | "MODERATE" | "ACTIVE";
        injuries: string;
        additionalNotes: string;
    };
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onPrev: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CompleteProfileStepTwo({
    formData,
    loading,
    error,
    successMessage,
    onChange,
    onPrev,
    onSubmit,
}: CompleteProfileStepTwoProps) {
    return (
        <>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onPrev}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                >
                    <ArrowLeftIcon /> Önceki Adım
                </button>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-500/10 text-brand-500">
                    Adım 2 / 2
                </span>
            </div>

            <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md">
                <div className="mb-6 pb-4 border-b border-nav-border">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Yapay Zeka & Antrenman Tercihleri</h1>
                    <p className="text-sm opacity-70 mt-1">Hedeflerini belirle ki yapay zeka senin için kusursuz bir plan çıkarsın.</p>
                </div>

                <div className="mb-6 space-y-3">
                    <ErrorBox message={error} />
                    <SuccessBox message={successMessage} />
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-70">Ana Hedefin Nedir?</label>
                        <select
                            name="goal"
                            value={formData.goal}
                            onChange={onChange}
                            className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
                        >
                            <option value="MUSCLE_GAIN">Kas Kazanımı (Hipertrofi)</option>
                            <option value="FAT_LOSS">Yağ Yakımı & Kilo Verme</option>
                            <option value="STRENGTH">Kuvvet & Powerlifting</option>
                            <option value="GENERAL_FITNESS">Genel Fitness & Kondisyon</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium opacity-70">Deneyim Seviyesi</label>
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={onChange}
                                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
                            >
                                <option value="BEGINNER">Acemi (Yeni Başlayan)</option>
                                <option value="INTERMEDIATE">Orta Seviye</option>
                                <option value="ADVANCED">İleri Seviye</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium opacity-70">Çalışma Ortamı</label>
                            <select
                                name="equipmentAccess"
                                value={formData.equipmentAccess}
                                onChange={onChange}
                                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
                            >
                                <option value="GYM">Spor Salonu (Tam Ekipman)</option>
                                <option value="HOME">Ev (Kısıtlı Ekipman)</option>
                                <option value="BODYWEIGHT">Vücut Ağırlığı (Kalistenik)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium opacity-70">Haftada Kaç Gün?</label>
                            <input
                                type="number"
                                min="1"
                                max="7"
                                name="workoutDaysPerWeek"
                                value={formData.workoutDaysPerWeek}
                                onChange={onChange}
                                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium opacity-70">Seans Süresi (Dakika)</label>
                            <input
                                type="number"
                                step="15"
                                name="sessionDuration"
                                value={formData.sessionDuration}
                                onChange={onChange}
                                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-70">Günlük Yaşam Tarzı (Aktivite)</label>
                        <select
                            name="activityLevel"
                            value={formData.activityLevel}
                            onChange={onChange}
                            className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
                        >
                            <option value="SEDENTARY">Masa Başı / Hareketsiz</option>
                            <option value="MODERATE">Orta Hareketli</option>
                            <option value="ACTIVE">Çok Aktif / Ayakta Çalışan</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-70">Ekstra Notlar / Özel Durumlar</label>
                        <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={onChange}
                            rows={3}
                            placeholder="Yapay zekanın ve antrenörünün bilmesini istediğin özel durumlar..."
                            className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Kaydediliyor..." : "Profili Tamamla ve Başla"}
                    </button>
                </form>
            </div>
        </>
    );
}
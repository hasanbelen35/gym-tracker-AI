import React from 'react';
import { Member } from '@/types/types';
import { UpdateMemberProfileData } from '../types';
interface PhysicalStatsCardProps {
    
    profile: Partial<Member> | null | undefined;
    isEditing: boolean;
    formData: UpdateMemberProfileData;

    onChange: (field: keyof UpdateMemberProfileData, value: string | number | undefined) => void;
    onCancel: () => void;
    onSave: () => void;
    isSubmitting: boolean;
}

export const PhysicalStatsCard: React.FC<PhysicalStatsCardProps> = ({
    profile, isEditing, formData, onChange, onCancel, onSave, isSubmitting
}) => {
    return (
        <div className="md:col-span-2 bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3">Profil Detayları</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400 block mb-1">Yaş</span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={formData.age || ""}
                            onChange={(e) => onChange('age', e.target.value)}
                            className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold"
                        />
                    ) : (
                        <span className="text-lg font-bold text-brand-text">{profile?.age ?? "-"}</span>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400 block mb-1">Boy (cm)</span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={formData.height || ""}
                            onChange={(e) => onChange('height', e.target.value)}
                            className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold"
                        />
                    ) : (
                        <span className="text-lg font-bold text-brand-text">{profile?.height ?? "-"}</span>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400 block mb-1">Kilo (kg)</span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={formData.weight || ""}
                            onChange={(e) => onChange('weight', e.target.value)}
                            className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold"
                        />
                    ) : (
                        <span className="text-lg font-bold text-brand-text">{profile?.weight ?? "-"}</span>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400 block mb-1">Cinsiyet</span>
                    {isEditing ? (
                        <select
                            value={formData.gender || ""}
                            onChange={(e) => onChange('gender', e.target.value)}
                            className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold cursor-pointer"
                        >
                            <option value="">Seçiniz</option>
                            <option value="MALE">Erkek</option>
                            <option value="FEMALE">Kadın</option>
                        </select>
                    ) : (
                        <span className="text-lg font-bold text-brand-text">{profile?.gender ?? "-"}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Telefon Numarası</span>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.phone || ""}
                                onChange={(e) => onChange('phone', e.target.value)}
                                className="w-full bg-transparent focus:outline-none"
                                placeholder="5551234567"
                            />
                        ) : (
                            profile?.phone || "Belirtilmemiş"
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sağlık Notları</span>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text min-h-[50px]">
                        {isEditing ? (
                            <textarea
                                value={formData.medicalNotes || ""}
                                onChange={(e) => onChange('medicalNotes', e.target.value)}
                                rows={2}
                                className="w-full bg-transparent focus:outline-none resize-none"
                                placeholder="Sağlık notlarınızı buraya ekleyebilirsiniz."
                            />
                        ) : (
                            profile?.medicalNotes || "Herhangi bir sağlık notu bulunmuyor."
                        )}
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-nav-border">
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-lg cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        İptal Et
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-lg cursor-pointer text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            )}
        </div>
    );
};
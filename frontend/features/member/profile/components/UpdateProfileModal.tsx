import React, { useState } from 'react';
import { Member } from '@/types/types';
import { UpdateMemberProfileData } from '../types';

interface UpdateProfileModalProps {
    onClose: () => void;
    profile: Partial<Member> | null | undefined;
    onSubmit: (data: UpdateMemberProfileData) => void;
    isLoading: boolean;
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ onClose, profile, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<UpdateMemberProfileData>({
        name: profile?.name || '',
        surname: profile?.surname || '',
        phone: profile?.phone || '',
        gender: profile?.gender === 'MALE' || profile?.gender === 'FEMALE' ? profile.gender : undefined,
        age: profile?.age || undefined,
        height: profile?.height || undefined,
        weight: profile?.weight || undefined,
        medicalNotes: profile?.medicalNotes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' || name === 'height' || name === 'weight' ? (value ? Number(value) : undefined) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                <div className="flex justify-between items-center p-5 border-b border-nav-border">
                    <h2 className="text-lg font-bold text-brand-text">Profili Düzenle</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <form id="update-profile-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Ad</label>
                                <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Soyad</label>
                                <input required type="text" name="surname" value={formData.surname || ''} onChange={handleChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Telefon</label>
                            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="5551234567" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Yaş</label>
                                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Boy (cm)</label>
                                <input type="number" name="height" value={formData.height || ''} onChange={handleChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Kilo (kg)</label>
                                <input type="number" name="weight" value={formData.weight || ''} onChange={handleChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Cinsiyet</label>
                            <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500">
                                <option value="">Seçiniz</option>
                                <option value="MALE">Erkek</option>
                                <option value="FEMALE">Kadın</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Sağlık Notları</label>
                            <textarea name="medicalNotes" value={formData.medicalNotes || ''} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-nav-border rounded-xl text-sm text-brand-text outline-none focus:border-brand-500 resize-none"></textarea>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-nav-border bg-slate-50/50 dark:bg-slate-800/20 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        İptal
                    </button>
                    <button type="submit" form="update-profile-form" disabled={isLoading} className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};
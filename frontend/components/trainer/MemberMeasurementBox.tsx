'use client'
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { addMemberMeasurement, deleteMemberMeasurement, fetchMemberMeasurements } from "@/store/slices/trainerSlice";
import { CreateMeasurementPayload, MemberMeasurement } from "@/types/types";
import { IconArrowRight, IconTrash } from '@/icons/icon';
import { useAuth } from "@/hooks/useAuth";
import ConfirmModal from '@/components/ConfirmModel';

interface MemberMeasurementsSectionProps {
    memberPublicId: string;
    measurements: MemberMeasurement[];
    onMeasurementAdded: () => void;
}

const MEASUREMENT_CONFIG = [
    { key: 'bodyFatRate', label: 'Yağ Oranı', unit: '%', type: 'number' },
    { key: 'muscleMass', label: 'Kas Kütlesi', unit: 'kg', type: 'number' },
    { key: 'chest', label: 'Göğüs', unit: 'cm', type: 'number' },
    { key: 'waist', label: 'Bel', unit: 'cm', type: 'number' },
    { key: 'arm', label: 'Kol', unit: 'cm', type: 'number' },
    { key: 'hip', label: 'Kalça', unit: 'cm', type: 'number' },
    { key: 'shoulder', label: 'Omuz', unit: 'cm', colSpan: true, type: 'number' },
    { key: 'photos', label: 'Fotoğraf URL (Virgülle ayırın)', unit: '', colSpan: true, type: 'text' },
];

const INITIAL_FORM_STATE: CreateMeasurementPayload = {
    bodyFatRate: 0,
    muscleMass: 0,
    chest: 0,
    waist: 0,
    arm: 0,
    hip: 0,
    shoulder: 0,
    photos: [],
    notes: "",
};

export const MemberMeasurementsSection: React.FC<MemberMeasurementsSectionProps> = ({
    memberPublicId,
    measurements = [],
    onMeasurementAdded,
}) => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState<CreateMeasurementPayload>(INITIAL_FORM_STATE);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (memberPublicId) {
            dispatch(fetchMemberMeasurements(memberPublicId));
        }
    }, [dispatch, memberPublicId]);

    const safeMeasurements = Array.isArray(measurements) ? measurements : [];
    const selectedMeasurement = safeMeasurements.find(m => m.id === selectedId) || safeMeasurements[0] || null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (name === 'photos') {
                return {
                    ...prev,
                    photos: value ? value.split(',').map(item => item.trim()).filter(Boolean) : []
                };
            }
            return {
                ...prev,
                [name]: name === 'notes' ? value : (value === "" ? 0 : Number(value))
            };
        });
    };

    const handleAddMeasurementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberPublicId) return;

        setFormLoading(true);
        try {
            const resultAction = await dispatch(addMemberMeasurement({
                memberPublicId,
                measurementData: formData
            }));

            if (addMemberMeasurement.fulfilled.match(resultAction)) {
                setIsAddModalOpen(false);
                setFormData(INITIAL_FORM_STATE);
                onMeasurementAdded();
                dispatch(fetchMemberMeasurements(memberPublicId));
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedMeasurement) return;
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedMeasurement || !memberPublicId || !user?.id) return;

        const measurementPublicId = String(
            selectedMeasurement.publicId ?? selectedMeasurement.id
        );



        setDeleteLoading(true);
        try {
            const resultAction = await dispatch(deleteMemberMeasurement({
                trainerId: user.id,
                memberPublicId,
                measurementPublicId,
            }));

            if (deleteMemberMeasurement.fulfilled.match(resultAction)) {
                setIsDeleteModalOpen(false);
                setSelectedId(null);
                dispatch(fetchMemberMeasurements(memberPublicId));
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-100 text-brand-dark">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-6" /></svg>
                    </span>
                    <span>Vücut Ölçümleri Geçmişi</span>
                </h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                    <span>+ Yeni Ölçüm Ekle</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2 max-h-87.5 overflow-y-auto pr-1">
                    <p className="text-xs font-semibold opacity-50 px-1 uppercase tracking-wider mb-1">Ölçüm Tarihleri</p>
                    {safeMeasurements.length > 0 ? (
                        safeMeasurements.map((m, idx) => {
                            const isSelected = selectedMeasurement?.id === m.id;
                            const displayDate = formatDate(m.measuredAt || m.createdAt);

                            return (
                                <div
                                    key={m.id || idx}
                                    onClick={() => m.id !== undefined && setSelectedId(m.id)}
                                    className={`p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${isSelected
                                        ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-sm'
                                        : 'bg-background border-nav-border hover:border-brand-500/40 text-foreground/80'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-500' : 'bg-nav-border'}`} />
                                        <span>{displayDate !== "-" ? displayDate : `Ölçüm #${safeMeasurements.length - idx}`}</span>
                                    </div>
                                    <IconArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'opacity-150 translate-x-0.5' : 'opacity-40'}`} />
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center bg-background border border-nav-border rounded-xl opacity-60 flex flex-col items-center justify-center space-y-2">
                            <p className="text-xs">Henüz kayıtlı ölçüm bulunmuyor.</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="text-xs text-brand-500 font-bold underline cursor-pointer"
                            >
                                İlk ölçümü hemen ekle
                            </button>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2 bg-background border border-nav-border rounded-2xl p-5 flex flex-col justify-between">
                    {selectedMeasurement ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-nav-border">
                                <span className="text-xs font-semibold opacity-60">
                                    Ölçüm Tarihi: {formatDate(selectedMeasurement.measuredAt || selectedMeasurement.createdAt)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                                        Detay Görünümü
                                    </span>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer"
                                        title="Ölçümü Sil"
                                    >
                                        <IconTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {MEASUREMENT_CONFIG.filter(field => field.key !== 'photos').map((field) => {
                                    const val = selectedMeasurement[field.key as keyof MemberMeasurement];
                                    const formattedVal = val != null ? (field.unit === '%' ? `%${val}` : `${val} ${field.unit}`) : "-";

                                    return (
                                        <div key={field.key} className={`p-3 rounded-xl bg-nav-bg border border-nav-border ${field.colSpan ? 'col-span-2 sm:col-span-3' : ''}`}>
                                            <p className="text-[11px] opacity-60 font-medium">{field.label}</p>
                                            <p className="text-base font-bold mt-0.5">{formattedVal}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {selectedMeasurement.photos && selectedMeasurement.photos.length > 0 && (
                                <div className="p-3 rounded-xl bg-nav-bg border border-nav-border">
                                    <p className="text-[11px] opacity-60 font-medium mb-2">Ölçüm Fotoğrafları</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedMeasurement.photos.map((photoUrl, pIdx) => (
                                            <a key={pIdx} href={photoUrl} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 rounded-lg overflow-hidden border border-nav-border hover:opacity-80 transition-opacity">
                                                <img src={photoUrl} alt="Ölçüm" className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedMeasurement.notes && (
                                <div className="p-3 rounded-xl bg-nav-bg border border-nav-border">
                                    <p className="text-[11px] opacity-60 font-medium mb-1">Notlar</p>
                                    <p className="text-xs opacity-90">{selectedMeasurement.notes}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                            <p className="text-sm">Görüntülemek için soldan bir ölçüm tarihi seçin.</p>
                        </div>
                    )}
                </div>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-nav-bg border border-nav-border rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-nav-border mb-4">
                            <h3 className="text-lg font-bold">Yeni Vücut Ölçümü Ekle</h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-8 h-8 rounded-xl bg-background border border-nav-border flex items-center justify-center text-sm font-bold hover:border-brand-500 transition-all cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddMeasurementSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {MEASUREMENT_CONFIG.map((field) => {
                                    if (field.key === 'photos') {
                                        return (
                                            <div key={field.key} className="col-span-2">
                                                <label className="block text-xs font-medium opacity-70 mb-1">{field.label}</label>
                                                <input
                                                    type="text"
                                                    name={field.key}
                                                    value={Array.isArray(formData.photos) ? formData.photos.join(', ') : ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 rounded-xl bg-background border border-nav-border text-sm focus:outline-none focus:border-brand-500"
                                                    placeholder="https://image1.jpg, https://image2.jpg"
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={field.key} className={field.colSpan ? 'col-span-2' : ''}>
                                            <label className="block text-xs font-medium opacity-70 mb-1">{field.label} {field.unit && `(${field.unit})`}</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                name={field.key}
                                                value={Number(formData[field.key as keyof CreateMeasurementPayload] ?? 0)}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 rounded-xl bg-background border border-nav-border text-sm focus:outline-none focus:border-brand-500"
                                                placeholder="0.0"
                                            />
                                        </div>
                                    );
                                })}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium opacity-70 mb-1">Notlar</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes || ""}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-xl bg-background border border-nav-border text-sm focus:outline-none focus:border-brand-500 resize-none"
                                        placeholder="Ölçümle ilgili notlar ekleyin..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-nav-border">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-background border border-nav-border text-xs font-semibold hover:border-brand-500 transition-all cursor-pointer"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-5 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {formLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    <span>Kaydet</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Ölçümü Sil"
                message="Bu ölçüm kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                loading={deleteLoading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};
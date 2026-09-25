'use client'

import React from "react";
import ConfirmModal from '@/components/ConfirmModel';
import { useMeasurementManager } from "./hooks/UseMeasurementManager";
import { MeasurementItem } from "./components/MeasurementItem";
import { MeasurementDetail } from "./components/MeasurementDetail";
import { MeasurementAddModal } from "./components/MeasurementAddModal";

interface MemberMeasurementsSectionProps {
    memberPublicId: string;
}

export const MemberMeasurementsSection: React.FC<MemberMeasurementsSectionProps> = ({
    memberPublicId,
}) => {
    const {
        safeMeasurements,
        measurementsLoading,
        selectedMeasurement,
        selectedId,
        setSelectedId,
        isAddModalOpen,
        setIsAddModalOpen,
        formLoading,
        formData,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteLoading,
        handleInputChange,
        handleAddMeasurementSubmit,
        handleDeleteConfirm,
        formatDate,
    } = useMeasurementManager(memberPublicId);

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-100 text-brand-dark">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20V10M18 20V4M6 20v-6" />
                        </svg>
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

            {measurementsLoading && safeMeasurements.length === 0 ? (
                <div className="flex items-center justify-center py-10 gap-3">
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs opacity-60">Ölçümler yükleniyor...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sol Liste */}
                    <div className="flex flex-col space-y-2 max-h-87.5 overflow-y-auto pr-1">
                        <p className="text-xs font-semibold opacity-50 px-1 uppercase tracking-wider mb-1">
                            Ölçüm Tarihleri
                        </p>

                        {safeMeasurements.length > 0 ? (
                            safeMeasurements.map((m, idx) => {
                                const isSelected = selectedMeasurement?.id === m.id;
                                const displayDate = formatDate(m.measuredAt || m.createdAt);

                                return (
                                    <MeasurementItem
                                        key={m.id || idx}
                                        measurement={m}
                                        isSelected={isSelected}
                                        displayDate={displayDate}
                                        index={idx}
                                        totalCount={safeMeasurements.length}
                                        onSelect={() => m.id !== undefined && setSelectedId(m.id)}
                                    />
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

                    {/* Sağ Detay Alanı */}
                    <div className="md:col-span-2 bg-background border border-nav-border rounded-2xl p-5 flex flex-col justify-between">
                        <MeasurementDetail
                            selectedMeasurement={selectedMeasurement}
                            formatDate={formatDate}
                            onDeleteClick={() => {
                                if (selectedMeasurement) setIsDeleteModalOpen(true);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Yeni Ekleme Modalı */}
            <MeasurementAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                formData={formData}
                formLoading={formLoading}
                onInputChange={handleInputChange}
                onSubmit={handleAddMeasurementSubmit}
            />

            {/* Silme Onay Modalı */}
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
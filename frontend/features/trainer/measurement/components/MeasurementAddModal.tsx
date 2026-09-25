import React from "react";
import { MEASUREMENT_CONFIG } from "../constants/measurement.config";
import { CreateMeasurementPayload } from "@/types/types";

interface MeasurementAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: CreateMeasurementPayload;
    formLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const MeasurementAddModal: React.FC<MeasurementAddModalProps> = ({
    isOpen,
    onClose,
    formData,
    formLoading,
    onInputChange,
    onSubmit,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-nav-bg border border-nav-border rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-nav-border mb-4">
                    <h3 className="text-lg font-bold">Yeni Vücut Ölçümü Ekle</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-background border border-nav-border flex items-center justify-center text-sm font-bold hover:border-brand-500 transition-all cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {MEASUREMENT_CONFIG.map((field) => {
                            if (field.key === 'photos') {
                                return (
                                    <div key={field.key} className="col-span-2">
                                        <label className="block text-xs font-medium opacity-70 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            name={field.key}
                                            value={Array.isArray(formData.photos) ? formData.photos.join(', ') : ""}
                                            onChange={onInputChange}
                                            className="w-full px-3 py-2 rounded-xl bg-background border border-nav-border text-sm focus:outline-none focus:border-brand-500"
                                            placeholder="https://image1.jpg, https://image2.jpg"
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div key={field.key} className={field.colSpan ? 'col-span-2' : ''}>
                                    <label className="block text-xs font-medium opacity-70 mb-1">
                                        {field.label} {field.unit && `(${field.unit})`}
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.1"
                                        name={field.key}
                                        value={Number(formData[field.key as keyof CreateMeasurementPayload] ?? 0)}
                                        onChange={onInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                e.preventDefault();
                                            }
                                        }}
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
                                onChange={onInputChange}
                                rows={2}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-nav-border text-sm focus:outline-none focus:border-brand-500 resize-none"
                                placeholder="Ölçümle ilgili notlar ekleyin..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-nav-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-background border border-nav-border text-xs font-semibold hover:border-brand-500 transition-all cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="px-5 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {formLoading && (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            <span>Kaydet</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import React from "react";
import Image from "next/image";
import { IconTrash } from "@/icons/icon";
import { MEASUREMENT_CONFIG } from "../constants/measurement.config";
import { MemberMeasurement } from "@/types/types";

interface MeasurementDetailProps {
    selectedMeasurement: MemberMeasurement | null;
    formatDate: (date?: string) => string;
    onDeleteClick: () => void;
}

export const MeasurementDetail: React.FC<MeasurementDetailProps> = ({
    selectedMeasurement,
    formatDate,
    onDeleteClick,
}) => {
    if (!selectedMeasurement) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                <p className="text-sm">Görüntülemek için soldan bir ölçüm tarihi seçin.</p>
            </div>
        );
    }

    return (
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
                        onClick={onDeleteClick}
                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer"
                        title="Ölçümü Sil"
                    >
                        <IconTrash className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MEASUREMENT_CONFIG.filter((field) => field.key !== 'photos').map((field) => {
                    const val = selectedMeasurement[field.key as keyof MemberMeasurement];
                    const formattedVal = val != null
                        ? (field.unit === '%' ? `%${val}` : `${val} ${field.unit}`)
                        : "-";

                    return (
                        <div
                            key={field.key}
                            className={`p-3 rounded-xl bg-nav-bg border border-nav-border ${
                                field.colSpan ? 'col-span-2 sm:col-span-3' : ''
                            }`}
                        >
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
                            <a
                                key={pIdx}
                                href={photoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-16 h-16 rounded-lg overflow-hidden border border-nav-border hover:opacity-80 transition-opacity relative"
                            >
                                <Image
                                    src={photoUrl}
                                    alt="Ölçüm"
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
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
    );
};
'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PaginationInfo } from "@/store/slices/gymSlice";

interface MeasurementItem {
    bodyFatRate?: number | null;
    muscleMass?: number | null;
    chest?: number | null;
    waist?: number | null;
    arm?: number | null;
    hip?: number | null;
    shoulder?: number | null;
    photos?: string[] | Record<string, string> | null;
    notes?: string | null;
    measuredAt?: string;
    createdAt?: string;
}

interface MemberMeasurementsCardProps {
    measurements?: MeasurementItem[];
    pagination?: PaginationInfo | null;
    loading?: boolean;
    onAddNewClick?: () => void;
    onPageChange?: (page: number) => void;
}

export const MemberMeasurementsCard: React.FC<MemberMeasurementsCardProps> = ({
    measurements = [],
    pagination,
    loading = false,
    onAddNewClick,
    onPageChange,
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const activeMeasurement = measurements[selectedIndex] || measurements[0];
    const hasMore = !!pagination && pagination.page < pagination.totalPages;

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el || !hasMore || loading || !onPageChange || !pagination) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                onPageChange(pagination.page + 1);
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, loading, pagination, onPageChange]);

    return (
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-nav flex flex-col relative">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-nav-border">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </span>
                    <span>Vücut Ölçümleri & Analiz</span>
                </h2>
                {onAddNewClick && (
                    <button
                        onClick={onAddNewClick}
                        className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:opacity-95 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                        <span>+ Yeni Ölçüm</span>
                    </button>
                )}
            </div>

            {loading && measurements.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-xs animate-pulse">
                    Ölçümler yükleniyor...
                </div>
            ) : measurements.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Sol Liste (Tarihler) */}
                        <div className="md:col-span-4 flex flex-col gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Ölçüm Tarihleri</p>
                            {measurements.map((item, index) => {
                                const isSelected = selectedIndex === index;
                                const dateStr = item.measuredAt || item.createdAt;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedIndex(index)}
                                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                            isSelected
                                                ? "bg-brand-500/10 border-brand-500 text-white shadow-sm"
                                                : "bg-background border-nav-border text-gray-400 hover:text-white hover:border-gray-600"
                                        }`}
                                    >
                                        <div>
                                            <p className="text-xs font-semibold">
                                                {dateStr
                                                    ? new Date(dateStr).toLocaleDateString('tr-TR', {
                                                          day: '2-digit',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      })
                                                    : `Ölçüm #${index + 1}`}
                                            </p>
                                            <span className="text-[10px] opacity-60">
                                                {dateStr ? new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-brand-500 animate-pulse" : "bg-transparent"}`} />
                                    </button>
                                );
                            })}

                            {hasMore && <div ref={loadMoreRef} className="h-4 flex-none" />}

                        
                        </div>

                        {/* Sağ Detay Alanı */}
                        <div className="md:col-span-8 bg-background border border-nav-border rounded-2xl p-5 flex flex-col justify-between space-y-6">
                            {activeMeasurement ? (
                                <>
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Ölçüm Değerleri</h3>
                                            <span className="text-xs text-gray-400">
                                                {activeMeasurement.measuredAt
                                                    ? new Date(activeMeasurement.measuredAt).toLocaleDateString('tr-TR')
                                                    : ''}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Yağ Oranı</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.bodyFatRate !== null && activeMeasurement.bodyFatRate !== undefined ? `%${activeMeasurement.bodyFatRate}` : "-"}
                                                </p>
                                            </div>

                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Kas Kütlesi</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.muscleMass !== null && activeMeasurement.muscleMass !== undefined ? `${activeMeasurement.muscleMass} kg` : "-"}
                                                </p>
                                            </div>

                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Göğüs</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.chest !== null && activeMeasurement.chest !== undefined ? `${activeMeasurement.chest} cm` : "-"}
                                                </p>
                                            </div>

                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Bel</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.waist !== null && activeMeasurement.waist !== undefined ? `${activeMeasurement.waist} cm` : "-"}
                                                </p>
                                            </div>

                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Kol</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.arm !== null && activeMeasurement.arm !== undefined ? `${activeMeasurement.arm} cm` : "-"}
                                                </p>
                                            </div>

                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Kalça</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.hip !== null && activeMeasurement.hip !== undefined ? `${activeMeasurement.hip} cm` : "-"}
                                                </p>
                                            </div>

                                            <div className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                <p className="text-[11px] text-gray-400 font-medium">Omuz</p>
                                                <p className="text-base font-bold text-white mt-0.5">
                                                    {activeMeasurement.shoulder !== null && activeMeasurement.shoulder !== undefined ? `${activeMeasurement.shoulder} cm` : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-nav-border">
                                        {activeMeasurement.notes && (
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Eğitmen Notu</p>
                                                <p className="text-xs text-gray-300 bg-nav-bg p-3 rounded-xl border border-nav-border leading-relaxed">
                                                    {activeMeasurement.notes}
                                                </p>
                                            </div>
                                        )}

                                        {activeMeasurement.photos && (
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Ölçüm Fotoğrafları</p>
                                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                                    {Array.isArray(activeMeasurement.photos) ? (
                                                        activeMeasurement.photos.map((photoUrl: string, pIdx: number) => (
                                                            <div key={pIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-nav-border flex-none bg-nav-bg">
                                                                <Image src={photoUrl} alt="Ölçüm Fotoğrafı" fill className="object-cover" />
                                                            </div>
                                                        ))
                                                    ) : typeof activeMeasurement.photos === 'object' && activeMeasurement.photos !== null ? (
                                                        Object.values(activeMeasurement.photos).map((photoUrl: unknown, pIdx: number) => (
                                                            typeof photoUrl === 'string' && (
                                                                <div key={pIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-nav-border flex-none bg-nav-bg">
                                                                    <Image src={photoUrl} alt="Ölçüm Fotoğrafı" fill className="object-cover" />
                                                                </div>
                                                            )
                                                        ))
                                                    ) : null}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
                    <p className="text-sm">Henüz kayıtlı vücut ölçümü bulunmuyor.</p>
                </div>
            )}
        </div>
    );
};
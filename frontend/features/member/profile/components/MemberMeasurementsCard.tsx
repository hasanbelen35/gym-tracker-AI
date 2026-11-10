'use client';

import React, { useEffect, useRef, useState } from "react";
import { MemberMeasurementsCardProps } from '@/features/member/profile/types'


const formatValue = (value: number | null | undefined, unit: string) =>
    value !== null && value !== undefined ? `${value}${unit}` : "-";

export const MemberMeasurementsCard: React.FC<MemberMeasurementsCardProps> = ({
    measurements = [],
    pagination,
    loading = false,
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

    const valueItems = activeMeasurement
        ? [
            { label: "Yağ Oranı", value: activeMeasurement.bodyFatRate !== null && activeMeasurement.bodyFatRate !== undefined ? `%${activeMeasurement.bodyFatRate}` : "-" },
            { label: "Kas Kütlesi", value: formatValue(activeMeasurement.muscleMass, " kg") },
            { label: "Göğüs", value: formatValue(activeMeasurement.chest, " cm") },
            { label: "Bel", value: formatValue(activeMeasurement.waist, " cm") },
            { label: "Kol", value: formatValue(activeMeasurement.arm, " cm") },
            { label: "Kalça", value: formatValue(activeMeasurement.hip, " cm") },
            { label: "Omuz", value: formatValue(activeMeasurement.shoulder, " cm") },
        ]
        : [];

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
                    <span>Vücut Ölçümlerim & Analiz</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    {pagination ? pagination.total : measurements.length}
                </span>
            </div>

            {loading && measurements.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-xs animate-pulse">
                    Ölçümler yükleniyor...
                </div>
            ) : measurements.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* DATE LIST */}
                        <div className="md:col-span-4 flex flex-col gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Ölçüm Tarihleri</p>
                            {measurements.map((item, index) => {
                                const isSelected = selectedIndex === index;
                                const dateStr = item.measuredAt || item.createdAt;
                                return (
                                    <button
                                        key={item.id || index}
                                        onClick={() => setSelectedIndex(index)}
                                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
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

                        {/* DETAIL AREA */}
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
                                            {valueItems.map((item) => (
                                                <div key={item.label} className="bg-nav-bg p-3 rounded-xl border border-nav-border">
                                                    <p className="text-[11px] text-gray-400 font-medium">{item.label}</p>
                                                    <p className="text-base font-bold text-white mt-0.5">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {activeMeasurement.notes && (
                                        <div className="space-y-4 pt-4 border-t border-nav-border">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Eğitmen Notu</p>
                                                <p className="text-xs text-gray-300 bg-nav-bg p-3 rounded-xl border border-nav-border leading-relaxed">
                                                    {activeMeasurement.notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
                    <p className="text-sm">Henüz kayıtlı vücut ölçümünüz bulunmuyor.</p>
                </div>
            )}
        </div>
    );
};
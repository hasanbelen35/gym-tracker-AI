"use client";
import React from 'react';

interface StartWorkoutCardProps {
    onStart: () => void;
    loading: boolean;
}

export const StartWorkoutCard: React.FC<StartWorkoutCardProps> = ({ onStart, loading }) => {
    return (
        <div className="bg-nav-bg border border-nav-border rounded-3xl p-8 text-center space-y-6 shadow-sm">
            <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-black text-foreground">Bugünkü Antrenmanına Başla</h3>
                <p className="text-sm text-foreground/60">
                    Aktif programındaki bugüne ait antrenmanı başlatarak setlerini lokal olarak loglamaya başlayabilirsin.
                </p>
            </div>
            <button
                onClick={onStart}
                disabled={loading}
                className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50"
            >
                {loading ? "Oturum Başlatılıyor..." : "Antrenmana Başla 🚀"}
            </button>
        </div>
    );
};
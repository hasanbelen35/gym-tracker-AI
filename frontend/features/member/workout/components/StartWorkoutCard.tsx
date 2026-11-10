"use client";
import React from 'react';
import { ErrorBox } from "@/components/ui/ErrorBox";

interface StartWorkoutCardProps {
    onStart: (workoutDayId?: number) => void;
    loading: boolean;
    error?: string | null;
}

export const StartWorkoutCard: React.FC<StartWorkoutCardProps> = ({ onStart, loading, error }) => {
    const isAlreadyCompletedToday = error?.includes("bugün zaten tamamladınız") || error?.includes("zaten tamamladınız");

    return (
        <div className="relative overflow-hidden bg-nav-bg border border-brand-400/30 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl">
            
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            {error && (
                <div className="max-w-md mx-auto">
                    <ErrorBox message={error} />
                </div>
            )}

            <div className="relative max-w-lg mx-auto space-y-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    isAlreadyCompletedToday 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-400/20'
                }`}>
                    {isAlreadyCompletedToday ? "Bugün Antrenman Yapıldı ✅" : "Günün Antrenmanı Hazır"}
                </span>

                <h3 className="text-3xl font-black text-foreground tracking-tight">
                    {isAlreadyCompletedToday ? "Harika Bir İş Çıkardın!" : "Sınırlarını Zorlamaya Hazır Mısın?"}
                </h3>

                <p className="text-sm text-foreground/60 leading-relaxed">
                    {isAlreadyCompletedToday 
                        ? "Bugünkü antrenman programını zaten tamamladın. Kaslarının toparlanması için dinlenebilir veya sonraki antrenman gününü bekleyebilirsin."
                        : "Bugünkü aktif programını başlatarak setlerini, ağırlıklarını ve RIR değerlerini anlık olarak kaydetmeye başla."
                    }
                </p>
            </div>

            <div className="relative pt-2">
                <button
                    onClick={() => onStart()}
                    disabled={loading || isAlreadyCompletedToday}
                    className="group relative inline-flex items-center gap-3 px-8.5 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-brand-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
                >
                    <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span>
                        {loading 
                            ? "Oturum Başlatılıyor..." 
                            : isAlreadyCompletedToday 
                            ? "Bugün Tamamlandı" 
                            : "Antrenmana Hemen Başla"
                        }
                    </span>
                    <span className="text-lg transition-transform group-hover:translate-x-1">
                        {isAlreadyCompletedToday ? "✅" : "⚡"}
                    </span>
                </button>
            </div>
        </div>
    );
};
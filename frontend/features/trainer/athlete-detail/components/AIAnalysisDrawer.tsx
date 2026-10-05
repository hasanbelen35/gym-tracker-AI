'use client'
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { clearAIAnalysis, clearAIError } from "@/store/slices/aiSlice";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";
import { RobotIcon } from "@/icons/icon";

interface AIAnalysisDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AIAnalysisDrawer: React.FC<AIAnalysisDrawerProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { analysisResult, loading, error } = useAppSelector((state) => state.ai);

    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(clearAIAnalysis());
        dispatch(clearAIError());
        onClose();
    };

    const renderAnalysisContent = (result: unknown): string => {
        if (!result) return "Analiz verisi bulunamadı.";

        if (typeof result === "string") {
            return result;
        }

        if (typeof result === "object" && result !== null) {
            if ("analysis" in result && typeof (result as { analysis: unknown }).analysis === "string") {
                return (result as { analysis: string }).analysis;
            }
            return JSON.stringify(result, null, 2);
        }

        return String(result);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full sm:w-1/2 h-full bg-nav-bg border-l border-nav-border shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto transition-all">

                <div className="flex items-center justify-between pb-6 border-b border-nav-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
                            <RobotIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Yapay Zeka Performans Analizi</h2>
                            <p className="text-xs text-foreground/60">Sporcunun verileri ve programı yapay zeka tarafından inceleniyor.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="px-3 py-1.5 rounded-xl bg-nav-bg border border-nav-border text-sm font-semibold hover:bg-foreground/5 transition-all cursor-pointer text-foreground"
                    >
                        ✕ Kapat
                    </button>
                </div>

                <div className="flex-1 py-6 flex flex-col justify-center gap-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center gap-3 py-20">
                            <div className="w-10 h-10 rounded-full border-4 border-foreground/10 border-t-brand-500 animate-spin" />
                            <p className="text-xs text-foreground/60 animate-pulse">Yapay zeka analiz raporu oluşturuluyor...</p>
                        </div>
                    )}

                    {!loading && <ErrorBox message={error} />}

                    <SuccessBox message={!loading && !error && analysisResult ? "Yapay zeka analizi başarıyla tamamlandı." : null} />

                    {!loading && !error && analysisResult && (
                        <div className="prose prose-invert max-w-none text-foreground/95 space-y-4 text-sm leading-relaxed whitespace-pre-line bg-foreground/5 p-6 rounded-2xl border border-nav-border">
                            {renderAnalysisContent(analysisResult)}
                        </div>
                    )}

                    {!loading && !error && !analysisResult && (
                        <div className="text-center text-foreground/50 text-sm py-20">
                            Analiz verisi bulunamadı.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
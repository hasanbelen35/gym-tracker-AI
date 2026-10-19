"use client";

import React, { useState } from "react";
import { SetLog } from "@/store/slices/member.workoutLog.slice";

interface EditSetModalProps {
    isOpen: boolean;
    set: SetLog | null;
    exerciseName: string;
    onClose: () => void;
    onSave: (
        actualReps: number,
        actualWeight: number,
        actualRir: number
    ) => void;
}

export const EditSetModal: React.FC<EditSetModalProps> = ({
    isOpen,
    set,
    exerciseName,
    onClose,
    onSave,
}) => {
    const [reps, setReps] = useState(() =>
        String(set?.actualReps ?? set?.targetReps ?? 10)
    );

    const [weight, setWeight] = useState(() =>
        String(set?.actualWeight ?? set?.targetWeight ?? 0)
    );

    const [rir, setRir] = useState(() =>
        String(set?.actualRir ?? set?.targetRir ?? 2)
    );

    if (!isOpen || !set) {
        return null;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const actualReps = Number(reps);
        const actualWeight = Number(weight);
        const actualRir = Number(rir);

        if (
            reps.trim() === "" ||
            weight.trim() === "" ||
            rir.trim() === "" ||
            !Number.isInteger(actualReps) ||
            actualReps < 0 ||
            !Number.isFinite(actualWeight) ||
            actualWeight < 0 ||
            !Number.isInteger(actualRir) ||
            actualRir < 0 ||
            actualRir > 10
        ) {
            return;
        }

        onSave(actualReps, actualWeight, actualRir);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-nav-bg border border-nav-border rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-nav-border">
                    <div>
                        <span className="text-xs font-bold text-brand-text uppercase tracking-wider">
                            Set Düzenleme
                        </span>

                        <h3 className="text-xl font-black text-foreground capitalize mt-1">
                            {exerciseName} - Set {set.setNumber}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Modalı kapat"
                        className="w-9 h-9 rounded-full bg-background/85 hover:bg-background border border-nav-border flex items-center justify-center text-foreground font-bold transition"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="actual-reps"
                            className="block text-xs font-bold text-foreground/70 uppercase mb-1.5"
                        >
                            Gerçekleşen Tekrar (Reps)
                        </label>

                        <input
                            id="actual-reps"
                            type="number"
                            min="0"
                            step="1"
                            value={reps}
                            onChange={(event) =>
                                setReps(event.target.value)
                            }
                            required
                            className="w-full bg-background border border-nav-border rounded-2xl px-4 py-3 text-foreground font-semibold focus:outline-none focus:border-brand-500 transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="actual-weight"
                            className="block text-xs font-bold text-foreground/70 uppercase mb-1.5"
                        >
                            Gerçekleşen Ağırlık (kg)
                        </label>

                        <input
                            id="actual-weight"
                            type="number"
                            min="0"
                            step="0.5"
                            value={weight}
                            onChange={(event) =>
                                setWeight(event.target.value)
                            }
                            required
                            className="w-full bg-background border border-nav-border rounded-2xl px-4 py-3 text-foreground font-semibold focus:outline-none focus:border-brand-500 transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="actual-rir"
                            className="block text-xs font-bold text-foreground/70 uppercase mb-1.5"
                        >
                            Yedek Tekrar (RIR)
                        </label>

                        <input
                            id="actual-rir"
                            type="number"
                            min="0"
                            max="10"
                            step="1"
                            value={rir}
                            onChange={(event) =>
                                setRir(event.target.value)
                            }
                            required
                            className="w-full bg-background border border-nav-border rounded-2xl px-4 py-3 text-foreground font-semibold focus:outline-none focus:border-brand-500 transition"
                            placeholder="Örn: 1 veya 2"
                        />

                        <p className="text-[10px] text-foreground/50 mt-1">
                            Tükenişe kaç tekrar kala bıraktığını belirtir.
                            0 = Tam tükeniş.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 bg-background/80 hover:bg-background border border-nav-border text-foreground font-bold rounded-2xl transition"
                        >
                            İptal
                        </button>

                        <button
                            type="submit"
                            className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow transition"
                        >
                            Kaydet ve Güncelle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
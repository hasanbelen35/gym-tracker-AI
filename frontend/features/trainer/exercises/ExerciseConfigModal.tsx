'use client';

import React, { useState } from "react";
import { IconClose, IconPlus, IconTrash } from "@/icons/icon";
import { Exercise } from "@/store/slices/exerciseSlice";
import { ErrorBox } from "@/components/ui/ErrorBox";

export interface WorkoutSetInput {
    setNumber: number;
    targetReps?: number | null;
    targetWeight?: number | null;
    rir?: number | null;
}

interface ExerciseConfigModalProps {
    exercise: Exercise | null;
    sets: WorkoutSetInput[];
    notes: string;
    onClose: () => void;
    onAddSet: () => void;
    onRemoveSet: (index: number) => void;
    onSetChange: (index: number, field: keyof WorkoutSetInput, value: number | null) => void;
    onNotesChange: (value: string) => void;
    onSave: () => void;
}

const inputBaseClasses =
    "w-full rounded-md border border-nav-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25";

const RIR_MIN = 0;
const RIR_MAX = 10;

export const ExerciseConfigModal: React.FC<ExerciseConfigModalProps> = ({
    exercise,
    sets,
    notes,
    onClose,
    onAddSet,
    onRemoveSet,
    onSetChange,
    onNotesChange,
    onSave,
}) => {
    const [modalError, setModalError] = useState<string | null>(null);

    if (!exercise) return null;

    const handleSaveClick = () => {
        setModalError(null);

        if (!sets || sets.length === 0) {
            setModalError("Lütfen en az 1 set ekleyin.");
            return;
        }

        for (const [index, set] of sets.entries()) {
            if (set.targetReps === undefined || set.targetReps === null || set.targetReps <= 0) {
                setModalError(`Hata: ${index + 1}. setin tekrar sayısı boş veya 0 olamaz.`);
                return;
            }

            if (set.targetWeight === undefined || set.targetWeight === null) {
                setModalError(`Hata: ${index + 1}. setin ağırlık değeri boş bırakılamaz.`);
                return;
            }
        }
        onSave();
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-nav-border bg-nav-bg p-6 shadow-2xl cursor-default [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-nav-border bg-background text-foreground/70 hover:bg-brand-500 hover:text-white transition-colors cursor-pointer"
                >
                    <IconClose className="h-4 w-4" />
                </button>

                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-1 pr-8">
                    Set Yapılandırması
                </h3>
                <p className="text-xs text-foreground/60 mb-5 font-medium">
                    {exercise.name} için set detaylarını belirleyin.
                </p>

                {modalError && (
                    <div className="mb-4">
                        <ErrorBox message={modalError} />
                    </div>
                )}

                <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground/45 px-1">
                        <span className="col-span-2 text-center">Set</span>
                        <span className="col-span-3 text-center">Tekrar</span>
                        <span className="col-span-3 text-center">Ağırlık (kg)</span>
                        <span className="col-span-3 text-center">RIR</span>
                        <span className="col-span-1"></span>
                    </div>

                    {sets.map((set, index) => (
                        <div key={index} className="grid grid-cols-12 items-center gap-2 rounded-xl border border-nav-border bg-background p-2.5">
                            <div className="col-span-2 flex justify-center">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15 text-xs font-bold text-brand-500">
                                    {index + 1}
                                </span>
                            </div>

                            <div className="col-span-3">
                                <input
                                    type="number"
                                    min={1}
                                    step={1}
                                    placeholder="Tekrar"
                                    value={set.targetReps ?? ""}
                                    onChange={(e) => {
                                        setModalError(null);
                                        if (e.target.value === "") {
                                            onSetChange(index, "targetReps", null);
                                            return;
                                        }
                                        const value = Math.max(1, Number(e.target.value));
                                        onSetChange(index, "targetReps", value);
                                    }}
                                    className={inputBaseClasses + " text-center"}
                                />
                            </div>

                            <div className="col-span-3">
                                <input
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    placeholder="kg"
                                    value={set.targetWeight ?? ""}
                                    onChange={(e) => {
                                        setModalError(null);
                                        if (e.target.value === "") {
                                            onSetChange(index, "targetWeight", null);
                                            return;
                                        }
                                        const value = Math.max(0, Number(e.target.value));
                                        onSetChange(index, "targetWeight", value);
                                    }}
                                    className={inputBaseClasses + " text-center"}
                                />
                            </div>

                            <div className="col-span-3">
                                <input
                                    type="number"
                                    min={RIR_MIN}
                                    max={RIR_MAX}
                                    step={1}
                                    placeholder="RIR"
                                    value={set.rir ?? ""}
                                    onChange={(e) => {
                                        setModalError(null);
                                        if (e.target.value === "") {
                                            onSetChange(index, "rir", null);
                                            return;
                                        }
                                        const value = Math.min(RIR_MAX, Math.max(RIR_MIN, Number(e.target.value)));
                                        onSetChange(index, "rir", value);
                                    }}
                                    className={inputBaseClasses + " text-center"}
                                />
                            </div>

                            <div className="col-span-1 flex justify-center">
                                {sets.length > 1 && (
                                    <button
                                        onClick={() => {
                                            setModalError(null);
                                            onRemoveSet(index);
                                        }}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    >
                                        <IconTrash className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            setModalError(null);
                            onAddSet();
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-nav-border py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/70 hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
                    >
                        <IconPlus className="h-3.5 w-3.5" />
                        Yeni Set Ekle
                    </button>
                </div>

                <div className="mb-6">
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground/45 px-1">
                        Not (İsteğe Bağlı)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="Örn: Yavaş tempo, tam hareket açıklığı (ROM), dirsekleri sabit tutun..."
                        rows={3}
                        className={inputBaseClasses + " resize-none"}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-nav-border bg-background py-3 text-sm font-bold text-foreground/70 hover:bg-nav-border/50 transition-colors cursor-pointer"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSaveClick}
                        className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20 cursor-pointer"
                    >
                        Onayla ve Ekle
                    </button>
                </div>
            </div>
        </div>
    );
};
"use client";

import React, { useState } from "react";
import {
    WorkoutSession,
    SetLog,
    ExerciseLog,
} from "@/store/slices/member.workoutLog.slice";

import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { WorkoutSetRow } from "./WorkoutSetRow";
import { EditSetModal } from "./EditSetModal";
import { useWorkoutTimer } from "../hook/useWorkoutTimer";
import ConfirmModal from "@/components/ConfirmModel";
import { ErrorBox } from "@/components/ui/ErrorBox";

export interface ExerciseDetail {
    id: number;
    publicId: string;
    name: string;
    category?: string | null;
    bodyPart?: string | null;
    equipment?: string | null;
    targetMuscle?: string | null;
    instructions?: string | null;
    instruction_steps?: unknown;
    gifUrl?: string | null;
}

export interface WorkoutExerciseRelation {
    id: number;
    publicId: string;
    dayId: number;
    exerciseId: number;
    orderIndex: number;
    notes?: string | null;
    exercise: ExerciseDetail;
}

export interface SelectedExerciseState extends ExerciseLog {
    exerciseDetails?: ExerciseDetail;
}

interface EditingSetData {
    exerciseLogId: number;
    exerciseName: string;
    set: SetLog;
}

export type UpdateSetHandler = (
    exerciseLogId: number,
    setNumber: number,
    status: SetLog["status"],
    actualReps?: number,
    actualWeight?: number,
    actualRir?: number
) => void;

interface ActiveWorkoutViewProps {
    session: WorkoutSession;
    onUpdateSet: UpdateSetHandler;
    onFinishSession: (memberNote?: string) => void;
    actionLoading: boolean;
    errorMessage?: string | null;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
    session,
    onUpdateSet,
    onFinishSession,
    actionLoading,
    errorMessage,
}) => {
    const [selectedExercise, setSelectedExercise] = useState<SelectedExerciseState | null>(null);
    const [editingSetData, setEditingSetData] = useState<EditingSetData | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [showSuccessBox, setShowSuccessBox] = useState(false);
    const [memberNote, setMemberNote] = useState("");

    const [localSetUpdates, setLocalSetUpdates] = useState<Record<string, Partial<SetLog>>>({});

    const { formattedTime } = useWorkoutTimer(session.startedAt);

    const workoutExercises = (session.workoutDay?.exercises ?? []) as unknown as WorkoutExerciseRelation[];

    const handleUpdateSet: UpdateSetHandler = (
        exerciseLogId,
        setNumber,
        status,
        actualReps,
        actualWeight,
        actualRir
    ) => {
        const key = `${exerciseLogId}-${setNumber}`;

        setLocalSetUpdates((previous) => ({
            ...previous,
            [key]: {
                ...previous[key],
                status,
                actualReps,
                actualWeight,
                actualRir,
            },
        }));

        onUpdateSet(
            exerciseLogId,
            setNumber,
            status,
            actualReps,
            actualWeight,
            actualRir
        );
    };

    const handleSaveEditedSet = (
        actualReps: number,
        actualWeight: number,
        actualRir: number
    ) => {
        if (!editingSetData) return;

        handleUpdateSet(
            editingSetData.exerciseLogId,
            editingSetData.set.setNumber,
            "MODIFIED",
            actualReps,
            actualWeight,
            actualRir
        );

        setEditingSetData(null);
    };
    const handleFinishSession = () => {
        setIsConfirmModalOpen(false);
        setShowSuccessBox(true); 

        setTimeout(() => {
            onFinishSession(memberNote);
        }, 1500);
    };

    return (
        <div className="relative bg-nav-bg border border-brand-400/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">

            {showSuccessBox && (
                <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 text-3xl mb-4 animate-bounce">
                        🎉
                    </div>
                    <h3 className="text-2xl font-black text-foreground">Tebrikler Harika İş Çıkardın!</h3>
                    <p className="text-sm text-foreground/70 mt-1 max-w-sm">
                        Antrenman başarıyla tamamlandı ve verilerin kaydediliyor...
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        Kayıt İşlemi Tamamlanıyor
                    </div>
                </div>
            )}

            {errorMessage && <ErrorBox message={errorMessage} />}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-nav-border">
                <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                        ⚡ Devam Eden Aktif Oturum
                    </span>

                    <h3 className="text-2xl font-black text-foreground mt-2">
                        {session.workoutDay?.dayName || "Antrenman Günü"}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="px-3 py-1 bg-brand-500/10 border border-brand-400/20 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                            Süre: {formattedTime}
                        </span>

                        <span className="text-xs text-foreground/50">
                            Başlangıç:{" "}
                            {new Date(session.startedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsConfirmModalOpen(true)}
                    disabled={actionLoading || showSuccessBox}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                    Antrenmanı Bitir ve Kaydet
                </button>
            </div>

            {/* Antrenör İçin Not Alanı (Opsiyonel) */}
            <div className="bg-background/40 border border-nav-border rounded-2xl p-4 space-y-2">
                <label className="text-xs font-bold text-foreground/70 block">
                    Antrenman Notun (İsteğe Bağlı)
                </label>
                <input
                    type="text"
                    value={memberNote}
                    onChange={(e) => setMemberNote(e.target.value)}
                    placeholder="Örn: Omuzlarım bugün biraz yorgundu, 3. sette ağırlığı düşürdüm."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-background border border-nav-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-500 transition"
                />
            </div>

            <div className="space-y-6">
                {session.exerciseLogs.map((exLog: ExerciseLog) => {
                    const originalExerciseData = workoutExercises.find(
                        (exercise) =>
                            exercise.exercise.name.toLowerCase() ===
                            exLog.exerciseName.toLowerCase()
                    );

                    const exerciseDetails = originalExerciseData?.exercise;

                    return (
                        <div
                            key={exLog.id}
                            className="bg-background/50 border border-nav-border rounded-2xl p-5 space-y-4"
                        >
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedExercise({
                                            ...exLog,
                                            exerciseDetails,
                                        })
                                    }
                                    className="group flex cursor-pointer items-center gap-2 text-left hover:opacity-80 transition"
                                >
                                    <h4 className="font-bold text-lg text-foreground group-hover:text-brand-text transition">
                                        {exLog.exerciseName}
                                    </h4>

                                    <span className="text-xs bg-brand-500/10 text-brand-600 px-2 py-0.5 rounded-full font-semibold border border-brand-400/20">
                                        Rehber / GIF ℹ️
                                    </span>
                                </button>

                                {exLog.notes && (
                                    <span className="text-xs text-foreground/60 italic">
                                        {exLog.notes}
                                    </span>
                                )}
                            </div>

                            <div className="grid gap-2">
                                {exLog.setLogs.map((set: SetLog) => {
                                    const key = `${exLog.id}-${set.setNumber}`;

                                    const displayedSet: SetLog = {
                                        ...set,
                                        ...localSetUpdates[key],
                                    };

                                    return (
                                        <WorkoutSetRow
                                            key={set.setNumber}
                                            set={displayedSet}
                                            exerciseLogId={exLog.id}
                                            onUpdateSet={handleUpdateSet}
                                            onOpenEditModal={(targetSet) => {
                                                const targetKey = `${exLog.id}-${targetSet.setNumber}`;

                                                setEditingSetData({
                                                    exerciseLogId: exLog.id,
                                                    exerciseName: exLog.exerciseName,
                                                    set: {
                                                        ...targetSet,
                                                        ...localSetUpdates[targetKey],
                                                    },
                                                });
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <ExerciseDetailModal
                exercise={selectedExercise}
                onClose={() => setSelectedExercise(null)}
            />

            {editingSetData && (
                <EditSetModal
                    key={`${editingSetData.exerciseLogId}-${editingSetData.set.setNumber}`}
                    isOpen={true}
                    set={editingSetData.set}
                    exerciseName={editingSetData.exerciseName}
                    onClose={() => setEditingSetData(null)}
                    onSave={handleSaveEditedSet}
                />
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Antrenmanı Tamamla"
                message="Antrenmanı bitirmek istediğinden emin misin? Yaptığın tüm set logları kaydedilecektir."
                confirmText="Evet, Bitir ve Kaydet"
                cancelText="Vazgeç"
                loading={actionLoading}
                onConfirm={handleFinishSession}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
        </div>
    );
};
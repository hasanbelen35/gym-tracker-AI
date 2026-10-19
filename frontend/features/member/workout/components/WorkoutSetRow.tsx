"use client";

import React from "react";
import { SetLog } from "@/store/slices/member.workoutLog.slice";

type UpdateSetHandler = (
    exerciseLogId: number,
    setNumber: number,
    status: SetLog["status"],
    actualReps?: number,
    actualWeight?: number,
    actualRir?: number
) => void;

interface WorkoutSetRowProps {
    set: SetLog;
    exerciseLogId: number;
    onUpdateSet: UpdateSetHandler;
    onOpenEditModal: (set: SetLog) => void;
}

export const WorkoutSetRow: React.FC<WorkoutSetRowProps> = ({
    set,
    exerciseLogId,
    onUpdateSet,
    onOpenEditModal,
}) => {
    const isSkipped = set.status === "SKIPPED";
    const isModified = set.status === "MODIFIED";

    const hasActualValues =
        set.actualReps != null &&
        set.actualWeight != null &&
        set.actualRir != null;

    const isCompleted =
        set.status === "MATCHED" && hasActualValues;

    const containerStyle = isSkipped
        ? "border-red-500/50 bg-red-500/10"
        : isModified
          ? "border-amber-500/50 bg-amber-500/10"
          : isCompleted
            ? "border-emerald-500/50 bg-emerald-500/10"
            : "border-nav-border bg-nav-bg";

    const statusStyle = isSkipped
        ? "bg-red-500/15 text-red-500 border-red-500/30"
        : isModified
          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          : isCompleted
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            : "bg-gray-500/10 text-gray-500 border-gray-500/20";

    const statusLabel = isSkipped
        ? "Pas Geçildi"
        : isModified
          ? "Düzenlendi"
          : isCompleted
            ? "Tamamlandı"
            : "Bekliyor";

    const handleCompleteSet = () => {
        onUpdateSet(
            exerciseLogId,
            set.setNumber,
            "MATCHED",
            set.targetReps == null
                ? undefined
                : Number(set.targetReps),
            set.targetWeight ?? undefined,
            set.targetRir ?? undefined
        );
    };

    const handleSkipSet = () => {
        onUpdateSet(
            exerciseLogId,
            set.setNumber,
            "SKIPPED",
            0,
            0,
            0
        );
    };

    return (
        <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-xl gap-3 transition-colors duration-200 ${containerStyle}`}
        >
            <div className="flex items-start gap-4 min-w-0">
                <span className="font-bold text-sm text-brand-text pt-1">
                    Set {set.setNumber}
                </span>

                <div className="text-xs space-y-1.5 min-w-0">
                    <div className="text-foreground/60">
                        Hedef:{" "}
                        <b>{set.targetReps ?? "-"} tekrar</b>
                        {" · "}
                        <b>{set.targetWeight ?? "-"} kg</b>
                        {" · "}
                        RIR: <b>{set.targetRir ?? "-"}</b>
                    </div>

                    {isSkipped ? (
                        <div className="text-red-500 font-bold">
                            Bu set pas geçildi.
                        </div>
                    ) : isModified || isCompleted ? (
                        <div
                            className={`font-bold ${
                                isModified
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-emerald-600 dark:text-emerald-400"
                            }`}
                        >
                            Gerçekleşen: {set.actualReps ?? 0} tekrar
                            {" · "}
                            {set.actualWeight ?? 0} kg
                            {" · "}
                            RIR {set.actualRir ?? 0}
                        </div>
                    ) : (
                        <div className="text-foreground/50">
                            Henüz tamamlanmadı.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${statusStyle}`}
                >
                    {statusLabel}
                </span>

                <button
                    type="button"
                    onClick={handleCompleteSet}
                    className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                    ✓ Tamamla
                </button>

                <button
                    type="button"
                    onClick={() => onOpenEditModal(set)}
                    className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                    Düzenle
                </button>

                <button
                    type="button"
                    onClick={handleSkipSet}
                    className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                    Atla
                </button>
            </div>
        </div>
    );
};

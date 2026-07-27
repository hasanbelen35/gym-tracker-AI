'use client';

import React from "react";
import {
  Exercise,
  ProgramDayInput as BaseProgramDayInput,
  ProgramExerciseInput as BaseProgramExerciseInput,
  SetInput,
} from "@/store/slices/exerciseSlice";
import ExerciseComponent from "@/components/exercises/Exercises";
import { WorkoutSetInput } from "@/components/exercises/ExerciseConfigModal";

export interface ProgramExerciseInput extends BaseProgramExerciseInput {
  exerciseName?: string;
}

export interface ProgramDayInput extends Omit<BaseProgramDayInput, "exercises"> {
  exercises: ProgramExerciseInput[];
}

export type { SetInput };

interface ProgramDaysBuilderProps {
  days: ProgramDayInput[];
  setDays: React.Dispatch<React.SetStateAction<ProgramDayInput[]>>;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const DEFAULT_WEEK_DAYS = [
  "1. Gün - Push (İtme)",
  "2. Gün - Pull (Çekme)",
  "3. Gün - Legs (Bacak)",
  "4. Gün - Dinlenme",
  "5. Gün - Upper (Üst Vücut)",
  "6. Gün - Lower (Alt Vücut)",
  "7. Gün - Dinlenme",
];

const MODAL_ANIMATION_MS = 400;

export const ProgramDaysBuilder: React.FC<ProgramDaysBuilderProps> = ({
  days,
  setDays,
  onBack,
  onSubmit,
  loading,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<number | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (days.length === 0) {
      const initialDays: ProgramDayInput[] = DEFAULT_WEEK_DAYS.map((name, index) => ({
        dayOrder: index + 1,
        dayName: name,
        isRestDay: name.toLowerCase().includes("dinlenme"),
        exercises: [],
      }));
      setDays(initialDays);
    }
  }, [days.length, setDays]);

  const handleDayNameChange = (index: number, newName: string) => {
    setDays((prevDays) => {
      const updated = [...prevDays];
      updated[index] = { ...updated[index], dayName: newName };
      return updated;
    });
  };

  const handleToggleRestDay = (index: number) => {
    setDays((prevDays) => {
      const updated = [...prevDays];
      const isRest = !updated[index].isRestDay;
      updated[index] = {
        ...updated[index],
        isRestDay: isRest,
        exercises: isRest ? [] : updated[index].exercises,
      };
      return updated;
    });
  };

  const openExerciseModal = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setIsExerciseModalOpen(true);
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const closeExerciseModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsExerciseModalOpen(false);
      setSelectedDayIndex(null);
    }, MODAL_ANIMATION_MS);
  };

  const handleExerciseAdded = (exercise: Exercise, sets: WorkoutSetInput[], notes?: string) => {
    if (selectedDayIndex === null) return;

    setDays((prevDays) => {
      const updated = [...prevDays];
      const day = { ...updated[selectedDayIndex] };

      const newExercise: ProgramExerciseInput = {
        exercisePublicId: exercise.publicId,
        exerciseName: exercise.name,
        orderIndex: day.exercises.length,
        notes: notes && notes.trim().length > 0 ? notes.trim() : undefined,
        sets: sets.map((s, idx) => ({
          setNumber: s.setNumber ?? idx + 1,
          targetReps: s.targetReps != null ? String(s.targetReps) : undefined,
          targetWeight: s.targetWeight ?? undefined,
          rir: s.rir ?? undefined,
        })),
      };

      day.exercises = [...day.exercises, newExercise];
      updated[selectedDayIndex] = day;
      return updated;
    });
  };

  const handleRemoveExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    setDays((prevDays) => {
      const updated = [...prevDays];
      const day = { ...updated[dayIndex] };
      day.exercises = day.exercises
        .filter((_, i) => i !== exerciseIndex)
        .map((ex, i) => ({ ...ex, orderIndex: i }));
      updated[dayIndex] = day;
      return updated;
    });
  };

  return (
    <>
      <div className="space-y-6 rounded-2xl border border-nav-border bg-nav-bg p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">
            2. Adım: Haftalık Günler ve Dinlenme Planı
          </h2>
          <p className="text-xs text-foreground/70 font-medium">
            7 günlük haftalık planı düzenleyin ve dinlenme günler varsayılanlarını belirleyin.
          </p>
        </div>

        <div className="space-y-4">
          {days.map((day, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${day.isRestDay
                ? "bg-background/40 border-nav-border opacity-70"
                : "bg-background border-nav-border"
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 font-bold text-xs shrink-0">
                    {day.dayOrder}
                  </span>

                  <input
                    type="text"
                    value={day.dayName}
                    onChange={(e) => handleDayNameChange(index, e.target.value)}
                    disabled={day.isRestDay}
                    className="w-full sm:w-64 px-3 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm text-foreground focus:outline-none focus:border-brand-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={day.isRestDay}
                    onClick={() => openExerciseModal(index)}
                    className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    + Egzersiz Ekle
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRestDay(index)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${day.isRestDay
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-nav-bg border-nav-border text-foreground hover:border-brand-500"
                      }`}
                  >
                    {day.isRestDay ? "Dinlenme Günü (Aktif)" : "Dinlenme Günü Yap"}
                  </button>
                </div>
              </div>
              {/* is rest day exist  */}
              {day.isRestDay && (
                <div className="mt-3 text-xs text-amber-500/80 font-medium">
                  Bu gün dinlenme günü olarak ayarlandı, programa egzersiz eklenmeyecektir.
                </div>
              )}
              {/* is rest day not exist  */}
              {!day.isRestDay && day.exercises.length > 0 && (
                <div className="mt-3 space-y-2">
                  {day.exercises.map((ex, exIndex) => (
                    <div
                      key={`${ex.exercisePublicId}-${exIndex}`}
                      className="flex items-start justify-between gap-3 rounded-xl border border-nav-border bg-nav-bg px-3.5 py-3 text-xs"
                    >
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">
                            {ex.exerciseName || ex.exercisePublicId}
                          </span>
                          <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[11px] font-bold text-brand-500">
                            {ex.sets.length} Set
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {ex.sets.map((set, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center gap-1.5 rounded-lg border border-nav-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80 shadow-2xs"
                            >
                              <span className="text-foreground/40 flex font-bold"><p className="text-red-500">SET- {set.setNumber || sIdx + 1}</p></span>
                              <span className="text-foreground/90 font-semibold">{set.targetReps || 0} Reps</span>
                              {set.targetWeight !== undefined && set.targetWeight !== null && (
                                <span className="text-foreground/60">• {set.targetWeight} kg</span>
                              )}
                              {set.rir !== undefined && set.rir !== null && (
                                <span className="text-brand-500 font-bold">• RIR: {set.rir}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Not Alanı */}
                        {ex.notes && (
                          <div className="mt-1 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-foreground/80 backdrop-blur-sm">
                            <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-500">
                              !
                            </span>
                            <div className="flex-1 leading-relaxed">
                              <span className="font-semibold text-amber-500 mr-1.5">Not:</span>
                              <span className="italic opacity-90">{ex.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseFromDay(index, exIndex)}
                        className="text-red-500 hover:text-red-600 cursor-pointer shrink-0 font-medium pt-1"
                      >
                        Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-nav-border">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-nav-bg border border-nav-border text-sm font-semibold text-foreground hover:border-brand-500 transition-all cursor-pointer"
          >
            &larr; Geri
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Kaydediliyor..." : "Programı Tamamla ve Kaydet"}
          </button>
        </div>
      </div>

      {isExerciseModalOpen && (
        <div
          className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-400 ${isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={closeExerciseModal}
        >
          <div
            className={`relative w-full max-w-7xl h-[90vh] rounded-2xl bg-background border border-nav-border overflow-hidden shadow-2xl transition-all duration-400 transform ${isAnimating
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-[0.97] opacity-0 translate-y-6"
              }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeExerciseModal}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-nav-bg border border-nav-border text-foreground hover:border-red-500 transition-all cursor-pointer flex items-center justify-center"
            >
              ✕
            </button>

            <ExerciseComponent onExerciseAdded={handleExerciseAdded} />
          </div>
        </div>
      )}
    </>
  );
};
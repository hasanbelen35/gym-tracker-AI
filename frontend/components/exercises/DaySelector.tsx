/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from "react";
import { Exercise } from "@/store/slices/exerciseSlice";
import ExerciseComponent from "@/components/exercises/Exercises";

export interface SetInput {
  setNumber: number;
  targetReps?: string;
  targetWeight?: number;
  rir?: number;
}

export interface ProgramExerciseInput {
  exercisePublicId: string;
  orderIndex: number;
  notes?: string;
  sets: SetInput[];
}

export interface ProgramDayInput {
  dayOrder: number;
  dayName: string;
  isRestDay?: boolean;
  exercises: ProgramExerciseInput[];
}

interface ProgramDaysBuilderProps {
  days: ProgramDayInput[];
  setDays: React.Dispatch<React.SetStateAction<ProgramDayInput[]>>;
  availableExercises: Exercise[];
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const DEFAULT_WEEK_DAYS = [
  "Day 1 - Push",
  "Day 2 - Pull",
  "Day 3 - Legs",
  "Day 4 - Rest",
  "Day 5 - Upper",
  "Day 6 - Lower",
  "Day 7 - Rest",
];

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
        isRestDay: name.includes("Rest"),
        exercises: [],
      }));
      setDays(initialDays);
    }
  }, [days.length, setDays]);

  const handleDayNameChange = (index: number, newName: string) => {
    const updated = [...days];
    updated[index].dayName = newName;
    setDays(updated);
  };

  const handleToggleRestDay = (index: number) => {
    const updated = [...days];
    const isRest = !updated[index].isRestDay;
    updated[index].isRestDay = isRest;

    if (isRest) {
      updated[index].exercises = [];
    }

    setDays(updated);
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
    }, 400);
  };

  return (
    <>
      <div className="space-y-6 bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">
            2. Adım: Haftalık Günler & Dinlenme
          </h2>
          <p className="text-xs text-foreground opacity-70">
            7 günlük haftalık planı düzenleyin ve dinlenme günlerini işaretleyin.
          </p>
        </div>

        <div className="space-y-4">
          {days.map((day, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                day.isRestDay
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      day.isRestDay
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-nav-bg border-nav-border text-foreground hover:border-brand-500"
                    }`}
                  >
                    {day.isRestDay
                      ? "Dinlenme Günü (Aktif)"
                      : "Dinlenme Yap (Rest Day)"}
                  </button>
                </div>
              </div>

              {day.isRestDay && (
                <div className="mt-3 text-xs text-amber-500/80 font-medium">
                  Bu gün dinlenme günü olarak ayarlandı, programa egzersiz eklenmeyecek.
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
          className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-400 ${
            isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={closeExerciseModal}
        >
          <div
            className={`relative w-full max-w-7xl h-[90vh] rounded-2xl bg-background border border-nav-border overflow-hidden shadow-2xl transition-all duration-400 transform ${
              isAnimating 
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

            <ExerciseComponent />
          </div>
        </div>
      )}
    </>
  );
};
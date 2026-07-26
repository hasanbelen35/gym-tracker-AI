'use client';

import React from "react";
import { Exercise } from "@/store/slices/exerciseSlice";

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
  // Initialize 7 days if not already configured
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

  return (
    <div className="space-y-6 bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">2. Adım: Haftalık Günler & Dinlenme</h2>
        <p className="text-xs text-foreground opacity-70">
          7 günlük haftalık planı düzenleyin ve dinlenme günlerini işaretleyin.
        </p>
      </div>

      {/* Days List Container */}
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

              <div className="flex-col items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleRestDay(index)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${day.isRestDay
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-nav-bg border-nav-border text-foreground hover:border-brand-500"
                    }`}
                >
                  {day.isRestDay ? "Dinlenme Günü (Aktif)" : "Dinlenme Yap (Rest Day)"}
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

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-nav-border">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-nav-bg border border-nav-border text-sm font-semibold text-foreground hover:border-brand-500 transition-all"
        >
          &larr; Geri
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Programı Tamamla ve Kaydet"}
        </button>
      </div>
    </div>
  );
};
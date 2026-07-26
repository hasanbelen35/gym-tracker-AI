'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
    fetchExercises,
    setEquipmentFilter,
    setCategoryFilter,
    setTargetMuscleFilter,
    clearFilters,
    Exercise as BaseExercise
} from "@/store/slices/exerciseSlice";
import Loading from "@/components/Loading";
import { 
    IconDumbbell, 
    IconTarget, 
    IconReset, 
    IconChevron, 
    IconClose 
} from "@/icons/icon";
 
// --- CONFIGURATIONS ---
const CATEGORY_TO_MUSCLES: Record<string, string[]> = {
    "waist": ["abs", "spine"],
    "upper legs": ["quads", "glutes", "hamstrings", "adductors", "abductors"],
    "back": ["lats", "upper back", "traps", "levator scapulae"],
    "lower legs": ["calves"],
    "chest": ["pectorals", "serratus anterior"],
    "upper arms": ["biceps", "triceps"],
    "lower arms": ["forearms"],
    "shoulders": ["delts"],
    "cardio": ["cardiovascular system"],
    "neck": []
};

const CATEGORIES = Object.keys(CATEGORY_TO_MUSCLES);

const EQUIPMENTS = [
    "body weight", "cable", "leverage machine", "assisted",
    "medicine ball", "stability ball", "band", "barbell",
    "rope", "dumbbell", "ez barbell", "sled machine",
    "upper body ergometer", "kettlebell", "olympic barbell",
    "weighted", "bosu ball", "resistance band", "roller",
    "skierg machine", "hammer", "smith machine", "wheel roller",
    "stationary bike", "tire", "trap bar", "elliptical machine",
    "stepmill machine"
];

// --- EXTENDED TYPES ---
export interface Exercise extends BaseExercise {
    bodyPart?: string;
    gifUrl?: string;
    instructions?: string;
    instruction_steps?: string[];
}


const selectBaseClasses =
    "peer w-full appearance-none rounded-md border border-nav-border bg-[var(--background)] px-3.5 py-3 pr-9 text-sm font-medium text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:opacity-40";

export const ExerciseTestPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exercises, loading, error, filters } = useSelector((state: RootState) => state.exercises);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    useEffect(() => {
        dispatch(fetchExercises(filters));
    }, [dispatch, filters]);

    const availableTargetMuscles = useMemo(() => {
        if (!filters.category) {
            return Array.from(new Set(Object.values(CATEGORY_TO_MUSCLES).flat()));
        }
        return CATEGORY_TO_MUSCLES[filters.category] || [];
    }, [filters.category]);

    const activeFilterCount = [filters.category, filters.targetMuscle, filters.equipment].filter(Boolean).length;

    const handleExerciseClick = (exercise: Exercise) => {
        setSelectedExercise(exercise);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-10 font-sans text-[var(--foreground)]">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">

                {/* --- HEADER SECTION --- */}
                <div className="mb-8 border-b border-nav-border pb-6">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-500">
                        <IconDumbbell className="h-3.5 w-3.5" />
                        Exercise Database
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--foreground)] sm:text-4xl">
                        Exercise Pool
                    </h1>
                    <p className="mt-1.5 text-sm text-[var(--foreground)]/60">
                        Filtered movement library by region, muscle group, and equipment.
                    </p>
                </div>

                {/* --- FILTER PANEL --- */}
                <div className="mb-8 rounded-xl border border-nav-border bg-nav-bg p-4 shadow-nav sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/50">
                            Filters {activeFilterCount > 0 && (
                                <span className="ml-1.5 rounded-full bg-brand-500/15 px-2 py-0.5 text-brand-500">{activeFilterCount}</span>
                            )}
                        </span>
                        <button
                            onClick={() => dispatch(clearFilters())}
                            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/55 transition-colors hover:text-brand-500 cursor-pointer"
                        >
                            <IconReset className="h-3.5 w-3.5 transition-transform group-hover:-rotate-90" />
                            Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="block">
                            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--foreground)]/45">Category</span>
                            <div className="relative">
                                <select
                                    value={filters.category || ""}
                                    onChange={(e) => {
                                        dispatch(setCategoryFilter(e.target.value));
                                        dispatch(setTargetMuscleFilter(""));
                                    }}
                                    className={selectBaseClasses}
                                >
                                    <option value="">All Categories</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/45 peer-focus:text-brand-500" />
                            </div>
                        </label>

                        <label className="block">
                            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--foreground)]/45">Target Muscle</span>
                            <div className="relative">
                                <select
                                    value={filters.targetMuscle || ""}
                                    onChange={(e) => dispatch(setTargetMuscleFilter(e.target.value))}
                                    className={selectBaseClasses}
                                >
                                    <option value="">{filters.category ? "Select Muscle" : "Select Category First"}</option>
                                    {availableTargetMuscles.map((muscle) => (
                                        <option key={muscle} value={muscle}>
                                            {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/45 peer-focus:text-brand-500" />
                            </div>
                        </label>

                        <label className="block">
                            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--foreground)]/45">Equipment</span>
                            <div className="relative">
                                <select
                                    value={filters.equipment || ""}
                                    onChange={(e) => dispatch(setEquipmentFilter(e.target.value))}
                                    className={selectBaseClasses}
                                >
                                    <option value="">All Equipments</option>
                                    {EQUIPMENTS.map((eq) => (
                                        <option key={eq} value={eq}>
                                            {eq.charAt(0).toUpperCase() + eq.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/45 peer-focus:text-brand-500" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* --- RESULT COUNTER --- */}
                {!loading && !error && (
                    <div className="mb-4 flex items-center gap-2.5">
                        <span className="flex h-9 min-w-9 items-center justify-center rounded-full border-2 border-brand-500 px-2 text-sm font-black text-brand-500">
                            {exercises.length}
                        </span>
                        <span className="text-sm font-medium text-[var(--foreground)]/60">
                            exercises found
                        </span>
                    </div>
                )}

                {loading && <Loading />}

                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-brand-600/40 bg-brand-50 p-4">
                        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-black text-brand-500">!</span>
                        <div>
                            <p className="text-sm font-semibold text-brand-dark">Failed to load exercises</p>
                            <p className="mt-0.5 text-xs text-brand-text">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && exercises.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-nav-border py-16 text-center">
                        <IconTarget className="h-8 w-8 text-nav-border" />
                        <p className="text-sm font-semibold text-[var(--foreground)]/70">No exercises match these filters</p>
                        <p className="text-xs text-[var(--foreground)]/45">Try changing the category, muscle group, or equipment.</p>
                    </div>
                )}

                {/* --- EXERCISE CARDS GRID --- */}
                {!loading && !error && exercises.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {exercises.map((ex: Exercise) => (
                            <div
                                key={ex.publicId}
                                onClick={() => handleExerciseClick(ex)}
                                className="group relative overflow-hidden rounded-xl border border-nav-border bg-nav-bg p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] cursor-pointer"
                            >
                                <span className="absolute left-0 top-0 h-full w-1 bg-brand-500 opacity-0 transition-opacity group-hover:opacity-100" />

                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="mb-3 pr-1 text-[15px] font-bold leading-snug text-[var(--foreground)]">
                                        {ex.name}
                                    </h4>
                                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-nav-border bg-[var(--background)] text-xs text-[var(--foreground)]/50 transition-colors group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white">
                                        +
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {ex.targetMuscle && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-nav-border bg-[var(--background)]/60 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--foreground)]/75">
                                            <IconTarget className="h-3 w-3 text-brand-500" />
                                            {ex.targetMuscle}
                                        </span>
                                    )}
                                    {ex.equipment && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-nav-border bg-[var(--background)]/60 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--foreground)]/75">
                                            <IconDumbbell className="h-3 w-3 text-[var(--foreground)]/55" />
                                            {ex.equipment}
                                        </span>
                                    )}
                                    {ex.bodyPart && (
                                        <span className="inline-flex items-center rounded-full bg-brand-500/10 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-brand-500">
                                            {ex.bodyPart}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- EXERCISE DETAIL MODAL --- */}
                {selectedExercise && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
                        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-nav-border bg-nav-bg p-6 shadow-2xl">
                            
                            <button
                                onClick={() => setSelectedExercise(null)}
                                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-nav-border bg-[var(--background)] text-[var(--foreground)]/70 hover:bg-brand-500 hover:text-white transition-colors"
                            >
                                <IconClose className="h-4 w-4" />
                            </button>

                            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--foreground)] mb-4 pr-10">
                                {selectedExercise.name}
                            </h2>

                            {selectedExercise.gifUrl && (
                                <div className="mb-6 flex justify-center rounded-xl overflow-hidden border border-nav-border bg-[var(--background)] p-2">
                                    <img 
                                        src={selectedExercise.gifUrl} 
                                        alt={selectedExercise.name} 
                                        className="h-64 object-contain rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="mb-6 flex flex-wrap gap-2">
                                {selectedExercise.bodyPart && (
                                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase text-brand-500">
                                        Body Part: {selectedExercise.bodyPart}
                                    </span>
                                )}
                                {selectedExercise.targetMuscle && (
                                    <span className="rounded-full border border-nav-border bg-[var(--background)] px-3 py-1 text-xs font-semibold uppercase text-[var(--foreground)]/80">
                                        Target: {selectedExercise.targetMuscle}
                                    </span>
                                )}
                                {selectedExercise.equipment && (
                                    <span className="rounded-full border border-nav-border bg-[var(--background)] px-3 py-1 text-xs font-semibold uppercase text-[var(--foreground)]/80">
                                        Equipment: {selectedExercise.equipment}
                                    </span>
                                )}
                            </div>

                            {selectedExercise.instruction_steps && selectedExercise.instruction_steps.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500">
                                        Instruction Steps
                                    </h3>
                                    <ol className="space-y-2">
                                        {selectedExercise.instruction_steps.map((step, index) => (
                                            <li key={index} className="flex items-start gap-3 rounded-lg border border-nav-border bg-[var(--background)] p-3 text-sm text-[var(--foreground)]/80">
                                                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-500">
                                                    {index + 1}
                                                </span>
                                                <span className="mt-0.5">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ExerciseTestPage;
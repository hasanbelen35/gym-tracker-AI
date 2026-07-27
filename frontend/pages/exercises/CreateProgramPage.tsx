'use client';

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SplitSelector, ProgramTypeEnum, SplitCategoryEnum } from "@/components/exercises/SplitSelector";
import { ProgramDaysBuilder } from "@/components/exercises/DaySelector";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  createProgram,
  ProgramDayInput as BaseProgramDayInput,
  ProgramExerciseInput as BaseProgramExerciseInput
} from "@/store/slices/exerciseSlice";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";
import { validateProgramForm } from "@/utils/programValidator";
import { ArrowLeftIcon } from '@/icons/icon';

export interface ProgramExerciseInput extends BaseProgramExerciseInput {
  exerciseName?: string;
}

export interface ProgramDayInput extends Omit<BaseProgramDayInput, "exercises"> {
  exercises: ProgramExerciseInput[];
}

export default function CreateProgramPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const memberPublicId = params?.memberPublicId as string;
  const { programCreating } = useAppSelector((state) => state.exercises);

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [programType, setProgramType] = useState<ProgramTypeEnum>("WORKOUT");
  const [splitType, setSplitType] = useState<SplitCategoryEnum>("PPL");
  const [days, setDays] = useState<ProgramDayInput[]>([]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFinalSubmit = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!memberPublicId) {
      setErrorMessage("Hata: Üye kimliği bulunamadı.");
      return;
    }

    if (!user?.id) {
      setErrorMessage("Hata: Antrenör kimliği bulunamadı.");
      return;
    }

    const validationError = validateProgramForm(title, days);
    if (validationError) {
      setErrorMessage(validationError);
      if (!title || title.trim() === "") {
        setStep(1);
      } else {
        setStep(2);
      }
      return;
    }

    const finalPayload = {
      memberPublicId,
      trainerId: user.id as number,
      title,
      type: programType,
      splitType,
      days,
    };

    const resultAction = await dispatch(createProgram(finalPayload));

    if (createProgram.fulfilled.match(resultAction)) {
      setSuccessMessage("Antrenman programı başarıyla oluşturuldu! Yönlendiriliyorsunuz...");
      setTimeout(() => {
        router.push(`/trainer/athletes/${memberPublicId}`);
      }, 1500);
    } else {
      setErrorMessage("Program kaydedilirken sunucu tabanlı bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {(successMessage || errorMessage) && (
        <div className="max-w-4xl mx-auto mb-6 flex flex-col gap-2">
          <SuccessBox message={successMessage} />
          <ErrorBox message={errorMessage} />
        </div>
      )}
      {/* back button*/}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
      >
       <ArrowLeftIcon /> Geri Dön
      </button>

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${step === 1 ? "bg-brand-500 text-white border-brand-500" : "bg-nav-bg text-foreground border-nav-border"}`}>
          <span>1</span> Split & Details
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${step === 2 ? "bg-brand-500 text-white border-brand-500" : "bg-nav-bg text-foreground border-nav-border"}`}>
          <span>2</span> Days & Exercises
        </div>
      </div>

      {step === 1 && (
        <div className="max-w-4xl mx-auto">
          <SplitSelector
            title={title}
            setTitle={setTitle}
            programType={programType}
            setProgramType={setProgramType}
            splitType={splitType}
            setSplitType={setSplitType}
            onNext={() => {
              if (!title || title.trim() === "") {
                setErrorMessage("Lütfen program başlığını boş bırakmayın.");
                return;
              }
              setErrorMessage(null);
              setStep(2);
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div className="max-w-4xl mx-auto">
          <ProgramDaysBuilder
            days={days}
            setDays={setDays}
            onBack={() => setStep(1)}
            onSubmit={handleFinalSubmit}
            loading={programCreating}
          />
        </div>
      )}
    </div>
  );
}
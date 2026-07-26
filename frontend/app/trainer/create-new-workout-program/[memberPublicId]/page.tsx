'use client';

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SplitSelector, ProgramTypeEnum, SplitCategoryEnum } from "@/components/exercises/SplitSelector";
import { ProgramDaysBuilder } from "@/components/exercises/DaySelector";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { createProgram, ProgramDayInput } from "@/store/slices/exerciseSlice";
import { useAuth } from "@/hooks/useAuth";

export default function CreateProgramPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const memberPublicId = params?.memberPublicId as string;
  const { programCreating, error } = useAppSelector((state) => state.exercises);

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [programType, setProgramType] = useState<ProgramTypeEnum>("WORKOUT");
  const [splitType, setSplitType] = useState<SplitCategoryEnum>("PPL");
  const [days, setDays] = useState<ProgramDayInput[]>([]);

  const handleFinalSubmit = async () => {
    if (!memberPublicId) {
      console.error("Test Error: Member ID not found.");
      alert("Hata: Üye ID bulunamadı.");
      return;
    }

    if (!user?.id) {
      console.error("Test Error: Trainer ID (user.id) not found from useAuth.");
      alert("Hata: Antrenör kimliği bulunamadı.");
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

    console.log("Payload being sent to backend:", JSON.stringify(finalPayload, null, 2));

    const resultAction = await dispatch(createProgram(finalPayload));

    if (createProgram.fulfilled.match(resultAction)) {
      console.log("Test Success: Program created successfully.", resultAction.payload);
      alert("Antrenman programı başarıyla oluşturuldu!");
      router.push(`/trainer/athletes/${memberPublicId}`);
    } else {
      console.error("Test Error Detail (rejected):", resultAction.payload || error);
      alert(`Hata: ${JSON.stringify(resultAction.payload) || "Program oluşturulamadı."}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
          step === 1 ? "bg-brand-500 text-white border-brand-500" : "bg-nav-bg text-foreground border-nav-border"
        }`}>
          <span>1</span> Split & Details
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
          step === 2 ? "bg-brand-500 text-white border-brand-500" : "bg-nav-bg text-foreground border-nav-border"
        }`}>
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
              console.log("Step 1 completed. Title:", title, "Type:", programType, "Split:", splitType);
              setStep(2);
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div className="max-w-4xl mx-auto">
          <ProgramDaysBuilder
            days={days}
            setDays={(updatedDays) => {
              console.log("Step 2 days updated:", updatedDays);
              setDays(updatedDays as unknown as ProgramDayInput[]);
            }}
            availableExercises={[]}
            onBack={() => setStep(1)}
            onSubmit={handleFinalSubmit}
            loading={programCreating}
          />
        </div>
      )}
    </div>
  );
}
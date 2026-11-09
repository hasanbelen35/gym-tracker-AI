// ==========================================
// COMPLETE PROFILE CONTAINER
// ==========================================

'use client';

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { completeMemberProfile } from "@/store/slices/memberSlice";
import { useRouter } from "next/navigation";
import CompleteProfileStepOne from "@/features/member/complate-profile/components/CompleteProfileStepOne";
import CompleteProfileStepTwo from "@/features/member/complate-profile/components/CompleteProfileStepTwoProps";

export default function CompleteProfileContainer() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state) => state.member);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [step, setStep] = useState<1 | 2>(1);

    const [formData, setFormData] = useState({
        age: "",
        height: "",
        weight: "",
        gender: "MALE" as "MALE" | "FEMALE",
        medicalNotes: "",
        avatarUrl: "",
        goal: "MUSCLE_GAIN" as "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS",
        experienceLevel: "BEGINNER" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        workoutDaysPerWeek: "3",
        sessionDuration: "60",
        equipmentAccess: "GYM" as "GYM" | "HOME" | "BODYWEIGHT",
        activityLevel: "MODERATE" as "SEDENTARY" | "MODERATE" | "ACTIVE",
        injuries: "",
        additionalNotes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePrevStep = () => {
        setStep(1);
    };
const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const payload: {
            age?: number;
            height?: number;
            weight?: number;
            gender?: "MALE" | "FEMALE";
            medicalNotes?: string;
            avatarUrl?: string;
            goal?: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
            experienceLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
            workoutDaysPerWeek?: number;
            sessionDuration?: number;
            equipmentAccess?: "GYM" | "HOME" | "BODYWEIGHT";
            activityLevel?: "SEDENTARY" | "MODERATE" | "ACTIVE";
            injuries?: string;
            additionalNotes?: string;
        } = {};

        if (formData.age !== "") payload.age = Number(formData.age);
        if (formData.height !== "") payload.height = Number(formData.height);
        if (formData.weight !== "") payload.weight = Number(formData.weight);
        if (formData.gender) payload.gender = formData.gender;
        if (formData.medicalNotes.trim() !== "") payload.medicalNotes = formData.medicalNotes;
        if (formData.avatarUrl.trim() !== "") payload.avatarUrl = formData.avatarUrl;

        if (formData.goal) payload.goal = formData.goal;
        if (formData.experienceLevel) payload.experienceLevel = formData.experienceLevel;
        if (formData.workoutDaysPerWeek !== "") payload.workoutDaysPerWeek = Number(formData.workoutDaysPerWeek);
        if (formData.sessionDuration !== "") payload.sessionDuration = Number(formData.sessionDuration);
        if (formData.equipmentAccess) payload.equipmentAccess = formData.equipmentAccess;
        if (formData.activityLevel) payload.activityLevel = formData.activityLevel;
        if (formData.injuries.trim() !== "") payload.injuries = formData.injuries;
        if (formData.additionalNotes.trim() !== "") payload.additionalNotes = formData.additionalNotes;

        const resultAction = await dispatch(completeMemberProfile(payload));
        if (completeMemberProfile.fulfilled.match(resultAction)) {
            setSuccessMessage("Profiliniz başarıyla tamamlandı!");
            setTimeout(() => {
                router.push("/dashboard/athlete");
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
                {step === 1 ? (
                    <CompleteProfileStepOne
                        formData={formData}
                        error={error}
                        successMessage={successMessage}
                        onChange={handleChange}
                        onNext={handleNextStep}
                        onBack={() => router.back()}
                        onSkip={() => router.push("/dashboard/athlete")}
                    />
                ) : (
                    <CompleteProfileStepTwo
                        formData={formData}
                        loading={loading}
                        error={error}
                        successMessage={successMessage}
                        onChange={handleChange}
                        onPrev={handlePrevStep}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}
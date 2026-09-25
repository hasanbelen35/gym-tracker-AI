'use client'
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { completeTrainerProfile } from "@/store/slices/trainerSlice";
import { ArrowLeftIcon } from "@/icons/icon";
import { useRouter } from "next/navigation";
import { TrainerProfileFormData, TrainerProfilePayload } from "@/features/trainer/complate-profile/types";
import { INITIAL_FORM_DATA, NUMERIC_FIELDS } from "@/features/trainer/complate-profile/config/formConfig";
import { TrainerProfileForm } from "@/features/trainer/complate-profile/components/TrainerProfileForm";

function buildPayload(formData: TrainerProfileFormData): TrainerProfilePayload {
    const payload: TrainerProfilePayload = {};

    (Object.keys(formData) as (keyof TrainerProfileFormData)[]).forEach((key) => {
        const value = formData[key].toString().trim();
        if (value === "") return;

        if (NUMERIC_FIELDS.has(key)) {
            payload[key] = Number(value) as never;
        } else {
            payload[key] = value as never;
        }
    });

    return payload;
}

const ComplateTrainerProfilePage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state) => state.trainer);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<TrainerProfileFormData>(INITIAL_FORM_DATA);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const payload = buildPayload(formData);
        const resultAction = await dispatch(completeTrainerProfile(payload));

        if (completeTrainerProfile.fulfilled.match(resultAction)) {
            setSuccessMessage("Profiliniz başarıyla güncellendi.");
        }
        router.push("/dashboard/trainer");
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>
                </div>

                <TrainerProfileForm
                    formData={formData}
                    loading={loading}
                    error={error}
                    successMessage={successMessage}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onSkip={() => router.push("/dashboard/trainer")}
                />
            </div>
        </div>
    );
};

export default ComplateTrainerProfilePage;
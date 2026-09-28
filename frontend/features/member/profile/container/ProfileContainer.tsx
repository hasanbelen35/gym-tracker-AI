'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCurrentMember, fetchMyTrainer, updateMemberProfileData } from "@/store/slices/memberSlice";
import { UpdateMemberProfileData } from "../types";
import { ArrowLeftIcon } from "@/icons/icon";
import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";
import ConfirmModal from "@/components/ConfirmModel";
import { ProfileHeader } from "@/features/member/profile/components/ProfileHeader";
import { PhysicalStatsCard } from "@/features/member/profile/components/PhysicalStatsCard";
import { TrainerAndSessionsCard } from "@/features/member/profile/components/TrainerAndSessionsCard";

const ProfilePage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { profile, trainer, assignmentStatus, loading, error, successMessage } = useAppSelector((state) => state.member);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [formData, setFormData] = useState<UpdateMemberProfileData>({});

    useEffect(() => {
        dispatch(fetchCurrentMember());
        dispatch(fetchMyTrainer());
    }, [dispatch]);

    const handleEditClick = () => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                surname: profile.surname || "",
                phone: profile.phone || "",
                gender: profile.gender === "MALE" || profile.gender === "FEMALE" ? profile.gender : undefined,
                age: profile.age || undefined,
                height: profile.height || undefined,
                weight: profile.weight || undefined,
                medicalNotes: profile.medicalNotes || "",
            });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field: keyof UpdateMemberProfileData, value: string | number | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value } as UpdateMemberProfileData));
    };

    const handleSaveClick = () => {
        setIsModalOpen(true);
    };
const handleConfirmUpdate = async () => {
        setIsSubmitting(true);
        try {
            const payload: UpdateMemberProfileData = {
                name: formData.name?.trim() || undefined,
                surname: formData.surname?.trim() || undefined,
                phone: formData.phone?.trim() || undefined,
                gender: formData.gender,
                age: formData.age ? Number(formData.age) : undefined,
                height: formData.height ? Number(formData.height) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
                medicalNotes: formData.medicalNotes?.trim() || undefined,
            };

            const resultAction = await dispatch(updateMemberProfileData(payload));
            
            if (updateMemberProfileData.fulfilled.match(resultAction)) {
                setIsEditing(false);
                setIsModalOpen(false);
            } else {
                setIsModalOpen(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !profile) {
        return <Loading />;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="group cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nav-bg border border-nav-border/80 text-xs font-bold uppercase tracking-wider hover:border-brand-500/60 hover:bg-brand-50/5 transition-all shadow-sm"
                >
                    <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Geri Dön</span>
                </button>

                {!isEditing && (
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-700 transition-all shadow-sm cursor-pointer"
                    >
                        Düzenle
                    </button>
                )}
            </div>

            {(error || successMessage) && (
                <div className="flex flex-col gap-3">
                    {error && <ErrorBox message={error} />}
                    {successMessage && <SuccessBox message={successMessage} />}
                </div>
            )}
            {/* ProfileHeader */}
            <ProfileHeader
                profile={profile}
                assignmentStatus={assignmentStatus}
                isEditing={isEditing}
                formData={formData}
                onChange={handleChange}
            />

            {/* PhysicalStatsCard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhysicalStatsCard
                    profile={profile}
                    isEditing={isEditing}
                    formData={formData}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onSave={handleSaveClick}
                    isSubmitting={isSubmitting}
                />
                <TrainerAndSessionsCard trainer={trainer} sessions={profile?.sessions || []} />
            </div>
            {/* CONFIRM MODAL */}
            <ConfirmModal
                isOpen={isModalOpen}
                title="Profili Güncelle"
                message="Profil bilgileriniz güncellenecektir. Onaylıyor musunuz?"
                confirmText="Evet, Güncelle"
                cancelText="Vazgeç"
                loading={isSubmitting}
                onConfirm={handleConfirmUpdate}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProfilePage;
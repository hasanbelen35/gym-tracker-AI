'use client';

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateMemberProfile } from "@/store/slices/memberSlice";
import { useRouter } from "next/navigation";
import CompleteProfileView from "../components/CompleteProfileView";

export default function CompleteProfileContainer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.member);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "MALE" as "MALE" | "FEMALE",
    medicalNotes: "",
    avatarUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    } = {};

    if (formData.age !== "") payload.age = Number(formData.age);
    if (formData.height !== "") payload.height = Number(formData.height);
    if (formData.weight !== "") payload.weight = Number(formData.weight);
    if (formData.gender) payload.gender = formData.gender;
    if (formData.medicalNotes.trim() !== "") payload.medicalNotes = formData.medicalNotes;
    if (formData.avatarUrl.trim() !== "") payload.avatarUrl = formData.avatarUrl;

    const resultAction = await dispatch(updateMemberProfile(payload));
    if (updateMemberProfile.fulfilled.match(resultAction)) {
      setSuccessMessage("Profiliniz başarıyla güncellendi.");
    }
    router.push("/dashboard/athlete");
  };

  return (
    <CompleteProfileView
      formData={formData}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBack={() => router.back()}
      onSkip={() => router.push("/dashboard/athlete")}
    />
  );
}
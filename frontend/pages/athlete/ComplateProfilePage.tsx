'use client'
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateMemberProfile } from "@/store/slices/memberSlice";
import { ArrowLeftIcon } from "@/icons/icon";
import { useRouter } from "next/navigation";

const ComplateProfilePage = () => {
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
    router.push("/dashboard/athlete")
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

        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md">
          <div className="mb-6 pb-4 border-b border-nav-border">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profilini Tamamla</h1>
            <p className="text-sm opacity-70 mt-1">Sana en uygun programları hazırlayabilmemiz için lütfen bilgilerini gir.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center shadow-lg">
              <p className="font-semibold mb-1">Bir Hata Oluştu</p>
              <p className="opacity-90">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center shadow-lg">
              <p className="font-semibold mb-1">Başarılı</p>
              <p className="opacity-90">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-70">Yaş</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="24"
                  className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-70">Boy (cm)</label>
                <input
                  type="number"
                  step="0.01"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="178"
                  className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-70">Kilo (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="75"
                  className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium opacity-70">Cinsiyet</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-brand-500 transition-all"
              >
                <option value="MALE">Erkek</option>
                <option value="FEMALE">Kadın</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium opacity-70">Sağlık Notları / Sakatlıklar</label>
              <textarea
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleChange}
                rows={3}
                placeholder="Varsa kronik rahatsızlıkların veya sakatlıkların..."
                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium opacity-70">Avatar URL</label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Kaydediliyor..." : "Profili Güncelle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplateProfilePage;
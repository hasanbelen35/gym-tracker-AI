import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IconUser, ArrowLeftIcon } from "@/icons/icon";
import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { TrainerProfile } from "@/types/trainer.types";
import ConfirmModal from "@/components/ConfirmModel";
import { UpdateTrainerProfileData } from "@/features/trainer/profile/types";

interface TrainerProfileUIProps {
    trainerProfile: TrainerProfile | null;
    loading: boolean;
    error: string | null;
    onUpdate: (data: UpdateTrainerProfileData) => Promise<void>;
}

export const TrainerProfileUI: React.FC<TrainerProfileUIProps> = ({
    trainerProfile,
    loading,
    error,
    onUpdate
}) => {
    const router = useRouter();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        age: "",
        height: "",
        weight: "",
        gender: "MALE",
        phone: ""
    });

    const handleEditClick = () => {
        if (trainerProfile) {
            setFormData({
                name: trainerProfile.name || "",
                surname: trainerProfile.surname || "",
                age: trainerProfile.age?.toString() || "",
                height: trainerProfile.height?.toString() || "",
                weight: trainerProfile.weight?.toString() || "",
                gender: trainerProfile.gender || "MALE",
                phone: trainerProfile.phone || ""
            });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setIsSubmitting(true);
        try {
            const payload: UpdateTrainerProfileData = {
                name: formData.name.trim() === "" ? undefined : formData.name,
                surname: formData.surname.trim() === "" ? undefined : formData.surname,
                age: formData.age ? Number(formData.age) : undefined,
                height: formData.height ? Number(formData.height) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
                gender: formData.gender as "MALE" | "FEMALE",
                phone: formData.phone.trim() === "" ? undefined : formData.phone
            };
            
            await onUpdate(payload);
            setIsEditing(false);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Güncelleme Hatası:", err);
            setIsModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !trainerProfile) {
        return <Loading />;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
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

            {error && <ErrorBox message={error} />}

            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                    {trainerProfile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={trainerProfile.avatarUrl} alt="Trainer Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <IconUser className="w-10 h-10" />
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                    {isEditing ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="px-3 py-2 border border-nav-border rounded-lg bg-transparent text-brand-text w-full focus:outline-brand-500"
                                placeholder="Ad"
                            />
                            <input
                                type="text"
                                value={formData.surname}
                                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                className="px-3 py-2 border border-nav-border rounded-lg bg-transparent text-brand-text w-full focus:outline-brand-500"
                                placeholder="Soyad"
                            />
                        </div>
                    ) : (
                        <h1 className="text-2xl font-bold text-brand-text">
                            {trainerProfile?.name} {trainerProfile?.surname}
                        </h1>
                    )}
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400">{trainerProfile?.email}</p>
                    <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                        {trainerProfile?.gym?.name && (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-600 border border-brand-100 dark:border-brand-500/20">
                                {trainerProfile.gym.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3">Profil Detayları</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 block mb-1">Yaş</span>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold"
                            />
                        ) : (
                            <span className="text-lg font-bold text-brand-text">{trainerProfile?.age ?? "-"}</span>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 block mb-1">Boy (cm)</span>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold"
                            />
                        ) : (
                            <span className="text-lg font-bold text-brand-text">{trainerProfile?.height ? `${trainerProfile.height} cm` : "-"}</span>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 block mb-1">Kilo (kg)</span>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold"
                            />
                        ) : (
                            <span className="text-lg font-bold text-brand-text">{trainerProfile?.weight ? `${trainerProfile.weight} kg` : "-"}</span>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 block mb-1">Cinsiyet</span>
                        {isEditing ? (
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full text-center bg-transparent border-b border-brand-500 focus:outline-none text-brand-text font-bold cursor-pointer"
                            >
                                <option value="MALE">Erkek</option>
                                <option value="FEMALE">Kadın</option>
                            </select>
                        ) : (
                            <span className="text-lg font-bold text-brand-text">{trainerProfile?.gender ?? "-"}</span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Telefon Numarası</span>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-transparent focus:outline-none"
                                    placeholder="+905554443322"
                                />
                            ) : (
                                trainerProfile?.phone || "Belirtilmemiş"
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Kayıt Tarihi</span>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                            {trainerProfile?.createdAt ? new Date(trainerProfile.createdAt).toLocaleDateString('tr-TR') : "-"}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-nav-border">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            İptal Et
                        </button>
                        <button
                            onClick={handleSaveClick}
                            className="px-6 py-2 rounded-lg cursor-pointer text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
                        >
                            Kaydet
                        </button>
                    </div>
                )}
            </div>

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
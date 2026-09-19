// features/trainer/components/TrainerProfileUI.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { IconUser, ArrowLeftIcon } from "@/icons/icon";
import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { TrainerProfile } from "@/types/trainer.types";

interface TrainerProfileUIProps {
    trainerProfile: TrainerProfile | null;
    loading: boolean;
    error: string | null;
}

export const TrainerProfileUI: React.FC<TrainerProfileUIProps> = ({
    trainerProfile,
    loading,
    error,
}) => {
    const router = useRouter();

    if (loading && !trainerProfile) {
        return <Loading />;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            {/* BACK BUTTON */}
            <button
                onClick={() => router.back()}
                className="group cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nav-bg border border-nav-border/80 text-xs font-bold uppercase tracking-wider hover:border-brand-500/60 hover:bg-brand-500/5 transition-all shadow-sm"
            >
                <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Geri Dön</span>
            </button>

            {error && <ErrorBox message={error} />}

            {/* PROFILE TITLE CARD */}
            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                    {trainerProfile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={trainerProfile.avatarUrl} alt="Trainer Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <IconUser className="w-10 h-10" />
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                    <h1 className="text-2xl font-bold text-brand-text">
                        {trainerProfile?.name} {trainerProfile?.surname}
                    </h1>
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

            {/* DATAS DIVS */}
            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3">Profil Detayları</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* AGE */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                        <span className="text-xs text-slate-400 block mb-1">Yaş</span>
                        <span className="text-lg font-bold text-brand-text">{trainerProfile?.age ?? "-"}</span>
                    </div>
                    {/* HEIGHT */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                        <span className="text-xs text-slate-400 block mb-1">Boy</span>
                        <span className="text-lg font-bold text-brand-text">{trainerProfile?.height ? `${trainerProfile.height} cm` : "-"}</span>
                    </div>
                    {/* WEIGHT */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                        <span className="text-xs text-slate-400 block mb-1">Kilo</span>
                        <span className="text-lg font-bold text-brand-text">{trainerProfile?.weight ? `${trainerProfile.weight} kg` : "-"}</span>
                    </div>
                    {/* GENDER */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                        <span className="text-xs text-slate-400 block mb-1">Cinsiyet</span>
                        <span className="text-lg font-bold text-brand-text">{trainerProfile?.gender ?? "-"}</span>
                    </div>
                </div>
                {/* PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Telefon Numarası</span>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                            {trainerProfile?.phone || "Belirtilmemiş"}
                        </div>
                    </div>
                    {/* CREATED AT */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Kayıt Tarihi</span>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                            {trainerProfile?.createdAt ? new Date(trainerProfile.createdAt).toLocaleDateString('tr-TR') : "-"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
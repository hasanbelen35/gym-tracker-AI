'use client';

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCurrentMember, fetchMyTrainer } from "@/store/slices/memberSlice";
import { IconUser } from "@/icons/icon";
import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profile, trainer, assignmentStatus, loading, error } = useAppSelector((state) => state.member);

    useEffect(() => {
        dispatch(fetchCurrentMember());
        dispatch(fetchMyTrainer());
    }, [dispatch]);

    if (loading && !profile) {
        return (
            <Loading />
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
            {error && (
                <ErrorBox message={error}
                />)}

            <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-md overflow-hidden">
                    {profile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <IconUser className="w-10 h-10" />
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                    <h1 className="text-2xl font-bold text-brand-text">
                        {profile?.name} {profile?.surname}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                        {profile?.gym?.name && (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-600 border border-brand-100 dark:border-brand-500/20">
                                {profile.gym.name}
                            </span>
                        )}
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase border ${assignmentStatus === 'ASSIGNED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20'
                            }`}>
                            Durum: {assignmentStatus || 'UNASSIGNED'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3">Fiziksel Bilgiler</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                            <span className="text-xs text-slate-400 block mb-1">Yaş</span>
                            <span className="text-xl font-bold text-brand-text">{profile?.age ?? "-"}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                            <span className="text-xs text-slate-400 block mb-1">Boy (cm)</span>
                            <span className="text-xl font-bold text-brand-text">{profile?.height ?? "-"}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                            <span className="text-xs text-slate-400 block mb-1">Kilo (kg)</span>
                            <span className="text-xl font-bold text-brand-text">{profile?.weight ?? "-"}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-nav-border text-center">
                            <span className="text-xs text-slate-400 block mb-1">Cinsiyet</span>
                            <span className="text-xl font-bold text-brand-text">{profile?.gender ?? "-"}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Telefon Numarası</span>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text">
                            {profile?.phone || "Belirtilmemiş"}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sağlık Notları</span>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-nav-border text-sm text-brand-text min-h-20">
                            {profile?.medicalNotes || "Herhangi bir sağlık notu bulunmuyor."}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-brand-text border-b border-nav-border pb-3 mb-4">Eğitmenim</h2>
                        {trainer ? (
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold text-lg">
                                    {trainer.name?.[0]}{trainer.surname?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-text text-base">{trainer.name} {trainer.surname}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{trainer.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Henüz atanmış bir eğitmeniniz bulunmuyor.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
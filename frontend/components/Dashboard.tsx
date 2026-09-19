"use client";
import React from 'react'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LeftNavDataAthlete, LeftNavDataGym, LeftNavDataTrainer } from '@/config/dashboardConfig'
import Loading from '@/components/Loading'
import { NavItem } from '@/types/types';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    if (loading) return <Loading />;
    if (!user) return <p>Lütfen giriş yapın.</p>;

    const { name, surname, role, gymName } = user;


    // cereate left data as role
    let leftNavData: NavItem[];
    switch (role) {
        case "gym":
            leftNavData = LeftNavDataGym;
            break;
        case "trainer":
            leftNavData = LeftNavDataTrainer;
            break;
        case "member":
            leftNavData = LeftNavDataAthlete;
            break;
        default:
            leftNavData = [];
            break;
    }

    return (
        <div>
            <div className="flex">
                {/* LEFT SIDEBAR */}
                <aside className="  w-64 min-h-[calc(100vh-68px)]   bg-white dark:bg-nav-bg  border-nav-border shadow-sm transition-colors">
                    <div className="flex flex-col p-4 gap-2 ">
                        {leftNavData.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => router.push(item.route)}
                                className=" w-full cursor-pointer text-left px-4 py-3 rounded-xl text-brand-text font-medium transition-all hover:bg-brand-50 dark:hover:bg-brand-100 hover:text-brand-600 cursor-pointer"
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* CONTENT */}
                <main className="flex-1 p-1 space-y-6">
                    {/* WELCOME HEADER CARD */}
                    <div className="bg-white dark:bg-nav-bg border border-nav-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-text tracking-tight flex items-center gap-2">
                                <span>Hoş geldin,</span>
                                <span className="inline-block animate-bounce">👋</span>
                            </h2>

                            <p className="text-xl md:text-2xl font-bold text-brand-600">
                                {name} {surname}
                            </p>

                            {gymName && (
                                <div className="pt-2 flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-600 border border-brand-100 dark:border-brand-500/20">
                                        {gymName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* İsteğe bağlı sağ taraf için mini bir rozet veya tarih alanı ekleyebilirsin */}
                        <div className="hidden sm:block text-right">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Durum</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Aktif Eğitmen
                            </span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard

"use client";
import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { LeftNavDataAthlete, LeftNavDataGym, LeftNavDataTrainer } from '@/config/dashboardConfig';
import Loading from '@/components/Loading';
import { NavItem } from '@/types/types';

import { Sidebar } from '@/components/Sidebar'; 
import GymRiskAnalyticsContainer from '@/features/gym/dashboard/container/GymRiskAnalyticsContainer';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <p className="p-6 text-foreground/60 text-sm font-medium">Lütfen giriş yapın.</p>;

    const { name, surname, role, gymName } = user;

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

    const roleLabel = role === "trainer" ? "Aktif Antrenör" : role === "gym" ? "Salon Yöneticisi" : "Aktif Sporcu";

    return (
        <div className="min-h-[calc(100vh-68px)] bg-background flex flex-col md:flex-row transition-colors">
          
            <Sidebar navItems={leftNavData} />

           
            <main className="flex-1 p-6 md:p-8 lg:p-10 space-y-8 w-full max-w-7xl mx-auto">
                
                {/* 1. WELCOME HEADER CARD */}
                <section className="bg-nav-bg border border-nav-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-colors">
                    
                    <div className="space-y-2">
                        <h2 className="text-sm md:text-base font-bold text-brand-text uppercase tracking-widest flex items-center gap-2">
                            <span>HOŞ GELDİNİZ</span>
                            <span className="inline-block animate-bounce origin-bottom">👋</span>
                        </h2>

                        <p className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">
                            {name} {surname}
                        </p>

                        {gymName && (
                            <div className="pt-2 flex items-center gap-2">
                                <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-600 border border-brand-400/30">
                                    {gymName}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">
                            SİSTEM DURUMU
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {roleLabel}
                        </span>
                    </div>
                    
                </section>

                {/* ==========================================
                    2. DYNAMIC WIDGETS AREA
                ========================================== */}
                {role === "trainer" && (
                    <div className="space-y-8">
                        {/* Antrenör dashboard widget'ları buraya gelecek */}
                    </div>
                )}


                  {role === "gym" && (
                    <div className="space-y-8">
                        {/* Antrenör dashboard widget'ları buraya gelecek */}
                        <GymRiskAnalyticsContainer />
                    </div>
                )}

            </main>
        </div>
    );
}

export default Dashboard;
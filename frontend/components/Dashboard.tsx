"use client";
import React from 'react'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LeftNavDataAthlete, LeftNavDataGym, LeftNavDataTrainer } from '@/config/dashboardConfig'
import Loading from '@/components/Loading'

interface NavItem {
    name: string;
    route: string;
}

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
                <main className="flex-1 p-1">
                    <div className="px-2 py-4 border-b border-nav-border">
                        <h2 className="text-2xl font-bold text-brand-text">
                            Hoş geldin, 👋
                        </h2>

                        <p className="mt-2 text-lg font-medium text-brand-600">
                            {name} {surname}
                        </p>
                        <p> {gymName} </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
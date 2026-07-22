// src/app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { GymIcon, TrainerIcon, AthleteIcon, ArrowRightIcon } from "@/icons/icon";

interface PortalConfig {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  path: string;
}

const PORTALS: PortalConfig[] = [
  {
    icon: <GymIcon className="w-8 h-8" />,
    eyebrow: "Yönetim Paneli",
    title: "Salon Girişi",
    description: "Salon yöneticileri ve personel için özel kontrol merkezi.",
    label: "Gym Portal",
    path: "/login/gym",
  },
  {
    icon: <TrainerIcon className="w-8 h-8" />,
    eyebrow: "Eğitmen Paneli",
    title: "Antrenör Girişi",
    description: "Sporcularını yönet, program yaz ve gelişimleri takip et.",
    label: "Trainer Portal",
    path: "/login/trainer",
  },
  {
    icon: <AthleteIcon className="w-8 h-8" />,
    eyebrow: "Üye Paneli",
    title: "Sporcu Girişi",
    description: "Antrenman geçmişin, programların ve hızlı salon girişi.",
    label: "Athlete Portal",
    path: "/login/athlete",
  },
];

export default function LoginSelect() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-screen overflow-hidden select-none bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {PORTALS.map((portal) => (
        <div
          key={portal.path}
          onClick={() => router.push(portal.path)}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-nav-bg border-r border-nav-border last:border-r-0 hover:flex-[1.25] transition-all duration-700 ease-out group px-6 sm:px-10"
        >
          {/* Top Active Line Accent (Brand Orange) */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Background Watermark Icon (Subtle) */}
          <div className="absolute -bottom-20 -right-20 text-foreground opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none w-96 h-96 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
            {portal.icon}
          </div>

          {/* Icon Container - Concrete/Panel look */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--background)] shadow-nav border border-nav-border transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-brand-400 group-hover:text-brand-500">
            {portal.icon}
          </div>

          {/* Eyebrow Label */}
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3 text-brand-text opacity-80 transition-colors duration-300">
            {portal.eyebrow}
          </p>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center tracking-tight">
            {portal.title}
          </h2>

          {/* Description */}
          <p className="text-sm opacity-60 text-center max-w-[260px] leading-relaxed mb-10 font-normal transition-opacity duration-300 group-hover:opacity-90">
            {portal.description}
          </p>

          {/* Action Button Indicator */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--background)] border border-nav-border text-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:bg-brand-50 group-hover:border-brand-400 group-hover:text-brand-600 shadow-nav">
            <ArrowRightIcon className="transition-transform group-hover:scale-110" />
          </div>

          {/* Bottom Portal Label Tag */}
          <span className="absolute bottom-8 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 group-hover:text-brand-text group-hover:opacity-100 transition-all duration-300">
            {portal.label}
          </span>
        </div>
      ))}
    </main>
  );
}
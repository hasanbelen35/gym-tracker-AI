// src/app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {PortalData} from '@/types/types'

const PORTALS: PortalData[] = [
  {
    icon: "🏛️",
    eyebrow: "Yönetim Girişi",
    title: "Spor Salonu Girişi",
    description: "Salon yöneticileri ve personel için özel giriş paneli.",
    label: "Gym Portal",
    path: "/login/gym",
  },
  {
    icon: "🥇",
    eyebrow: "Antrenör Girişi",
    title: "Antrenör Girişi",
    description: "Sporcularını yönet, programlarını takip et ve giriş yap.",
    label: "Trainer Portal",
    path: "/login/trainer",
  },
  {
    icon: "🏋️",
    eyebrow: "Üye Girişi",
    title: "Sporcu Girişi",
    description: "Antrenman geçmişin ve QR kodunla hızlı giriş yap.",
    label: "Athlete Portal",
    path: "/login/athlete",
  },
];

export default function LoginSelect() {
  const router = useRouter();
  const [gym, trainer, athlete] = PORTALS;

  return (
    <main className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* LEFT GYM */}
      <div
        onClick={() => router.push(gym.path)}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden border-r border-[#D8DCEE] bg-[#EEF2FF] hover:flex-[1.15] transition-all duration-500 group"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[280px] h-[280px] rounded-full bg-[rgba(91,111,212,0.06)] pointer-events-none" />

        <span className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          {gym.icon}
        </span>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5B6FD4] mb-2"
           style={{ fontFamily: "'Syne', sans-serif" }}>
          {gym.eyebrow}
        </p>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-3 text-center px-6"
            style={{ fontFamily: "'Syne', sans-serif" }}>
          {gym.title}
        </h2>
        <p className="text-sm text-[#7A7A9A] text-center max-w-[200px] leading-relaxed">
          {gym.description}
        </p>
        <div className="mt-8 w-11 h-11 rounded-full flex items-center justify-center bg-[rgba(91,111,212,0.12)] border border-[rgba(91,111,212,0.25)] text-[#5B6FD4] transition-transform duration-300 group-hover:translate-x-1">
          →
        </div>
        <span className="absolute bottom-6 text-[10px] tracking-widest uppercase text-[#AAAFDB]">
          {gym.label}
        </span>
      </div>

      {/* MID TRAINER */}
      <div
        onClick={() => router.push(trainer.path)}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden border-r border-[#EAD9C4] bg-[#FFF6EC] hover:flex-[1.15] transition-all duration-500 group"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0A24E] to-[#E8823C]" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-[rgba(232,130,60,0.06)] pointer-events-none" />

        <span className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          {trainer.icon}
        </span>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8823C] mb-2"
           style={{ fontFamily: "'Syne', sans-serif" }}>
          {trainer.eyebrow}
        </p>
        <h2 className="text-2xl font-extrabold text-[#3A2415] mb-3 text-center px-6"
            style={{ fontFamily: "'Syne', sans-serif" }}>
          {trainer.title}
        </h2>
        <p className="text-sm text-[#8A6B4F] text-center max-w-[200px] leading-relaxed">
          {trainer.description}
        </p>
        <div className="mt-8 w-11 h-11 rounded-full flex items-center justify-center bg-[rgba(232,130,60,0.12)] border border-[rgba(232,130,60,0.25)] text-[#E8823C] transition-transform duration-300 group-hover:translate-x-1">
          →
        </div>
        <span className="absolute bottom-6 text-[10px] tracking-widest uppercase text-[#D9B48C]">
          {trainer.label}
        </span>
      </div>

      {/* RIGHT ATHLETE */}
      <div
        onClick={() => router.push(athlete.path)}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-[#EEFAF3] hover:flex-[1.15] transition-all duration-500 group"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E9E62] to-[#5CC98A]" />
        <div className="absolute top-[-100px] right-[-100px] w-[280px] h-[280px] rounded-full bg-[rgba(46,158,98,0.06)] pointer-events-none" />

        <span className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          {athlete.icon}
        </span>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2E9E62] mb-2"
           style={{ fontFamily: "'Syne', sans-serif" }}>
          {athlete.eyebrow}
        </p>
        <h2 className="text-2xl font-extrabold text-[#0F2D1A] mb-3 text-center px-6"
            style={{ fontFamily: "'Syne', sans-serif" }}>
          {athlete.title}
        </h2>
        <p className="text-sm text-[#4A7A5E] text-center max-w-[200px] leading-relaxed">
          {athlete.description}
        </p>
        <div className="mt-8 w-11 h-11 rounded-full flex items-center justify-center bg-[rgba(46,158,98,0.12)] border border-[rgba(46,158,98,0.25)] text-[#2E9E62] transition-transform duration-300 group-hover:translate-x-1">
          →
        </div>
        <span className="absolute bottom-6 text-[10px] tracking-widest uppercase text-[#7ABFA0]">
          {athlete.label}
        </span>
      </div>
    </main>
  );
}
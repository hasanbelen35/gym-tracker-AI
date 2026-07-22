// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@/icons/icon";

interface LandingAction {
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  path: string;
  iconSymbol: string;
}

const ACTIONS: LandingAction[] = [
  {
    eyebrow: "Yeni Hesap",
    title: "Kayıt Ol",
    description: "Sisteme ilk kez katılmak için hemen hesap oluşturun.",
    label: "Register",
    path: "/register",
    iconSymbol: "✍️",
  },
  {
    eyebrow: "Mevcut Hesap",
    title: "Giriş Yap",
    description: "Hesabınız varsa giriş yaparak panele ulaşın.",
    label: "Login",
    path: "/login",
    iconSymbol: "🔑",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-screen overflow-hidden select-none bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative">
      {ACTIONS.map((action, index) => (
        <div
          key={action.path}
          onClick={() => router.push(action.path)}
          className={`flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-nav-bg ${
            index === 0 ? "border-r border-nav-border" : ""
          } hover:flex-[1.25] transition-all duration-700 ease-out group px-6 sm:px-10`}
        >
          {/* Top Active Line Accent (Brand Orange) */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon Container - Concrete/Panel look */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--background)] shadow-nav border border-nav-border transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-brand-400 text-3xl">
            {action.iconSymbol}
          </div>

          {/* Eyebrow Label */}
          <p 
            className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3 text-brand-text opacity-80 transition-colors duration-300"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {action.eyebrow}
          </p>

          {/* Main Title */}
          <h2 
            className="text-2xl sm:text-3xl font-extrabold mb-4 text-center tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {action.title}
          </h2>

          {/* Description */}
          <p className="text-sm opacity-60 text-center max-w-[260px] leading-relaxed mb-10 font-normal transition-opacity duration-300 group-hover:opacity-90">
            {action.description}
          </p>

          {/* Action Button Indicator */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--background)] border border-nav-border text-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:bg-brand-50 group-hover:border-brand-400 group-hover:text-brand-600 shadow-nav">
            <ArrowRightIcon className="transition-transform group-hover:scale-110" />
          </div>

          {/* Bottom Portal Label Tag */}
          <span 
            className="absolute bottom-8 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 group-hover:text-brand-text group-hover:opacity-100 transition-all duration-300"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {action.label}
          </span>
        </div>
      ))}

      {/* Ortadaki "ya" Rozeti */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-nav-bg border border-nav-border shadow-nav text-xs font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
        ya
      </div>
    </main>
  );
}
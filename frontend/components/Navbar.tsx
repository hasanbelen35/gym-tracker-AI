"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { IconSun, IconMoon } from "@/icons/icon";

const CONFIG = {
  logoLetter: "G",
  brandName: "GymTracker",
  brandSuffix: "AI",
  searchPlaceholder: "Egzersiz, program veya kullanıcı ara...",
  themeToggleLabel: "Tema değiştir",
  profileMenuLabel: "Profil menüsü",
  logoutLabel: "Çıkış Yap",
  logoutErrorMessage: "Çıkış işlemi başarısız:",
};

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setIsMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(CONFIG.logoutErrorMessage, error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-nav-bg border-b border-nav-border shadow-nav transition-colors">

      {/* Logo + Rol Badge */}
      <div className="flex items-center gap-3 ">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">{CONFIG.logoLetter}</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-600 ">
            {CONFIG.brandName}<span className="text-brand-dark">{CONFIG.brandSuffix}</span>
          </span>
        </div>

        {user?.role && (
          <span
            className="px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide
                       bg-brand-50 dark:bg-brand-100/10 text-brand-600 border border-brand-100
                       dark:border-brand-100/20 uppercase"
          >
            {user.role}
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder={CONFIG.searchPlaceholder}
          className="w-full bg-white dark:bg-nav-bg border border-nav-border rounded-xl py-2 pl-4 pr-10
                     placeholder:text-slate-400 text-sm text-brand-text
                     focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                     transition-all"
        />
        <svg className="absolute right-3 top-2.5 w-4 h-4 text-brand-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
        </svg>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
          aria-label={CONFIG.themeToggleLabel}
        >
          {isDark ? (
            <IconMoon className="w-5 h-5" />
          ) : (
            <IconSun className="w-5 h-5" />
          )}
        </button>

        {/* Profile + Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-sm hover:from-brand-600 hover:to-brand-dark transition-all cursor-pointer"
            aria-label={CONFIG.profileMenuLabel}
            aria-expanded={isMenuOpen}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-nav-bg border border-nav-border
                         rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600
                           hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {CONFIG.logoutLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
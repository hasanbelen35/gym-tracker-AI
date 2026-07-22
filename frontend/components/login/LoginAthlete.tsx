// src/app/login/athlete/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loginMember, clearError } from "@/store/slices/authSlice";
import { AthleteIcon } from "@/icons/icon";

export default function LoginAthlete() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginMember(formData));
    if (loginMember.fulfilled.match(result)) {
      router.push("/dashboard/athlete");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-10 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />
      
      {/* Background Back Button */}
      <button 
        onClick={() => router.push("/login")} 
        className="absolute top-5 left-5 bg-nav-bg border border-nav-border rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--foreground)] hover:border-brand-400 transition flex items-center gap-1.5 shadow-nav"
      >
        ← Geri
      </button>

      <form onSubmit={handleLogin} className="bg-nav-bg border border-nav-border rounded-2xl p-10 w-full max-w-sm shadow-nav relative z-10">
        <div className="mb-4 inline-flex p-3 rounded-xl bg-[var(--background)] border border-nav-border text-brand-500">
          <AthleteIcon className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Üye Girişi</h1>
        <p className="text-sm opacity-60 mb-7">Hoş geldiniz, giriş yapın.</p>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">E-posta</label>
          <input 
            name="email" 
            type="email" 
            placeholder="uye@example.com"
            value={formData.email} 
            onChange={handleChange} 
            className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition" 
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Şifre</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••"
            value={formData.password} 
            onChange={handleChange} 
            className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition" 
            required 
          />
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-500 text-white font-bold text-sm tracking-wide hover:bg-brand-600 active:scale-[0.98] transition disabled:opacity-50 shadow-nav">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <p className="text-center text-xs opacity-50 mt-5">
          Hesabınız yok mu? <span onClick={() => router.push("/register/athlete")} className="text-brand-text font-medium cursor-pointer hover:underline">Hemen Kayıt Ol</span>
        </p>
      </form>
    </main>
  );
}
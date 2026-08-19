// src/app/register/athlete/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { registerMember, clearError } from "@/store/slices/authSlice";
import { fetchGymProfile } from "@/store/slices/gymSlice";
import { Gym } from "@/types/types";
import { AthleteIcon } from "@/icons/icon";

const CONFIG = {
  eyebrow: "Üye Kaydı",
  title: "Sporcu Kayıt",
  backPath: "/register",
  gymSelectPlaceholderLoading: "Yükleniyor...",
  gymSelectPlaceholder: "Salon seçin",
};

export default function AthleteRegister() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { profile: gyms, loading: gymsLoading } = useAppSelector((state) => state.gym);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    gymId: "",
    age: "",
    phone: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    if (!gyms || gyms.length === 0) {
      dispatch(fetchGymProfile());
    }
  }, [dispatch, gyms]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const payload = {
      ...formData,
      gymId: parseInt(formData.gymId),
      age: formData.age ? parseInt(formData.age) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    };

    const result = await dispatch(registerMember(payload as any));
    if (registerMember.fulfilled.match(result)) {
      router.push("/login/athlete");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-(--background) text-(--foreground) py-10 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />

      <button onClick={() => router.push(CONFIG.backPath)} className="absolute top-5 left-5 bg-nav-bg border border-nav-border rounded-xl px-3.5 py-2 text-xs font-medium text-(--foreground) hover:border-brand-400 transition flex items-center gap-1.5 shadow-nav">
        ← Geri
      </button>

      <form onSubmit={handleRegister} className="bg-nav-bg border border-nav-border rounded-2xl p-10 w-full max-w-sm shadow-nav relative z-10">
        <div className="mb-4 inline-flex p-3 rounded-xl bg-(--background) border border-nav-border text-brand-500">
          <AthleteIcon className="w-8 h-8" />
        </div>
        
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-text mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{CONFIG.eyebrow}</p>
        <h1 className="text-2xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>{CONFIG.title}</h1>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium opacity-80 mb-1.5">Ad <span className="text-brand-text">*</span></label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3 text-sm text-(--foreground) outline-none focus:border-brand-400 transition" required />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium opacity-80 mb-1.5">Soyad <span className="text-brand-text">*</span></label>
            <input name="surname" type="text" value={formData.surname} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3 text-sm text-(--foreground) outline-none focus:border-brand-400 transition" required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">E-posta <span className="text-brand-text">*</span></label>
          <input name="email" type="email" placeholder="sporcu@example.com" value={formData.email} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3.5 text-sm text-(--foreground) outline-none focus:border-brand-400 transition" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Şifre <span className="text-brand-text">*</span></label>
          <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3.5 text-sm text-(--foreground) outline-none focus:border-brand-400 transition" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Spor Salonu <span className="text-brand-text">*</span></label>
          <select
            name="gymId"
            value={formData.gymId}
            onChange={handleChange}
            className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3.5 text-sm text-(--foreground) outline-none focus:border-brand-400 transition"
            required
          >
            <option value="" disabled>
              {gymsLoading ? CONFIG.gymSelectPlaceholderLoading : CONFIG.gymSelectPlaceholder}
            </option>
            {Array.isArray(gyms) &&
              gyms.map((gym: Gym) => (
                <option key={gym.id} value={gym.id} className="bg-(--background) text-(--foreground)">
                  {gym.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-xs font-medium opacity-80 mb-1.5">Yaş</label>
            <input name="age" type="number" value={formData.age} onChange={handleChange} onWheel={(e) => e.currentTarget.blur()} className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3 text-sm text-(--foreground) outline-none focus:border-brand-400 transition" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium opacity-80 mb-1.5">Telefon</label>
            <input name="phone" type="tel" placeholder="0500..." value={formData.phone} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3 text-sm text-(--foreground) outline-none focus:border-brand-400 transition" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-500 text-white font-bold text-sm tracking-wide hover:bg-brand-600 active:scale-[0.98] transition disabled:opacity-50 shadow-nav">
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>

        <p className="text-center text-xs opacity-50 mt-5">
          Zaten hesabınız var mı? <span onClick={() => router.push("/login/athlete")} className="text-brand-text font-medium cursor-pointer hover:underline">Giriş Yap</span>
        </p>
      </form>
    </main>
  );
}
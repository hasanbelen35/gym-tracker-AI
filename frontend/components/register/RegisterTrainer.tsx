// src/app/register/trainer/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { fetchGymProfile } from "@/store/slices/gymSlice";
import { registerTrainer } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Gym } from "@/types/types";
import { TrainerIcon } from "@/icons/icon";

export default function RegisterTrainer() {
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      gymId: Number(formData.gymId),
    };

    const result = await dispatch(registerTrainer(payload));

    if (registerTrainer.fulfilled.match(result)) {
      router.push("/login/trainer");
    }
  };

  useEffect(() => {
    if (!gyms || gyms.length === 0) {
      dispatch(fetchGymProfile());
    }
  }, [dispatch, gyms]);

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-10 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />

      <button onClick={() => router.push("/register")} className="absolute top-5 left-5 bg-nav-bg border border-nav-border rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--foreground)] hover:border-brand-400 transition flex items-center gap-1.5 shadow-nav">
        ← Geri
      </button>

      <form onSubmit={handleSubmit} className="bg-nav-bg border border-nav-border rounded-2xl p-10 w-full max-w-sm shadow-nav relative z-10">
        <div className="mb-4 inline-flex p-3 rounded-xl bg-[var(--background)] border border-nav-border text-brand-500">
          <TrainerIcon className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Antrenör Kaydı</h1>
        <p className="text-sm opacity-60 mb-6">Bilgilerinizi girerek kayıt olun.</p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Ad</label>
          <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Soyad</label>
          <input name="surname" type="text" value={formData.surname} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">E-posta</label>
          <input name="email" type="email" placeholder="antrenor@example.com" value={formData.email} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Şifre</label>
          <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition" required />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium opacity-80 mb-1.5">Spor Salonu <span className="text-brand-text">*</span></label>
          <select
            name="gymId"
            value={formData.gymId}
            onChange={handleChange}
            className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition"
            required
          >
            <option value="" disabled>
              {gymsLoading ? "Yükleniyor..." : "Salon seçin"}
            </option>
            {Array.isArray(gyms) &&
              gyms.map((gym: Gym) => (
                <option key={gym.id} value={gym.id} className="bg-[var(--background)] text-[var(--foreground)]">
                  {gym.name}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-500 text-white font-bold text-sm tracking-wide hover:bg-brand-600 active:scale-[0.98] transition disabled:opacity-50 shadow-nav">
          {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
        </button>

        <p className="text-center text-xs opacity-50 mt-5">
          Zaten hesabınız var mı? <span onClick={() => router.push("/login/trainer")} className="text-brand-text font-medium cursor-pointer hover:underline">Giriş Yap</span>
        </p>
      </form>
    </main>
  );
}
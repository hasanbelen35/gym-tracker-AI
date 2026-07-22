// src/app/register/gym/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { registerGym, clearError } from "@/store/slices/authSlice";
import { GymIcon } from "@/icons/icon";

export default function GymRegister() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerGym(formData));
    if (registerGym.fulfilled.match(result)) {
      router.push("/login/gym");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-10 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />

      <button onClick={() => router.push("/register")} className="absolute top-5 left-5 bg-nav-bg border border-nav-border rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--foreground)] hover:border-brand-400 transition flex items-center gap-1.5 shadow-nav">
        ← Geri
      </button>

      <form onSubmit={handleRegister} className="bg-nav-bg border border-nav-border rounded-2xl p-10 w-full max-w-sm shadow-nav relative z-10">
        <div className="mb-4 inline-flex p-3 rounded-xl bg-[var(--background)] border border-nav-border text-brand-500">
          <GymIcon className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Spor Salonu Kayıt</h1>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        {["name", "email", "password", "address", "phone"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-xs font-medium opacity-80 mb-1.5 capitalize">
              {field === "name" ? "Salon Adı" : field === "email" ? "E-posta" : field === "password" ? "Şifre" : field === "address" ? "Adres" : "Telefon"}
            </label>
            <input
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              placeholder={field === "email" ? "salon@example.com" : field === "password" ? "••••••••" : ""}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="w-full h-11 rounded-xl border border-nav-border bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] outline-none focus:border-brand-400 transition"
              required={field === "name" || field === "email" || field === "password"}
            />
          </div>
        ))}

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-500 text-white font-bold text-sm tracking-wide mt-2 hover:bg-brand-600 active:scale-[0.98] transition disabled:opacity-50 shadow-nav">
          {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
        </button>

        <p className="text-center text-xs opacity-50 mt-5">
          Zaten hesabınız var mı? <span onClick={() => router.push("/login/gym")} className="text-brand-text font-medium cursor-pointer hover:underline">Giriş Yap</span>
        </p>
      </form>
    </main>
  );
}
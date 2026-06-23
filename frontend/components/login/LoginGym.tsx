"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loginGym, clearError } from "@/store/slices/authSlice";

export default function GymLogin() {
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
    const result = await dispatch(loginGym(formData));
    
    if (loginGym.fulfilled.match(result)) {
      router.push("/dashboard/gym");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#EEF2FF] py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[320px] h-[320px] rounded-full bg-[rgba(91,111,212,0.06)] pointer-events-none" />
      <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[rgba(91,111,212,0.04)] pointer-events-none" />

      <button onClick={() => router.push("/")} className="absolute top-5 left-5 bg-white/80 border border-[#D8DCEE] rounded-lg px-3 py-1.5 text-xs font-medium text-[#5B6FD4] hover:bg-white transition flex items-center gap-1.5">
        ← Geri
      </button>

      <form onSubmit={handleLogin} className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(91,111,212,0.08)] relative z-10">
        <span className="text-4xl mb-4 block">🔑</span>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Spor Salonu Girişi</h1>
        <p className="text-sm text-[#9A9AB0] mb-7">Hesabınıza giriş yaparak başlayın.</p>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#6B6B8A] mb-1.5">E-posta</label>
          <input
            name="email"
            type="email"
            placeholder="salon@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-11 rounded-xl border-[1.5px] border-[#E0E3F5] bg-[#F8F9FF] px-3.5 text-sm text-[#1A1A2E] outline-none focus:border-[#7B8FE8] focus:ring-2 focus:ring-[#5B6FD4]/10 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-[#6B6B8A] mb-1.5">Şifre</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-11 rounded-xl border-[1.5px] border-[#E0E3F5] bg-[#F8F9FF] px-3.5 text-sm text-[#1A1A2E] outline-none focus:border-[#7B8FE8] focus:ring-2 focus:ring-[#5B6FD4]/10 transition"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4] text-white font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <p className="text-center text-xs text-[#AAAFDB] mt-5">
          Hesabınız yok mu? <span onClick={() => router.push("/register/gym")} className="text-[#5B6FD4] font-medium cursor-pointer hover:underline">Hemen Kayıt Ol</span>
        </p>
      </form>
    </main>
  );
}
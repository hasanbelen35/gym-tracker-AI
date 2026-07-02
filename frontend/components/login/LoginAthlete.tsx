"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loginMember, clearError } from "@/store/slices/authSlice";

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
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#EEF2FF] py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4]" />
      <form onSubmit={handleLogin} className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(91,111,212,0.08)] relative z-10">
        <span className="text-4xl mb-4 block">🔑</span>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Üye Girişi</h1>
        <p className="text-sm text-[#9A9AB0] mb-7">Hoş geldiniz, giriş yapın.</p>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#6B6B8A] mb-1.5">E-posta</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#E0E3F5] bg-[#F8F9FF] px-3.5 text-sm" required />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-medium text-[#6B6B8A] mb-1.5">Şifre</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#E0E3F5] bg-[#F8F9FF] px-3.5 text-sm" required />
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4] text-white font-bold text-sm tracking-wide hover:opacity-90 transition disabled:opacity-50">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </main>
  );
}
"use client";
import { useRouter } from "next/navigation";
import { loginTrainer } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useState } from "react";

const LoginTrainer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(loginTrainer(formData));

    if (loginTrainer.fulfilled.match(result)) {
      router.push("/dashboard/trainer");
    }
  };

  return (
    <div>
      <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#FFF6EC] py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0A24E] to-[#E8823C]" />
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(232,130,60,0.08)] relative z-10">
          <span className="text-4xl mb-4 block">🥇</span>
          <h1 className="text-2xl font-extrabold text-[#3A2415] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Antrenör Girişi</h1>
          <p className="text-sm text-[#B0977E] mb-7">Hoş geldiniz, giriş yapın.</p>

          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">E-posta</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">Şifre</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
          </div>

          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F0A24E] to-[#E8823C] text-white font-bold text-sm tracking-wide hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginTrainer;
"use client";
import { fetchGymProfile } from "@/store/slices/gymSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

interface Gym {
  id: number;
  name: string;
}

export default function RegisterTrainer() {
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

  useEffect(() => {
    if (!gyms || gyms.length === 0) {
      dispatch(fetchGymProfile());
    }
  }, [dispatch, gyms]);

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#FFF6EC] py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#F0A24E] to-[#E8823C]" />
      <form className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(232,130,60,0.08)] relative z-10">
        <span className="text-4xl mb-4 block">🥇</span>
        <h1 className="text-2xl font-extrabold text-[#3A2415] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Antrenör Kaydı</h1>
        <p className="text-sm text-[#B0977E] mb-7">Bilgilerinizi girerek kayıt olun.</p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">Ad</label>
          <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">Soyad</label>
          <input name="surname" type="text" value={formData.surname} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">E-posta</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">Şifre</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Spor Salonu <span className="text-[#2E9E62]">*</span></label>
          <select
            name="gymId"
            value={formData.gymId}
            onChange={handleChange}
            className="w-full text-black h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3.5 text-sm outline-none focus:border-[#2E9E62] transition"
            required
          >
            <option value="" disabled>
              {gymsLoading ? "Yükleniyor..." : "Salon seçin"}
            </option>
            {Array.isArray(gyms) &&
              gyms.map((gym: Gym) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" className="w-full h-11 rounded-xl bg-linear-to-r from-[#F0A24E] to-[#E8823C] text-white font-bold text-sm tracking-wide hover:opacity-90 transition">
          Kayıt Ol
        </button>
      </form>
    </main>
  );
}
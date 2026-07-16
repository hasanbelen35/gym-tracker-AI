"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { registerMember, clearError } from "@/store/slices/authSlice";
import { fetchGymProfile } from "@/store/slices/gymSlice";

interface Gym {
  id: string | number;
  name: string;
}

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
    dispatch(fetchGymProfile());
  }, [dispatch]);

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
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
    };

    const result = await dispatch(registerMember(payload));
    if (registerMember.fulfilled.match(result)) {
      router.push("/login/athlete");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#EEFAF3] py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E9E62] to-[#5CC98A]" />
      <div className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] rounded-full bg-[rgba(46,158,98,0.06)] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[240px] h-[240px] rounded-full bg-[rgba(46,158,98,0.04)] pointer-events-none" />

      <button onClick={() => router.push("/login")} className="absolute top-5 left-5 bg-white/80 border border-[#C5E8D5] rounded-lg px-3 py-1.5 text-xs font-medium text-[#2E9E62] hover:bg-white transition flex items-center gap-1.5">
        ← Geri
      </button>

      <form onSubmit={handleRegister} className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(46,158,98,0.08)] relative z-10">
        <span className="text-4xl mb-4 block">🏋️</span>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2E9E62] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Üye Kaydı</p>
        <h1 className="text-2xl font-extrabold text-[#0F2D1A] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Sporcu Kayıt</h1>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Ad <span className="text-[#2E9E62]">*</span></label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full h-11 text-black rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm outline-none focus:border-[#2E9E62] transition" required />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Soyad <span className="text-[#2E9E62]">*</span></label>
            <input name="surname" type="text" value={formData.surname} onChange={handleChange} className="w-full text-black h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm outline-none focus:border-[#2E9E62] transition" required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#3A7055] mb-1.5">E-posta <span className="text-[#2E9E62]">*</span></label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full text-black h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3.5 text-sm outline-none focus:border-[#2E9E62] transition" required />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Şifre <span className="text-[#2E9E62]">*</span></label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full text-black h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3.5 text-sm outline-none focus:border-[#2E9E62] transition" required />
        </div>

        <div className="mb-4">
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

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Yaş</label>
            <input name="age" type="number" value={formData.age} onChange={handleChange} onWheel={(e) => e.currentTarget.blur()} className="w-full text-black h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm outline-none focus:border-[#2E9E62] transition" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Telefon</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full text-black h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm outline-none focus:border-[#2E9E62] transition" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3CB574] to-[#2E9E62] text-white font-bold text-sm tracking-wide mt-5 hover:opacity-90 transition disabled:opacity-50">
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>
    </main>
  );
}
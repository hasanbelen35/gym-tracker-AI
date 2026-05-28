"use client";
import { useRouter } from "next/navigation";

export default function AthleteRegister() {
  const router = useRouter();

  return (
    <main
      className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#EEFAF3] py-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E9E62] to-[#5CC98A]" />
      <div className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] rounded-full bg-[rgba(46,158,98,0.06)] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[240px] h-[240px] rounded-full bg-[rgba(46,158,98,0.04)] pointer-events-none" />

      <button
        onClick={() => router.push("/login")}
        className="absolute top-5 left-5 bg-white/80 border border-[#C5E8D5] rounded-lg px-3 py-1.5 text-xs font-medium text-[#2E9E62] hover:bg-white transition flex items-center gap-1.5"
      >
        ← Geri
      </button>

      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(46,158,98,0.08)] relative z-10">
        <span className="text-4xl mb-4 block">🏋️</span>

        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2E9E62] mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Üye Kaydı
        </p>
        <h1
          className="text-2xl font-extrabold text-[#0F2D1A] mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Sporcu Kayıt
        </h1>
        <p className="text-sm text-[#5A8870] mb-7 leading-relaxed">
          Antrenman takibine başlamak için kayıt ol.
        </p>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">
              Ad <span className="text-[#2E9E62]">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Adınız"
              className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">
              Soyad <span className="text-[#2E9E62]">*</span>
            </label>
            <input
              name="surname"
              type="text"
              placeholder="Soyadınız"
              className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#3A7055] mb-1.5">
            E-posta <span className="text-[#2E9E62]">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="sporcu@example.com"
            className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3.5 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#3A7055] mb-1.5">
            Şifre <span className="text-[#2E9E62]">*</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3.5 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#3A7055] mb-1.5">
            Salon ID <span className="text-[#2E9E62]">*</span>
          </label>
          <input
            name="gymId"
            type="number"
            placeholder="Salonunuzun ID numarası"
            className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3.5 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
          />
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Yaş</label>
            <input
              name="age"
              type="number"
              placeholder="25"
              className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Telefon</label>
            <input
              name="phone"
              type="tel"
              placeholder="05XX XXX XX XX"
              className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Boy (cm)</label>
            <input
              name="height"
              type="number"
              placeholder="175"
              className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#3A7055] mb-1.5">Kilo (kg)</label>
            <input
              name="weight"
              type="number"
              placeholder="70"
              className="w-full h-11 rounded-xl border-[1.5px] border-[#C5E8D5] bg-[#F5FDF8] px-3 text-sm text-[#0F2D1A] outline-none focus:border-[#2E9E62] focus:ring-2 focus:ring-[#2E9E62]/10 transition placeholder:text-[#A8C8B8]"
            />
          </div>
        </div>

        <button
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3CB574] to-[#2E9E62] text-white font-bold text-sm tracking-wide mt-5 hover:opacity-90 active:scale-[0.98] transition"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Kayıt Ol
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#D5EEE2]" />
          <span className="text-xs text-[#9ABFAC]">veya</span>
          <div className="flex-1 h-px bg-[#D5EEE2]" />
        </div>

        <p className="text-center text-xs text-[#9ABFAC]">
          Zaten hesabınız var mı?{" "}
          <span
            onClick={() => router.push("/login/athlete")}
            className="text-[#2E9E62] font-medium cursor-pointer hover:underline"
          >
            Giriş Yap
          </span>
        </p>
      </div>
    </main>
  );
}
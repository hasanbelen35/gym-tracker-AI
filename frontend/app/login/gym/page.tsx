"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GymLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main
      className="flex h-screen items-center justify-center relative overflow-hidden bg-[#EEF2FF]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[320px] h-[320px] rounded-full bg-[rgba(91,111,212,0.06)] pointer-events-none" />
      <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[rgba(91,111,212,0.04)] pointer-events-none" />

      <button
        onClick={() => router.push("/login")}
        className="absolute top-5 left-5 bg-white/80 border border-[#D8DCEE] rounded-lg px-3 py-1.5 text-xs font-medium text-[#5B6FD4] hover:bg-white transition flex items-center gap-1.5"
      >
        ← Geri
      </button>

      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(91,111,212,0.08)] relative z-10">
        <span className="text-4xl mb-4 block">🏛️</span>

        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5B6FD4] mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Yönetim Girişi
        </p>
        <h1
          className="text-2xl font-extrabold text-[#1A1A2E] mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Spor Salonu Girişi
        </h1>
        <p className="text-sm text-[#9A9AB0] mb-7 leading-relaxed">
          Salon panelinize erişmek için giriş yapın.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#6B6B8A] mb-1.5">
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="salon@example.com"
            className="w-full h-11 rounded-xl border-[1.5px] border-[#E0E3F5] bg-[#F8F9FF] px-3.5 text-sm text-[#1A1A2E] outline-none focus:border-[#7B8FE8] focus:ring-2 focus:ring-[#5B6FD4]/10 transition placeholder:text-[#C0C3DC]"
          />
        </div>

        <div className="mb-1">
          <label className="block text-xs font-medium text-[#6B6B8A] mb-1.5">
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-11 rounded-xl border-[1.5px] border-[#E0E3F5] bg-[#F8F9FF] px-3.5 text-sm text-[#1A1A2E] outline-none focus:border-[#7B8FE8] focus:ring-2 focus:ring-[#5B6FD4]/10 transition placeholder:text-[#C0C3DC]"
          />
        </div>

        <div className="text-right mb-2">
          <span className="text-xs text-[#5B6FD4] cursor-pointer hover:underline">
            Şifremi unuttum
          </span>
        </div>

        <button
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4] text-white font-bold text-sm tracking-wide mt-2 hover:opacity-90 active:scale-[0.98] transition"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Giriş Yap
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E8EAF5]" />
          <span className="text-xs text-[#AAAFDB]">veya</span>
          <div className="flex-1 h-px bg-[#E8EAF5]" />
        </div>

        <p className="text-center text-xs text-[#AAAFDB]">
          Hesabınız yok mu?{" "}
          <span
            onClick={() => router.push("/register/gym")}
            className="text-[#5B6FD4] font-medium cursor-pointer hover:underline"
          >
            Kayıt Ol
          </span>
        </p>
      </div>
    </main>
  );
}
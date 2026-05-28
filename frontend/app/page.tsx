"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* SOL - Kayıt Ol */}
      <div
        onClick={() => router.push("/register")}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-[#EEF2FF] border-r border-[#D8DCEE] hover:flex-[1.3] transition-all duration-500 group"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B8FE8] to-[#5B6FD4]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[280px] h-[280px] rounded-full bg-[rgba(91,111,212,0.06)] pointer-events-none" />

        <span className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          ✍️
        </span>
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5B6FD4] mb-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Yeni Hesap
        </p>
        <h2
          className="text-2xl font-extrabold text-[#1A1A2E] mb-3 text-center px-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Kayıt Ol
        </h2>
        <p className="text-sm text-[#7A7A9A] text-center max-w-[200px] leading-relaxed">
          Sisteme ilk kez katılmak için hesap oluşturun.
        </p>
        <div className="mt-8 w-11 h-11 rounded-full flex items-center justify-center bg-[rgba(91,111,212,0.12)] border border-[rgba(91,111,212,0.25)] text-[#5B6FD4] transition-transform duration-300 group-hover:translate-x-1 text-lg">
          →
        </div>
        <span
          className="absolute bottom-6 text-[10px] tracking-widest uppercase text-[#AAAFDB]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Register
        </span>
      </div>

      {/* ORTA AYRAÇ */}
      <div className="relative z-10 pointer-events-none w-0">
        <div className="absolute left-0 top-[22%] -translate-x-1/2 w-px h-[55%] bg-gradient-to-b from-transparent via-[#CCC] to-transparent" />
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#DDD] flex items-center justify-center text-[11px] text-[#999]">
          ya
        </div>
      </div>

      {/* SAĞ - Giriş Yap */}
      <div
        onClick={() => router.push("/login")}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-[#EEFAF3] hover:flex-[1.3] transition-all duration-500 group"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E9E62] to-[#5CC98A]" />
        <div className="absolute top-[-100px] right-[-100px] w-[280px] h-[280px] rounded-full bg-[rgba(46,158,98,0.06)] pointer-events-none" />

        <span className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          🔑
        </span>
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2E9E62] mb-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Mevcut Hesap
        </p>
        <h2
          className="text-2xl font-extrabold text-[#0F2D1A] mb-3 text-center px-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Giriş Yap
        </h2>
        <p className="text-sm text-[#4A7A5E] text-center max-w-[200px] leading-relaxed">
          Hesabınız varsa hemen giriş yaparak devam edin.
        </p>
        <div className="mt-8 w-11 h-11 rounded-full flex items-center justify-center bg-[rgba(46,158,98,0.12)] border border-[rgba(46,158,98,0.25)] text-[#2E9E62] transition-transform duration-300 group-hover:translate-x-1 text-lg">
          →
        </div>
        <span
          className="absolute bottom-6 text-[10px] tracking-widest uppercase text-[#7ABFA0]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Login
        </span>
      </div>
    </main>
  );
}
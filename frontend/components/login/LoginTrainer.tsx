import React from 'react'

const LoginTrainer = () => {
    return (
        <div>
            <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#FFF6EC] py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0A24E] to-[#E8823C]" />
                <form className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-[0_4px_40px_rgba(232,130,60,0.08)] relative z-10">
                    <span className="text-4xl mb-4 block">🥇</span>
                    <h1 className="text-2xl font-extrabold text-[#3A2415] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Antrenör Girişi</h1>
                    <p className="text-sm text-[#B0977E] mb-7">Hoş geldiniz, giriş yapın.</p>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">E-posta</label>
                        <input name="email" type="email" className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-medium text-[#8A6B4F] mb-1.5">Şifre</label>
                        <input name="password" type="password" className="w-full h-11 rounded-xl border-[1.5px] border-[#F0DFC9] bg-[#FFFAF3] px-3.5 text-sm" required />
                    </div>

                    <button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F0A24E] to-[#E8823C] text-white font-bold text-sm tracking-wide hover:opacity-90 transition">
                        Giriş Yap
                    </button>
                </form>
            </main>
        </div>
    )
}

export default LoginTrainer

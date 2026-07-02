// src/app/dashboard/page.tsx
"use client";

import { Navbar } from "@/components/Navbar";


import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Yükleniyor...</p>;
  if (!user) return <p>Lütfen giriş yapın.</p>;

  return (
    <div>
      <Navbar />
      <div className="bg-black text-white  ">
        <h1>Merhaba, {user.name} {user.surname} 👋</h1>
        <p>Rolünüz: {user.role}</p>

        {user.role === "gym" && (
          <button>Salon İstatistiklerini Görüntüle</button>
        )}
      </div>

    </div>
  );
}
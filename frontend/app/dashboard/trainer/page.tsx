// src/app/dashboard/page.tsx
"use client";

import Dashboard from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";


import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Yükleniyor...</p>;
  if (!user) return <p>Lütfen giriş yapın.</p>;

  return (
    <div>
      <Navbar />
      <Dashboard />
    </div>
  );
}
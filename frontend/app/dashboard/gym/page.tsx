// src/app/dashboard/page.tsx
"use client";

import Dashboard from "@/components/Dashboard";
import Loading from '@/components/Loading'

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <p>Lütfen giriş yapın.</p>;

  return (
    <div>
      <Dashboard />
    </div>
  );
}


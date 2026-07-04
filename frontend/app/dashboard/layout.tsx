"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const ROLE_TO_ROUTE: Record<string, string> = {
  gym: "gym",
  member: "athlete",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;

    const expectedSegment = ROLE_TO_ROUTE[user.role];
    const currentSegment = pathname.split("/")[2];

    if (expectedSegment && currentSegment && currentSegment !== expectedSegment) {
      router.replace(`/dashboard/${expectedSegment}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) return <p>Yükleniyor...</p>;
  if (!user) return <p>Lütfen giriş yapın.</p>;

  const expectedSegment = ROLE_TO_ROUTE[user.role];
  const currentSegment = pathname.split("/")[2];

  if (expectedSegment && currentSegment && currentSegment !== expectedSegment) {
    return null;
  }

  return <>{children}</>;
}
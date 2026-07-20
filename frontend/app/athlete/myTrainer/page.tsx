"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMyTrainer } from "@/store/slices/memberSlice";

export default function MemberDashboardPage() {
  const dispatch = useAppDispatch();
  const { trainer, assignmentStatus, loading, error } = useAppSelector((state) => state.member);

  useEffect(() => {
    dispatch(fetchMyTrainer());
  }, [dispatch]);

  // Duruma göre dinamik badge (etiket) tasarımı döndüren fonksiyon
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "ASSIGNED":
        return (
          <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Atandı (ASSIGNED)
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            Onay Bekliyor (PENDING)
          </span>
        );
      case "UNASSIGNED":
      default:
        return (
          <span className="inline-block mt-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
            Atanmamış (UNASSIGNED)
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sporcu Paneli</h1>

      {/* Eğitmen Durumu Kartı */}
      <div className="border rounded-lg p-6 shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Eğitmenim</h2>

        {loading && <p className="text-blue-500">Eğitmen bilgileri yükleniyor...</p>}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && trainer ? (
          <div className="space-y-2">
            <p className="text-gray-800">
              <span className="font-medium">Ad Soyad:</span> {trainer.name} {trainer.surname}
            </p>
            <p className="text-gray-800">
              <span className="font-medium">E-posta:</span> {trainer.email}
            </p>
            <div>{getStatusBadge(assignmentStatus)}</div>
          </div>
        ) : (
          !loading && !error && (
            <div className="space-y-2">
              <p className="text-gray-500 italic">Şu anda atanmış bir eğitmeniniz bulunmuyor.</p>
              <div>{getStatusBadge(assignmentStatus)}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
"use client";
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllTrainers } from "@/store/slices/gymSlice";

const Trainers = () => {
  const dispatch = useAppDispatch();
  const { trainers, trainersLoading, trainersError } = useAppSelector((state) => state.gym);

  useEffect(() => {
    if (!trainers || trainers.length === 0) {
      dispatch(fetchAllTrainers());
    }
  }, [dispatch, trainers]);

  if (trainersLoading) return <p>Yükleniyor...</p>;
  if (trainersError) return <p className="text-red-500">{trainersError}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Antrenörler</h2>

      {(!trainers || trainers.length === 0) ? (
        <p className="text-gray-500">Kayıtlı antrenör bulunamadı.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Ad</th>
                <th className="px-4 py-3">Soyad</th>
                <th className="px-4 py-3">E-posta</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {trainers.map((trainer: any) => (
                <tr key={trainer.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{trainer.name}</td>
                  <td className="px-4 py-3">{trainer.surname}</td>
                  <td className="px-4 py-3">{trainer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Trainers
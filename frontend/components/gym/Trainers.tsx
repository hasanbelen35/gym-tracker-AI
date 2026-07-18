"use client";
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllTrainers, removeTrainerFromGym } from "@/store/slices/gymSlice";
import ConfirmModal from "@/components/ConfirmModel";

const Trainers = () => {
  const dispatch = useAppDispatch();
  const { trainers, trainersLoading, trainersError } = useAppSelector((state) => state.gym);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trainerToDelete, setTrainerToDelete] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!trainers || trainers.length === 0) {
      dispatch(fetchAllTrainers());
    }
  }, [dispatch, trainers]);

  const handleConfirmDelete = async () => {
    if (!trainerToDelete) return;

    setDeletingId(trainerToDelete.id);
    try {
      await dispatch(removeTrainerFromGym(trainerToDelete.id)).unwrap();
    } catch (err) {
      console.error("Antrenör silinemedi:", err);
    } finally {
      setDeletingId(null);
      setTrainerToDelete(null);
    }
  };

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
                <th className="px-4 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {trainers.map((trainer: any) => (
                <tr key={trainer.id} className="border-t border-gray-100 hover:bg-brand-100">
                  <td className="px-4 py-3">{trainer.name}</td>
                  <td className="px-4 py-3">{trainer.surname}</td>
                  <td className="px-4 py-3">{trainer.email}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setTrainerToDelete(trainer)}
                      disabled={deletingId === trainer.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    >
                      {deletingId === trainer.id ? "Siliniyor..." : "Sil"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* CONFIRM MODEL */}
      <ConfirmModal
        isOpen={!!trainerToDelete}
        title="Emin misiniz?"
        message={
          trainerToDelete
            ? `${trainerToDelete.name} ${trainerToDelete.surname} adlı antrenörü salondan silmek üzeresiniz. Bu işlem geri alınamaz.`
            : ""
        }
        loading={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTrainerToDelete(null)}
      />
    </div>
  )
}

export default Trainers
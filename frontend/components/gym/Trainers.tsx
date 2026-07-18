/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllTrainers, removeTrainerFromGym } from "@/store/slices/gymSlice";
import ConfirmModal from "@/components/ConfirmModel";

const Trainers = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { trainers, trainersLoading, trainersError } = useAppSelector((state) => state.gym);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trainerToDelete, setTrainerToDelete] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (trainers.length === 0) {
      dispatch(fetchAllTrainers());
    }
  }, [dispatch, trainers.length]);

  const handleConfirmDelete = async () => {
    if (!trainerToDelete) return;
    setDeletingId(trainerToDelete.publicId);
    try {
      await dispatch(removeTrainerFromGym(trainerToDelete.publicId)).unwrap();
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
      <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white mb-6">Antrenörler</h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-[#25253A] text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Soyad</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer: any) => (
              <tr
                key={trainer.publicId}
                onClick={() => router.push(`/gym/trainers/${trainer.publicId}`)}
                className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1f1f33] cursor-pointer"
              >
                <td className="px-4 py-3">{trainer.name}</td>
                <td className="px-4 py-3">{trainer.surname}</td>
                <td className="px-4 py-3">{trainer.email}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setTrainerToDelete(trainer); }}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!trainerToDelete}
        title="Antrenörü Sil"
        message={`${trainerToDelete?.name} ${trainerToDelete?.surname} adlı antrenörü silmek üzeresiniz. Bu işlem geri alınamaz.`}
        loading={!!deletingId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTrainerToDelete(null)}
      />
    </div>
  );
};

export default Trainers;
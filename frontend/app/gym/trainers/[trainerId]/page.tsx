"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchTrainerDetail, clearTrainerDetail } from "@/store/slices/gymSlice";
import Loading from '@/components/Loading'

export default function TrainerDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const trainerPublicId = params.trainerId as string;

  const { trainerDetail, trainerDetailLoading, trainerDetailError } = useAppSelector((state) => state.gym);

  useEffect(() => {
    if (trainerPublicId) {
      dispatch(fetchTrainerDetail(trainerPublicId));
    }
    return () => { dispatch(clearTrainerDetail()); };
  }, [dispatch, trainerPublicId]);

  if (trainerDetailLoading) return <Loading />;
  if (!trainerDetail) return null;

  return (
    <div className="p-6 max-w-2xl">
      <button onClick={() => router.back()} className="mb-6 text-sm text-gray-500 hover:text-gray-800">← Antrenörlere Geri Dön</button>
      
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl p-8 shadow-sm border dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">
          {trainerDetail.name} {trainerDetail.surname}
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b dark:border-gray-800">
            <span className="text-gray-500">E-posta</span>
            <span className="font-medium dark:text-white">{trainerDetail.email}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500">Üye Sayısı</span>
            <span className="font-medium dark:text-white">{trainerDetail.myMembers?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
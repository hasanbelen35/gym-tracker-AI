"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail, clearMemberDetail } from "@/store/slices/gymSlice";
import Loading from '@/components/Loading'

export default function MemberDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const memberPublicId = params.memberId as string;

  const { memberDetail, memberDetailLoading, memberDetailError } = useAppSelector(
    (state) => state.gym
  );

  useEffect(() => {
    if (memberPublicId) {
      dispatch(fetchMemberDetail(memberPublicId));
    }
    return () => {
      dispatch(clearMemberDetail());
    };
  }, [dispatch, memberPublicId]);

  if (memberDetailLoading) {
    return <Loading />;
  }

  if (memberDetailError) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">{memberDetailError}</p>
        <button onClick={() => router.back()} className="text-brand-primary underline">Geri dön</button>
      </div>
    );
  }

  if (!memberDetail) return null;
  {/*  TODO : DETAYLANDIRILICAK*/ }

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400"
      >
        ← Üyelere Geri Dön
      </button>

      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-[#1A1A2E] dark:text-white mb-6">
          {memberDetail.name} {memberDetail.surname}
        </h1>

        <div className="space-y-4">
          <DetailRow label="E-posta" value={memberDetail.email} />
          <DetailRow label="Telefon" value={memberDetail.phone || "Belirtilmemiş"} />
          <DetailRow label="Yaş" value={memberDetail.age || "-"} />
          <DetailRow label="Boy" value={memberDetail.height ? `${memberDetail.height} cm` : "-"} />
          <DetailRow label="Kilo" value={memberDetail.weight ? `${memberDetail.weight} kg` : "-"} />
          <DetailRow
            label="Kayıt Tarihi"
            value={new Date(memberDetail.createdAt).toLocaleDateString("tr-TR")}
          />
        </div>
      </div>

    </div>
  );
}

// Küçük yardımcı bileşen
const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);
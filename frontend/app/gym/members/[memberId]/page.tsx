"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail, clearMemberDetail } from "@/store/slices/gymSlice";
import Loading from '@/components/Loading';

export default function MemberDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const memberPublicId = params?.memberId as string;

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

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer mb-6"
      >
        <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Geri Dön
      </button>

      <div className="bg-nav-bg border border-nav-border rounded-2xl p-8 shadow-nav backdrop-blur-md">
        <h1 className="text-2xl font-bold text-foreground mb-6">
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
            value={memberDetail.createdAt ? new Date(memberDetail.createdAt).toLocaleDateString("tr-TR") : "-"}
          />
        </div>
      </div>

    </div>
  );
}

const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex justify-between py-3 border-b border-nav-border last:border-0">
    <span className="text-sm text-foreground/60">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);
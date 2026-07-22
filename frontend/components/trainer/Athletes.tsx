'use client'
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMembersByStatus } from "@/store/slices/trainerSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const Athletes: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAuth();
  const { pendingMembers, approvedMembers, loading, error } = useAppSelector(
    (state) => state.trainer
  );

  const gymId = user?.gymPublicId;

  useEffect(() => {
    if (gymId) {
      dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
      dispatch(fetchMembersByStatus({ gymId, status: 'ASSIGNED' }));
    }
  }, [dispatch, gymId]);

  const handleMemberClick = (publicId: string) => {
    router.push(`/trainer/athletes/${publicId}`);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] p-6 sm:p-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Antrenör Paneli</h1>
          <p className="text-sm opacity-70 mt-1">Bekleyen taleplerinizi ve onaylı sporcularınızı yönetin.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-brand-50 border border-brand-600/40 text-brand-text text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <section className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6 shadow-[var(--shadow-nav)] flex flex-col h-[70vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--nav-border)]">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>⏳ Bekleyen Talepler</span>
              </h2>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--brand-100)] text-[var(--brand-dark)]">
                {pendingMembers.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loading && pendingMembers.length === 0 ? (
                <p className="text-center text-sm opacity-60 py-10">Yükleniyor...</p>
              ) : pendingMembers.length === 0 ? (
                <p className="text-center text-sm opacity-60 py-10">Bekleyen sporcu talebi bulunmuyor.</p>
              ) : (
                pendingMembers.map((member) => (
                  <div
                    key={member.publicId}
                    className="p-4 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] flex items-center justify-between transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-base">{member.name} {member.surname}</h3>
                      <p className="text-xs opacity-70">{member.email}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--brand-50)] text-[var(--brand-text)] font-medium">
                      Onay Bekliyor
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6 shadow-[var(--shadow-nav)] flex flex-col h-[70vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--nav-border)]">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>💪 Sporcularım</span>
              </h2>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--brand-100)] text-[var(--brand-dark)]">
                {approvedMembers.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loading && approvedMembers.length === 0 ? (
                <p className="text-center text-sm opacity-60 py-10">Yükleniyor...</p>
              ) : approvedMembers.length === 0 ? (
                <p className="text-center text-sm opacity-60 py-10">Henüz atanmış sporcunuz bulunmuyor.</p>
              ) : (
                approvedMembers.map((member) => (
                  <div
                    key={member.publicId}
                    onClick={() => handleMemberClick(member.publicId)}
                    className="p-4 rounded-xl bg-[var(--background)] border border-[var(--nav-border)] hover:border-[var(--brand-500)] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="font-semibold text-base group-hover:text-[var(--brand-500)] transition-colors">
                        {member.name} {member.surname}
                      </h3>
                      <p className="text-xs opacity-70">{member.email}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-lg bg-[var(--brand-500)] text-white font-medium shadow-sm">
                      Detay &rarr;
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Athletes;
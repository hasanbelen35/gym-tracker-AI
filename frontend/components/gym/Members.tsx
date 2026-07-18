"use client";
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllMembers, removeMemberFromGym } from "@/store/slices/gymSlice";
import ConfirmModal from "@/components/ConfirmModel";

const Members = () => {
  const dispatch = useAppDispatch();
  const { members, membersLoading, membersError } = useAppSelector((state) => state.gym);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!members || members.length === 0) {
      dispatch(fetchAllMembers());
    }
  }, [dispatch, members]);

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setDeletingId(memberToDelete.id);
    try {
      await dispatch(removeMemberFromGym(memberToDelete.id)).unwrap();
    } catch (err) {
      console.error("Üye silinemedi:", err);
    } finally {
      setDeletingId(null);
      setMemberToDelete(null);
    }
  };

  if (membersLoading) return <p>Yükleniyor...</p>;
  if (membersError) return <p className="text-red-500">{membersError}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Üyeler</h2>

      {(!members || members.length === 0) ? (
        <p className="text-gray-500">Kayıtlı üye bulunamadı.</p>
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
              {members.map((member: any) => (
                <tr key={member.id} className="border-t border-gray-100 hover:bg-brand-100">
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.surname}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setMemberToDelete(member)}
                      disabled={deletingId === member.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    >
                      {deletingId === member.id ? "Siliniyor..." : "Sil"}
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
        isOpen={!!memberToDelete}
        title="Emin misiniz?"
        message={
          memberToDelete
            ? `${memberToDelete.name} ${memberToDelete.surname} adlı üyeyi salondan silmek üzeresiniz. Bu işlem geri alınamaz.`
            : ""
        }
        loading={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMemberToDelete(null)}
      />
    </div>
  )
}

export default Members
"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllMembers, removeMemberFromGym } from "@/store/slices/gymSlice";
import { Member } from "@/types/types";
import ConfirmModal from "@/components/ConfirmModel";
import Loading from '@/components/Loading'

const Members = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { members, membersLoading, membersError } = useAppSelector((state) => state.gym);

  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllMembers());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setDeletingId(memberToDelete.publicId);
    setDeleteError(null);
    try {
      await dispatch(removeMemberFromGym(memberToDelete.publicId)).unwrap();
      setMemberToDelete(null);
    } catch (err) {
      setDeleteError(typeof err === "string" ? err : "Üye silinemedi, tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRowClick = (memberPublicId: string) => {
    router.push(`/gym/members/${memberPublicId}`);
  };

  if (membersLoading) return <Loading />;
  if (membersError) return <p className="text-red-500">{membersError}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Üyeler</h2>

      {(!members || members.length === 0) ? (
        <p className="text-gray-500">Kayıtlı üye bulunamadı.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-brand-50 dark:text-brand uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Ad</th>
                <th className="px-4 py-3">Soyad</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Eğitmen</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member: Member) => (
                <tr
                  key={member.publicId}
                  onClick={() => handleRowClick(member.publicId)}
                  className="border-t border-gray-100 hover:bg-brand-100 cursor-pointer"
                >
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.surname}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">
                    {(member.assignmentStatus === 'ASSIGNED' || member.assignmentStatus === 'PENDING') && member.trainer
                      ? `${member.trainer.name} ${member.trainer.surname}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{member.assignmentStatus}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberToDelete(member);
                      }}
                      disabled={deletingId === member.publicId}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    >
                      {deletingId === member.publicId ? "Siliniyor..." : "Sil"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!memberToDelete}
        title="Emin misiniz?"
        message={
          memberToDelete
            ? `${memberToDelete.name} ${memberToDelete.surname} adlı üyeyi salondan silmek üzeresiniz. Bu işlem geri alınamaz.${deleteError ? `\n\n${deleteError}` : ""}`
            : ""
        }
        loading={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setMemberToDelete(null);
          setDeleteError(null);
        }}
      />
    </div>
  )
}

export default Members;

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllMembers, removeMemberFromGym } from "@/store/slices/gymSlice";
import { Member } from "@/types/types";
import ConfirmModal from "@/components/ConfirmModel"; 
import Loading from '@/components/Loading';
import { MembersTable } from '@/features/gym/athletes/components/MembersTable';

export default function MembersContainer() {
    
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

    const handleDeleteClick = (e: React.MouseEvent, member: Member) => {
        e.stopPropagation();
        setMemberToDelete(member);
    };

    if (membersLoading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-300">
            
            {/* PAGE HEADER */}
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                    KULLANICI YÖNETİMİ
                </span>
                <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                    ÜYELER
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Salona kayıtlı tüm sporcuları görüntüleyin, detaylarına erişin veya sistemden kaldırın.
                </p>
                <hr className="mt-6 border-nav-border" />
            </div>

            {/* ERROR NOTIFICATION */}
            {membersError && (
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-sm font-semibold text-red-500">{membersError}</p>
                </div>
            )}

            {/* MEMBERS TABLE COMPONENT */}
            <MembersTable 
                members={members} 
                onRowClick={handleRowClick} 
                onDeleteClick={handleDeleteClick} 
                deletingId={deletingId} 
            />

            {/* DELETE CONFIRMATION MODAL */}
            <ConfirmModal
                isOpen={!!memberToDelete}
                title="Üyeyi Sil"
                message={
                    memberToDelete
                        ? `${memberToDelete.name} ${memberToDelete.surname} adlı üyeyi salondan silmek üzeresiniz. Bu işlem geri alınamaz.${deleteError ? `\n\nHata: ${deleteError}` : ""}`
                        : ""
                }
                confirmText="Evet, Sil"
                cancelText="İptal"
                loading={deletingId !== null}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setMemberToDelete(null);
                    setDeleteError(null);
                }}
            />
            
        </div>
    );
}

"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
    fetchAllMembers,
    removeMemberFromGym,
} from "@/store/slices/gymSlice";
import { Member } from "@/types/types";
import ConfirmModal from "@/components/ConfirmModel";
import Loading from "@/components/Loading";
import { MembersTable } from "@/features/gym/athletes/components/MembersTable";
import { ArrowLeftIcon } from "@/icons/icon";


const PAGE_SIZE = 15;

export default function MembersContainer() {
    const dispatch = useAppDispatch();

    const {
        members,
        pagination,
        membersLoading,
        membersError,
    } = useAppSelector((state) => state.gym);

    const router = useRouter();

    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Aynı anda birden fazla pagination isteğini engeller.
    const loadingMoreRef = useRef(false);

    // İlk sayfayı yükle.
    useEffect(() => {
        dispatch(fetchAllMembers({ page: 1, limit: PAGE_SIZE }));
    }, [dispatch]);

    const loadMoreMembers = useCallback(async () => {
        if (
            loadingMoreRef.current ||
            membersLoading ||
            !pagination ||
            page >= pagination.totalPages
        ) {
            return;
        }

        loadingMoreRef.current = true;
        setIsLoadingMore(true);

        const nextPage = page + 1;

        try {
            await dispatch(
                fetchAllMembers({
                    page: nextPage,
                    limit: PAGE_SIZE,
                })
            ).unwrap();

            setPage(nextPage);
        } catch (error) {
            console.error("Daha fazla üye yüklenirken hata:", error);
        } finally {
            loadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    }, [dispatch, membersLoading, pagination, page]);

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const element = e.currentTarget;

            const isScrollable =
                element.scrollHeight > element.clientHeight + 1;

            const isNearBottom =
                element.scrollHeight -
                element.scrollTop -
                element.clientHeight <=
                50;

            if (!isScrollable || !isNearBottom) return;

            void loadMoreMembers();
        },
        [loadMoreMembers]
    );

    // Arama filtrelemesi.
    const filteredMembers = members.filter((member) => {
        const fullName = `${member.name} ${member.surname}`.toLowerCase();

        return fullName.includes(searchQuery.toLowerCase().trim());
    });

    // Üye silme işlemi.
    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;

        setDeletingId(memberToDelete.publicId);
        setDeleteError(null);

        try {
            await dispatch(
                removeMemberFromGym(memberToDelete.publicId)
            ).unwrap();

            setMemberToDelete(null);
        } catch (error) {
            setDeleteError(
                typeof error === "string"
                    ? error
                    : "Üye silinemedi, tekrar deneyin."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleRowClick = (memberPublicId: string) => {
        router.push(`/gym/members/${memberPublicId}`);
    };

    const handleDeleteClick = (
        e: React.MouseEvent,
        member: Member
    ) => {
        e.stopPropagation();
        setMemberToDelete(member);
    };

    if (membersLoading && page === 1 && members.length === 0) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-7xl p-6 animate-in fade-in duration-300 md:p-8">

            <button
                onClick={() => router.back()}
                className="group cursor-pointer flex items-center mb-4 gap-2 px-4 py-2.5 rounded-xl bg-nav-bg border border-nav-border/80 text-xs font-bold uppercase tracking-wider hover:border-brand-500/60 hover:bg-brand-500/5 transition-all shadow-sm"
            >
                <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1 " />
                <span>Geri Dön</span>
            </button>
            
            {/* PAGE HEADER */}
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                    KULLANICI YÖNETİMİ
                </span>

                <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                    ÜYELER
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Salona kayıtlı tüm sporcuları görüntüleyin, detaylarına
                    erişin veya sistemden kaldırın.
                </p>

                <hr className="mt-6 border-nav-border" />
            </div>

            {/* ERROR NOTIFICATION */}
            {membersError && (
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-sm font-semibold text-red-500">
                        {membersError}
                    </p>
                </div>
            )}

            {/* MEMBERS TABLE */}
            <MembersTable
                members={filteredMembers}
                onRowClick={handleRowClick}
                onDeleteClick={handleDeleteClick}
                deletingId={deletingId}
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onScroll={handleScroll}
                isLoadingMore={isLoadingMore}
            />

            {/* DELETE CONFIRMATION MODAL */}
            <ConfirmModal
                isOpen={!!memberToDelete}
                title="Üyeyi Sil"
                message={
                    memberToDelete
                        ? `${memberToDelete.name} ${memberToDelete.surname} adlı üyeyi salondan silmek üzeresiniz. Bu işlem geri alınamaz.${deleteError ? `\n\nHata: ${deleteError}` : ""
                        }`
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

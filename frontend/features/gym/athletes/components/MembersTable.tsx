/* eslint-disable @next/next/no-img-element */
import React from "react";
import { MembersTableProps } from "@/features/gym/athletes/types";
import { Member } from "@/types/types";

interface ExtendedMembersTableProps extends MembersTableProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    isLoadingMore?: boolean;
}

export const MembersTable: React.FC<ExtendedMembersTableProps> = ({
    members,
    onRowClick,
    onDeleteClick,
    deletingId,
    searchQuery,
    onSearchChange,
    onScroll,
    isLoadingMore,
}) => {

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "ASSIGNED":
                return (
                    <span className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-500">
                        Atandı
                    </span>
                );

            case "PENDING":
                return (
                    <span className="inline-flex items-center rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                        Bekliyor
                    </span>
                );

            default:
                return (
                    <span className="inline-flex items-center rounded-md border border-gray-500/20 bg-gray-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Boşta
                    </span>
                );
        }
    };

    return (
        <div className="space-y-4">
            {/* SEARCH INPUT */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Üye ad veya soyadına göre ara..."
                    className="w-full rounded-xl border border-nav-border bg-nav-bg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
            </div>

            {/* TABLE CONTAINER */}
            <div className="overflow-hidden rounded-xl border border-nav-border bg-nav-bg shadow-sm">
                <div
                    onScroll={onScroll}
                    className="h-[600px] overflow-x-auto overflow-y-auto custom-scrollbar"
                >
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="sticky top-0 z-10 border-b border-nav-border bg-nav-bg text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                                <th className="px-6 py-4">Üye Bilgisi</th>
                                <th className="px-6 py-4">E-posta</th>
                                <th className="px-6 py-4">Eğitmen</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlem</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-nav-border/50">
                            {members.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-24 text-center text-sm text-gray-500"
                                    >
                                        Kayıtlı üye bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member: Member) => (
                                    <tr
                                        key={member.publicId}
                                        onClick={() => onRowClick(member.publicId)}
                                        className="group cursor-pointer bg-transparent transition-colors hover:bg-brand-500/5"
                                    >
                                        {/* NAME, SURNAME & AVATAR */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {member.avatarUrl ? (
                                                    <img
                                                        src={member.avatarUrl}
                                                        alt={`${member.name} ${member.surname}`}
                                                        className="h-8 w-8 rounded-full object-cover border border-nav-border flex-none"
                                                    />
                                                ) : (
                                                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-500">
                                                        {member.name.charAt(0)}{member.surname.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="font-semibold text-white transition-colors group-hover:text-brand-500">
                                                    {member.name} {member.surname}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-gray-400">
                                            {member.email}
                                        </td>

                                        <td className="px-6 py-4">
                                            {(member.assignmentStatus === "ASSIGNED" ||
                                                member.assignmentStatus === "PENDING") &&
                                                member.trainer ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/20 text-[10px] font-bold uppercase text-brand-500">
                                                        {member.trainer.name.charAt(0)}
                                                        {member.trainer.surname.charAt(0)}
                                                    </span>

                                                    <span className="text-xs font-medium text-gray-300">
                                                        {member.trainer.name} {member.trainer.surname}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-600">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {renderStatusBadge(member.assignmentStatus || "")}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={(e) => onDeleteClick(e, member)}
                                                disabled={deletingId === member.publicId}
                                                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId === member.publicId
                                                    ? "Siliniyor..."
                                                    : "Sil"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {isLoadingMore && (
                        <div className="bg-nav-bg/50 py-4 text-center text-xs text-gray-400">
                            Daha fazla üye yükleniyor...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
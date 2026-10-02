
import React from 'react';
import { MembersTableProps } from '@/features/gym/athletes/types';
import { Member } from '@/types/types';

export const MembersTable: React.FC<MembersTableProps> = ({
    members,
    onRowClick,
    onDeleteClick,
    deletingId
}) => {


    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'ASSIGNED':
                return <span className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-500">Atandı</span>;
            case 'PENDING':
                return <span className="inline-flex items-center rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500">Bekliyor</span>;
            default:
                return <span className="inline-flex items-center rounded-md border border-gray-500/20 bg-gray-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Boşta</span>;
        }
    };

    if (!members || members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-nav-border py-16 text-center bg-nav-bg/30">
                <p className="text-sm text-gray-500">Kayıtlı üye bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-nav-border bg-nav-bg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">

                    {/* TABLE HEADER */}
                    <thead className="border-b border-nav-border bg-black/20 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Üye Bilgisi</th>
                            <th className="px-6 py-4">E-posta</th>
                            <th className="px-6 py-4">Eğitmen</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody className="divide-y divide-nav-border/50">
                        {members.map((member: Member) => (
                            <tr
                                key={member.publicId}
                                onClick={() => onRowClick(member.publicId)}
                                className="group cursor-pointer bg-transparent transition-colors hover:bg-brand-500/5"
                            >
                                {/* NAME & SURNAME */}
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-white group-hover:text-brand-500 transition-colors">
                                        {member.name} {member.surname}
                                    </div>
                                </td>

                                {/* EMAIL */}
                                <td className="px-6 py-4 text-gray-400">
                                    {member.email}
                                </td>

                                {/* TRAINER */}
                                <td className="px-6 py-4">
                                    {(member.assignmentStatus === 'ASSIGNED' || member.assignmentStatus === 'PENDING') && member.trainer ? (
                                        <div className="flex items-center gap-2">
                                            <span className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-[10px] font-bold uppercase flex-none">
                                                {member.trainer.name.charAt(0)}{member.trainer.surname.charAt(0)}
                                            </span>
                                            <span className="text-gray-300 text-xs font-medium">
                                                {member.trainer.name} {member.trainer.surname}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-600 text-xs font-medium">-</span>
                                    )}
                                </td>

                                {/* STATUS */}
                                <td className="px-6 py-4">
                                    {renderStatusBadge(member.assignmentStatus || '')}
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={(e) => onDeleteClick(e, member)}
                                        disabled={deletingId === member.publicId}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingId === member.publicId ? "Siliniyor..." : "Sil"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};
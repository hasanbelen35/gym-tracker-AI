"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMembersByStatus, approveMemberAssignment, rejectMemberAssignment } from '@/store/slices/gymSlice';
import Loading from '@/components/Loading';

export default function GymAssignmentsPage() {
    const dispatch = useAppDispatch();
    const {
        unassignedMembers,
        pendingMembers,
        assignedMembers,
        statusMembersLoading,
        statusMembersError,
        assignmentLoading,
        assignmentError,
    } = useAppSelector(state => state.gym);

    useEffect(() => {
        dispatch(fetchMembersByStatus('UNASSIGNED'));
        dispatch(fetchMembersByStatus('PENDING'));
        dispatch(fetchMembersByStatus('ASSIGNED'));
    }, [dispatch]);

    const handleApprove = (memberPublicId: string) => {
        dispatch(approveMemberAssignment(memberPublicId))
            .unwrap()
            .then(() => {
                dispatch(fetchMembersByStatus('ASSIGNED'));
            });
    };

    const handleReject = (memberPublicId: string) => {
        dispatch(rejectMemberAssignment(memberPublicId))
            .unwrap()
            .then(() => {
                dispatch(fetchMembersByStatus('UNASSIGNED'));
            });
    };

    if (statusMembersLoading && unassignedMembers.length === 0 && pendingMembers.length === 0 && assignedMembers.length === 0) {
        return <Loading />;
    }

    return (
        <div className="p-6">
            {statusMembersError && <p className="text-sm text-red-500 mb-2">Hata: {statusMembersError}</p>}
            {assignmentError && <p className="text-sm text-red-500 mb-2">Hata: {assignmentError}</p>}
            {assignmentLoading && <p className="text-sm text-gray-400 mb-2">İşleniyor...</p>}

            <div className="flex gap-4">
                {/* 1. Sütun: Unassigned */}
                <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-white">
                    <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">Boştaki Sporcular</h3>
                    <div className="flex flex-col gap-2">
                        {unassignedMembers.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">Boşta sporcu bulunmuyor.</p>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            unassignedMembers.map((m: any) => (
                                <div
                                    key={m.publicId}
                                    className="px-4 py-3 border rounded-xl text-gray-700 font-medium shadow-sm bg-gray-50/50"
                                >
                                    {m.name} {m.surname}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Sütun: Pending */}
                <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-yellow-50/40">
                    <h3 className="font-bold text-lg mb-4 text-yellow-800 border-b border-yellow-200 pb-2">Bekleyen Talepler</h3>
                    <div className="flex flex-col gap-2">
                        {pendingMembers.length === 0 ? (
                            <p className="text-yellow-600/60 text-sm italic">Bekleyen talep bulunmuyor.</p>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            pendingMembers.map((m: any) => (
                                <div
                                    key={m.publicId}
                                    className="flex flex-col gap-2 px-4 py-3 border border-yellow-200 bg-white rounded-xl text-gray-700 font-medium shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{m.name} {m.surname}</span>
                                    </div>
                                    {m.trainer && (
                                        <span className="text-xs text-gray-400">
                                            Talep eden: {m.trainer.name} {m.trainer.surname}
                                        </span>
                                    )}
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => handleApprove(m.publicId)}
                                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 font-semibold transition-all"
                                        >
                                            Onayla
                                        </button>
                                        <button
                                            onClick={() => handleReject(m.publicId)}
                                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-semibold transition-all"
                                        >
                                            Reddet
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 3. Sütun: Assigned */}
                <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-green-50/40">
                    <h3 className="font-bold text-lg mb-4 text-green-800 border-b border-green-200 pb-2">Onaylı Sporcular</h3>
                    <div className="flex flex-col gap-2">
                        {assignedMembers.length === 0 ? (
                            <p className="text-green-600/60 text-sm italic">Henüz onaylı sporcu yok.</p>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            assignedMembers.map((m: any) => (
                                <div key={m.publicId} className="px-4 py-3 border border-green-200 bg-white rounded-xl text-gray-700 font-medium shadow-sm">
                                    {m.name} {m.surname}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
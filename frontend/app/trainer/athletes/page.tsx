"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMembersByStatus, requestAssignment, cancelAssignment, Member } from '@/store/slices/trainerSlice';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';

export default function TrainerAthletesPage() {
    const dispatch = useAppDispatch();
    const { user, loading: authLoading } = useAuth();
    const { availableMembers, pendingMembers, approvedMembers, loading, error } = useAppSelector(state => state.trainer);

    const gymId = user?.gymPublicId;

    useEffect(() => {
        if (!gymId) return;

        dispatch(fetchMembersByStatus({ gymId, status: 'UNASSIGNED' }));
        dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
        dispatch(fetchMembersByStatus({ gymId, status: 'ASSIGNED' }));
    }, [dispatch, gymId]);

    // Havuzdan sporcu için talep gönder
    const handleRequest = (memberPublicId: string) => {
        if (!gymId) return;
        dispatch(requestAssignment({ memberPublicId, gymId }))
            .unwrap()
            .then(() => {
                dispatch(fetchMembersByStatus({ gymId, status: 'UNASSIGNED' }));
                dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
            });
    };

    // Bekleyen talebi geri çek
    const handleCancel = (memberPublicId: string) => {
        if (!gymId) return;
        dispatch(cancelAssignment({ memberPublicId, gymId }))
            .unwrap()
            .then(() => {
                dispatch(fetchMembersByStatus({ gymId, status: 'UNASSIGNED' }));
                dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
            });
    };

    if (authLoading) return <Loading />;
    if (!user) return <p className="p-6 text-red-500 font-medium">Lütfen giriş yapın.</p>;

    if (!gymId) {
        return (
            <div className="p-6 text-amber-600 font-medium">
                Gym ID verisi bulunamadı.
            </div>
        );
    }

    return (
        <div className="p-6">
            {loading && <p className="text-sm text-gray-400 mb-2">Yükleniyor...</p>}
            {error && <p className="text-sm text-red-500 mb-2">Hata: {error}</p>}

            <div className="flex gap-4">
                {/* 1. Sütun: Havuz */}
                <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-white dark:bg-brand-50">
                    <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">Havuz (Boştaki Sporcular)</h3>
                    <div className="flex flex-col gap-2">
                        {availableMembers.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">Havuzda uygun sporcu bulunamadı.</p>
                        ) : (
                            availableMembers.map((m: Member) => (
                                <button
                                    onClick={() => handleRequest(m.publicId)}
                                    key={m.publicId}
                                    className="w-full text-left px-4 py-3 border rounded-xl hover:bg-brand-50 hover:text-brand-600 font-medium transition-all shadow-sm bg-gray-50/50"
                                >
                                    {m.name} {m.surname}
                                </button>
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
                            pendingMembers.map((m: Member) => (
                                <div
                                    key={m.publicId}
                                    className="flex items-center justify-between px-4 py-3 border border-yellow-200 bg-white rounded-xl text-gray-700 font-medium shadow-sm"
                                >
                                    <span>{m.name} {m.surname}</span>
                                    <button
                                        onClick={() => handleCancel(m.publicId)}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-semibold transition-all"
                                    >
                                        Geri Çek
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 3. Sütun: Onaylı */}
                <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-green-50/40">
                    <h3 className="font-bold text-lg mb-4 text-green-800 border-b border-green-200 pb-2">Onaylı Sporcularım</h3>
                    <div className="flex flex-col gap-2">
                        {approvedMembers.length === 0 ? (
                            <p className="text-green-600/60 text-sm italic">Henüz onaylı sporcunuz yok.</p>
                        ) : (
                            approvedMembers.map((m: Member) => (
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
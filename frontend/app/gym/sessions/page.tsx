'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchGymSessions, fetchActiveSessions } from '@/store/slices/gymSessionSlice';

export default function GymSessionsPanel() {
    const dispatch = useAppDispatch();
    const { allSessions, activeSessions, loading, error } = useAppSelector(
        (state) => state.gymSession
    );

    useEffect(() => {
        dispatch(fetchGymSessions());
        dispatch(fetchActiveSessions());
    }, [dispatch]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Yükleniyor...</div>;
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
                Hata: {error}
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Aktif Oturumlar */}
            <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    Aktif Oturumlar ({activeSessions.length})
                </h2>

                {activeSessions.length === 0 ? (
                    <p className="text-gray-400 text-sm">Şu an aktif oturum yok.</p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {activeSessions.map((s) => (
                            <div
                                key={s.id}
                                className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm"
                            >
                                <p className="font-medium text-gray-800">{s.memberName}</p>
                                <p className="text-sm text-gray-500">
                                    Giriş: {new Date(s.checkIn).toLocaleTimeString('tr-TR')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Tüm Oturumlar */}
            <section>
                <h2 className="text-lg font-semibold mb-3">
                    Tüm Oturumlar ({allSessions.length})
                </h2>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-4 py-2">Üye</th>
                                <th className="px-4 py-2">Giriş</th>
                                <th className="px-4 py-2">Çıkış</th>
                                <th className="px-4 py-2">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSessions.map((s) => (
                                <tr key={s.id} className="border-t border-gray-100">
                                    <td className="px-4 py-2 font-medium">{s.memberName}</td>
                                    <td className="px-4 py-2 text-gray-500">
                                        {new Date(s.checkIn).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="px-4 py-2 text-gray-500">
                                        {s.checkOut
                                            ? new Date(s.checkOut).toLocaleString('tr-TR')
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {s.checkOut ? (
                                            <span className="text-gray-400">Tamamlandı</span>
                                        ) : (
                                            <span className="text-green-600 font-medium">Devam ediyor</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
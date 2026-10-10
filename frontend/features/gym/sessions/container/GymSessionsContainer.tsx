'use client';

import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchGymSessions, fetchActiveSessions } from '@/store/slices/gymSessionSlice';
import Loading from '@/components/Loading';
import { GymSessionsView } from '@/features/gym/sessions/components/GymSessionsView'; 

export const GymSessionsContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const { allSessions, activeSessions, loading, error, pagination } = useAppSelector(
        (state) => state.gymSession
    );

    useEffect(() => {
      
        dispatch(fetchGymSessions({ page: 1, limit: 50 }));
        dispatch(fetchActiveSessions());
    }, [dispatch]);

    const handlePageChange = useCallback((newPage: number) => {
        const totalPages = pagination?.totalPages || 1;
        const currentLimit = pagination?.limit || 50;

        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(fetchGymSessions({ page: newPage, limit: currentLimit }));
        }
    }, [dispatch, pagination?.totalPages, pagination?.limit]);

    if (loading && allSessions.length === 0 && activeSessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-3">
                <Loading />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Oturumlar yükleniyor...</p>
            </div>
        );
    }

    return (
        <GymSessionsView 
            allSessions={allSessions} 
            activeSessions={activeSessions} 
            error={error} 
            loading={loading}
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
        />
    );
};

export default GymSessionsContainer;
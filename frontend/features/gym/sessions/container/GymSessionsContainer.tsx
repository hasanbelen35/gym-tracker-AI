'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchGymSessions, fetchActiveSessions } from '@/store/slices/gymSessionSlice';
import Loading from '@/components/Loading';
import { GymSessionsView } from '@/features/gym/sessions/components/GymSessionsView'; 
export const GymSessionsContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const { allSessions, activeSessions, loading, error } = useAppSelector(
        (state) => state.gymSession
    );

    useEffect(() => {
        dispatch(fetchGymSessions());
        dispatch(fetchActiveSessions());
    }, [dispatch]);

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
        />
    );
};

export default GymSessionsContainer;
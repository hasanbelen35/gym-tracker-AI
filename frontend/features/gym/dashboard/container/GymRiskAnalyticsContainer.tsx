import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store'; 
import { fetchRiskAnalytics, clearRiskError } from '@/store/slices/riskSlice';
import { GymRiskAnalyticsView } from '../components/GymRiskAnalyticsView';
import Loading from '@/components/Loading';
import { ErrorBox } from '@/components/ui/ErrorBox';
import { SuccessBox } from '@/components/ui/SuccessBox';

export const GymRiskAnalyticsContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { analytics, loading, error } = useAppSelector((state) => state.risk);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!analytics) {
            dispatch(fetchRiskAnalytics(false));
        }
    }, [dispatch, analytics]);

    const handleRefresh = async () => {
        const resultAction = await dispatch(fetchRiskAnalytics(true));
        if (fetchRiskAnalytics.fulfilled.match(resultAction)) {
            setSuccessMessage("Risk analitiği başarıyla güncellendi.");
            setTimeout(() => setSuccessMessage(null), 4000);
        }
    };

    if (loading && !analytics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loading />
                <p className="text-sm text-zinc-500">Risk analitiği yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {successMessage && (
                <div onClick={() => setSuccessMessage(null)} className="cursor-pointer mx-4 sm:mx-6 mt-4">
                    <SuccessBox message={successMessage} />
                </div>
            )}

            {error && (
                <div onClick={() => dispatch(clearRiskError())} className="cursor-pointer mx-4 sm:mx-6 mt-4">
                    <ErrorBox message={error} />
                </div>
            )}

            {analytics && (
                <GymRiskAnalyticsView 
                    analytics={analytics} 
                    onRefresh={handleRefresh} 
                    loading={loading} 
                />
            )}
        </div>
    );
};

export default GymRiskAnalyticsContainer;
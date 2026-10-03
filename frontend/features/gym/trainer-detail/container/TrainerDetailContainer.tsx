
"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchTrainerDetail, clearTrainerDetail } from "@/store/slices/gymSlice";
import Loading from '@/components/Loading';
import { ArrowLeftIcon } from "@/icons/icon";
import { TrainerInfoCard } from "@/features/gym/trainer-detail/components/TrainerInfoCard";

export default function TrainerDetailContainer() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const trainerPublicId = params?.trainerId as string;

    const { trainerDetail, trainerDetailLoading, trainerDetailError } = useAppSelector(
        (state) => state.gym
    );

    useEffect(() => {
        if (trainerPublicId) {
            dispatch(fetchTrainerDetail(trainerPublicId));
        }
        return () => {
            dispatch(clearTrainerDetail());
        };
    }, [dispatch, trainerPublicId]);

    if (trainerDetailLoading) {
        return <Loading />; 
    }

    if (trainerDetailError) {
        return (
            <div className="max-w-4xl mx-auto p-6 md:p-8 animate-in fade-in duration-300">
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-sm font-semibold text-red-500">{trainerDetailError}</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="group flex cursor-pointer items-center gap-2 rounded-lg border border-nav-border bg-nav-bg px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-brand-500 hover:text-brand-500 w-max"
                >
                    <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    Antrenörlere Geri Dön
                </button>
            </div>
        );
    }

    if (!trainerDetail) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
            <div>
                <button
                    onClick={() => router.back()}
                    className="group flex cursor-pointer items-center gap-2 rounded-lg border border-nav-border bg-nav-bg px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-brand-500 hover:text-brand-500 w-max"
                >
                    <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    Antrenörlere Geri Dön
                </button>
            </div>

            <TrainerInfoCard trainer={trainerDetail} />
        </div>
    );
}
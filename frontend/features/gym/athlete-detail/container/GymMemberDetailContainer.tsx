'use client';

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail } from "@/store/slices/gymSlice"; 
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from '@/icons/icon';

import { MemberHeader } from "@/features/gym/athlete-detail/components/MemberHeader";
import { MemberStatsGrid } from "@/features/gym/athlete-detail/components/MemberStatsGrid";
import { MemberMedicalNotes } from "@/features/gym/athlete-detail/components/MemberMedicalNotes";
import { MemberMeasurementsCard } from "@/features/gym/athlete-detail/components/MemberMeasurementsCard";
import { MemberProgramsCard } from "@/features/gym/athlete-detail/components/MemberProgramsCard";
import { MemberSessionsCard } from "@/features/gym/athlete-detail/components/MemberSessionsCard";

import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";

export default function GymMemberDetailContainer() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const memberPublicId = params?.memberId as string || params?.memberPublicId as string;
    
    const { memberDetail, memberDetailLoading, memberDetailError } = useAppSelector((state) => state.gym);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (memberPublicId) {
            dispatch(fetchMemberDetail(memberPublicId))
                .unwrap()
                .then(() => {
                    setSuccessMessage("Sporcu bilgileri başarıyla yüklendi.");
                })
                .catch(() => {
                    setSuccessMessage(null);
                });
        }
    }, [dispatch, memberPublicId]);

    if (memberDetailError && !memberDetail) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 flex items-center justify-center">
                <div className="max-w-md w-full space-y-4">
                    <ErrorBox message={memberDetailError} />
                    <button
                        onClick={() => router.back()}
                        className="w-full px-4 py-2.5 rounded-xl bg-nav-bg border border-nav-border text-foreground text-xs font-semibold hover:bg-foreground/5 transition-all cursor-pointer shadow-sm"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!memberDetail) {
        return memberDetailLoading ? <Loading /> : null;
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'ASSIGNED':
                return <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">Aktif Sporcu</span>;
            case 'PENDING':
                return <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">Onay Bekliyor</span>;
            default:
                return <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 font-bold">{status || 'Bilinmiyor'}</span>;
        }
    };

    const getGenderLabel = (gender?: string | null) => {
        switch (gender) {
            case 'MALE': return 'Erkek';
            case 'FEMALE': return 'Kadın';
            default: return gender || '-';
        }
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">

                <ErrorBox message={memberDetailError} />
                <SuccessBox message={successMessage} />

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>

                    <div className="flex items-center gap-3">
                        {getStatusBadge(memberDetail.assignmentStatus)}
                    </div>
                </div>

                <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md space-y-6">
                    <MemberHeader member={memberDetail} getStatusBadge={getStatusBadge} />

                    <MemberStatsGrid member={memberDetail} getGenderLabel={getGenderLabel} />

                    <MemberMedicalNotes medicalNotes={memberDetail.medicalNotes} />
                </div>

                <MemberMeasurementsCard 
                    measurements={memberDetail.measurements} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MemberProgramsCard
                        programs={memberDetail.programs}
                        memberPublicId={memberPublicId}
                        onProgramClick={(publicId) => router.push(`/gym/athletes/programDetail/${publicId}`)}
                        onCreateClick={() => router.push(`/gym/create-new-workout-program/${memberPublicId}`)}
                    />

                    <MemberSessionsCard sessions={memberDetail.sessions} />
                </div>

            </div>
        </div>
    );
}
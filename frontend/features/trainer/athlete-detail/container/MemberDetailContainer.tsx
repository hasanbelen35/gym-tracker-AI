'use client'
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail } from "@/store/slices/trainerSlice";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from '@/icons/icon';
import { MemberMeasurementsSection } from "@/features/trainer/measurement/index";

import { MemberHeader } from "@/features/trainer/athlete-detail/components/MemberHeader";
import { MemberStatsGrid } from "@/features/trainer/athlete-detail/components/MemberStatsGrid";
import { MemberMedicalNotes } from "@/features/trainer/athlete-detail/components/MemberMedicalNotes";
import { MemberProgramsCard } from "@/features/trainer/athlete-detail/components/MemberProgramsCard";
import { MemberSessionsCard } from "@/features/trainer/athlete-detail/components/MemberSessionsCard";

export const MemberDetail: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const memberPublicId = params?.memberPublicId as string;
    const { selectedMemberDetail, loading, error } = useAppSelector((state) => state.trainer);

    useEffect(() => {
        if (memberPublicId) {
            dispatch(fetchMemberDetail(memberPublicId));
        }
    }, [dispatch, memberPublicId]);

    if (loading && !selectedMemberDetail) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium opacity-70 tracking-wide">Sporcu bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 flex items-center justify-center">
                <div className="max-w-md w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center shadow-lg">
                    <p className="font-semibold mb-1">Bir Hata Oluştu</p>
                    <p className="opacity-90">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all cursor-pointer"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedMemberDetail) {
        return null;
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'ASSIGNED':
                return <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">Aktif Sporcu</span>;
            case 'PENDING':
                return <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">Onay Bekliyor</span>;
            default:
                return <span className="text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-dark font-bold">{status || 'Bilinmiyor'}</span>;
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

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>
                    {getStatusBadge(selectedMemberDetail.assignmentStatus)}
                </div>

                <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md space-y-6">
                    <MemberHeader member={selectedMemberDetail} getStatusBadge={getStatusBadge} />
                    
                    <MemberStatsGrid member={selectedMemberDetail} getGenderLabel={getGenderLabel} />
                    
                    <MemberMedicalNotes medicalNotes={selectedMemberDetail.medicalNotes} />
                </div>

                <MemberMeasurementsSection memberPublicId={memberPublicId} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MemberProgramsCard
                        programs={selectedMemberDetail.programs}
                        memberPublicId={memberPublicId}
                        onProgramClick={(publicId) => router.push(`/trainer/athletes/programDetail/${publicId}`)}
                        onCreateClick={() => router.push(`/trainer/create-new-workout-program/${memberPublicId}`)}
                    />

                    <MemberSessionsCard sessions={selectedMemberDetail.sessions} />
                </div>

            </div>
        </div>
    );
};

export default MemberDetail;
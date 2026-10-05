'use client'
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMemberDetail } from "@/store/slices/trainerSlice";
import { fetchMemberAIAnalysis } from "@/store/slices/aiSlice";
import { clearAIAnalysis, clearAIError } from "@/store/slices/aiSlice";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from '@/icons/icon';
import { MemberMeasurementsSection } from "@/features/trainer/measurement/index";

import { MemberHeader } from "@/features/trainer/athlete-detail/components/MemberHeader";
import { MemberStatsGrid } from "@/features/trainer/athlete-detail/components/MemberStatsGrid";
import { MemberMedicalNotes } from "@/features/trainer/athlete-detail/components/MemberMedicalNotes";
import { MemberProgramsCard } from "@/features/trainer/athlete-detail/components/MemberProgramsCard";
import { MemberSessionsCard } from "@/features/trainer/athlete-detail/components/MemberSessionsCard";
import { AIAnalysisDrawer } from "@/features/trainer/athlete-detail/components/AIAnalysisDrawer";
import { AIAnalyzeButton } from "@/components/AIAnalyzeButton";

import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";

export const MemberDetail: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const memberPublicId = params?.memberPublicId as string;
    const { selectedMemberDetail, loading, error } = useAppSelector((state) => state.trainer);

    const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
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

    const handleRunAIAnalysis = () => {
        dispatch(clearAIAnalysis());
        dispatch(clearAIError());
        setIsAIDrawerOpen(true);
        if (memberPublicId) {
            dispatch(fetchMemberAIAnalysis(memberPublicId));
        }
    };

    if (error && !selectedMemberDetail) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 flex items-center justify-center">
                <div className="max-w-md w-full space-y-4">
                    <ErrorBox message={error} />
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

    if (!selectedMemberDetail) {
        return loading ? <Loading /> : null;
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

                <ErrorBox message={error} />
                <SuccessBox message={successMessage} />

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>

                    <div className="flex items-center gap-3">
                        <AIAnalyzeButton onClick={handleRunAIAnalysis} />
                        {getStatusBadge(selectedMemberDetail.assignmentStatus)}
                    </div>
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

            <AIAnalysisDrawer
                isOpen={isAIDrawerOpen}
                onClose={() => setIsAIDrawerOpen(false)}
            />
        </div>
    );
};

export default MemberDetail;
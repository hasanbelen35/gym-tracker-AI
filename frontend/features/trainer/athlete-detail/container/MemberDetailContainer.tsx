'use client'
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { 
    fetchMemberProfileByTrainer, 
    fetchMemberSessionsByTrainer, 
    fetchMemberProgramsByTrainer,
    clearSelectedMember 
} from "@/store/slices/trainerSlice";
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
    
    const { 
        selectedMemberProfile, 
        sessions, 
        sessionsPagination,
        sessionsLoading,
        programs, 
        programsPagination,
        programsLoading,
        loading, 
        error 
    } = useAppSelector((state) => state.trainer);

    const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // CURRENT PAGES ARE DERIVED FROM REDUX PAGINATION DATA
    const currentProgramPage = programsPagination?.page ?? 1;
    const currentSessionPage = sessionsPagination?.page ?? 1;

    const hasMorePrograms = programsPagination
        ? currentProgramPage < programsPagination.totalPages
        : false;
    const hasMoreSessions = sessionsPagination
        ? currentSessionPage < sessionsPagination.totalPages
        : false;

    // FETCH PROFILE, SESSIONS AND PROGRAMS WHEN MEMBER CHANGES (MEASUREMENTS ARE FETCHED INSIDE THEIR OWN FEATURE)
    useEffect(() => {
        if (memberPublicId) {
            Promise.all([
                dispatch(fetchMemberProfileByTrainer(memberPublicId)).unwrap(),
                dispatch(fetchMemberSessionsByTrainer({ memberPublicId, page: 1, limit: 10 })).unwrap(),
                dispatch(fetchMemberProgramsByTrainer({ memberPublicId, page: 1, limit: 10 })).unwrap(),
            ])
                .then(() => {
                    setSuccessMessage("Sporcu bilgileri başarıyla yüklendi.");
                })
                .catch(() => {
                    setSuccessMessage(null);
                });
        }

        return () => {
            dispatch(clearSelectedMember());
        };
    }, [dispatch, memberPublicId]);

    // INFINITE SCROLL: LOAD NEXT PAGE OF PROGRAMS
    const handleLoadMorePrograms = () => {
        if (hasMorePrograms && !programsLoading) {
            dispatch(fetchMemberProgramsByTrainer({ memberPublicId, page: currentProgramPage + 1, limit: 10 }));
        }
    };

    // INFINITE SCROLL: LOAD NEXT PAGE OF SESSIONS
    const handleLoadMoreSessions = () => {
        if (hasMoreSessions && !sessionsLoading) {
            dispatch(fetchMemberSessionsByTrainer({ memberPublicId, page: currentSessionPage + 1, limit: 10 }));
        }
    };

    const handleRunAIAnalysis = () => {
        dispatch(clearAIAnalysis());
        dispatch(clearAIError());
        setIsAIDrawerOpen(true);
        if (memberPublicId) {
            dispatch(fetchMemberAIAnalysis(memberPublicId));
        }
    };

    if (error && !selectedMemberProfile) {
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

    if (!selectedMemberProfile) {
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
                        {getStatusBadge(selectedMemberProfile.assignmentStatus)}
                    </div>
                </div>

                <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md space-y-6">
                    <MemberHeader member={selectedMemberProfile} getStatusBadge={getStatusBadge} />

                    <MemberStatsGrid member={selectedMemberProfile} getGenderLabel={getGenderLabel} />

                    <MemberMedicalNotes medicalNotes={selectedMemberProfile.medicalNotes} />
                </div>

                <MemberMeasurementsSection memberPublicId={memberPublicId} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MemberProgramsCard
                        programs={programs}
                        memberPublicId={memberPublicId}
                        onProgramClick={(publicId) => router.push(`/trainer/athletes/programDetail/${publicId}`)}
                        onCreateClick={() => router.push(`/trainer/create-new-workout-program/${memberPublicId}`)}
                        onLoadMore={handleLoadMorePrograms}
                        hasMore={hasMorePrograms}
                        loading={programsLoading}
                    />

                    <MemberSessionsCard 
                        sessions={sessions}
                        onLoadMore={handleLoadMoreSessions}
                        hasMore={hasMoreSessions}
                        loading={sessionsLoading}
                    />
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
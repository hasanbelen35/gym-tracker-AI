"use client";

// =====================================================================
// IMPORTS
// =====================================================================
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMembersByStatus, approveMemberAssignment, rejectMemberAssignment } from '@/store/slices/gymSlice';
import Loading from '@/components/Loading';
import { ArrowLeftIcon, IconArrowRight } from '@/icons/icon'; // İkon yollarını projene göre ayarlayabilirsin

// =====================================================================
// FEATURE COMPONENTS
// =====================================================================
import { UnassignedColumn } from '@/features/gym/trainer-assignment/components/UnassignedColumn';
import { PendingColumn } from '@/features/gym/trainer-assignment/components/PendingColumn';
import { AssignedColumn } from '@/features/gym/trainer-assignment/components/AssignedColumn';

// =====================================================================
// MAIN CONTAINER COMPONENT
// =====================================================================
export default function GymAssignmentsContainer() {
    
    // =================================================================
    // HOOKS
    // =================================================================
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        unassignedMembers,
        pendingMembers,
        assignedMembers,
        statusMembersLoading,
        statusMembersError,
        assignmentLoading,
        assignmentError,
    } = useAppSelector(state => state.gym);

    // =================================================================
    // LIFECYCLE EFFECTS
    // =================================================================
    useEffect(() => {
        dispatch(fetchMembersByStatus('UNASSIGNED'));
        dispatch(fetchMembersByStatus('PENDING'));
        dispatch(fetchMembersByStatus('ASSIGNED'));
    }, [dispatch]);

    // =================================================================
    // ACTION HANDLERS
    // =================================================================
    const handleApprove = (memberPublicId: string) => {
        dispatch(approveMemberAssignment(memberPublicId))
            .unwrap()
            .then(() => {
                dispatch(fetchMembersByStatus('ASSIGNED'));
            });
    };

    const handleReject = (memberPublicId: string) => {
        dispatch(rejectMemberAssignment(memberPublicId))
            .unwrap()
            .then(() => {
                dispatch(fetchMembersByStatus('UNASSIGNED'));
            });
    };

    // =================================================================
    // EARLY RETURN FOR LOADING STATE
    // =================================================================
    if (statusMembersLoading && unassignedMembers.length === 0 && pendingMembers.length === 0 && assignedMembers.length === 0) {
        return <Loading />;
    }

    // =================================================================
    // MAIN RENDER
    // =================================================================
    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-300">
            
            {/* HEADER SECTION */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="group flex cursor-pointer items-center gap-2 rounded-lg border border-nav-border bg-nav-bg px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-brand-500 hover:text-brand-500 w-max"
                >
                    <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    Geri Dön
                </button>
                
                <div className="mt-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                        SPORCU YÖNETİMİ
                    </span>
                    <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                        ATAMA MERKEZİ
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Sporcular havuzdan talep aşamasına, oradan da onaylı listenize geçer.
                    </p>
                </div>
                
                <hr className="mt-6 border-nav-border" />
            </div>

            {/* PIPELINE STRIP */}
            <div className="mb-6 hidden items-center gap-3 md:flex">
                
                {/* STEP 1 */}
                <div className="flex flex-1 items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-lg border border-nav-border bg-nav-bg px-3.5 py-2.5">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-brand-500 text-[10px] font-black text-brand-500">
                            01
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-300">HAVUZ</span>
                    </div>
                    <IconArrowRight className="h-4 w-4 flex-none text-gray-600" />
                </div>
                
                {/* STEP 2 */}
                <div className="flex flex-1 items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-lg border border-nav-border bg-nav-bg px-3.5 py-2.5">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-brand-500 text-[10px] font-black text-brand-500">
                            02
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-300">BEKLEYEN TALEPLER</span>
                    </div>
                    <IconArrowRight className="h-4 w-4 flex-none text-gray-600" />
                </div>
                
                {/* STEP 3 */}
                <div className="flex flex-[0.8] items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-lg border border-nav-border bg-nav-bg px-3.5 py-2.5">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-brand-500 text-[10px] font-black text-brand-500">
                            03
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-300">SPORCULARIM</span>
                    </div>
                </div>
                
            </div>

            {/* NOTIFICATION AREA */}
            {statusMembersError && <p className="text-sm text-red-500 mb-2">Hata: {statusMembersError}</p>}
            {assignmentError && <p className="text-sm text-red-500 mb-2">Hata: {assignmentError}</p>}
            {assignmentLoading && <p className="text-sm text-gray-400 mb-2">İşleniyor...</p>}

            {/* COLUMNS GRID */}
            <div className="flex flex-col gap-4 md:flex-row">
                
                <UnassignedColumn 
                    members={unassignedMembers} 
                />
                
                <PendingColumn 
                    members={pendingMembers} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                />
                
                <AssignedColumn 
                    members={assignedMembers} 
                />
                
            </div>
            
        </div>
    );
}
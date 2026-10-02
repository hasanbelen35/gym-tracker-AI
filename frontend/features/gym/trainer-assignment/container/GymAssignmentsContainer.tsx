"use client";

// =====================================================================
// IMPORTS
// =====================================================================
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchMembersByStatus, approveMemberAssignment, rejectMemberAssignment } from '@/store/slices/gymSlice';
import Loading from '@/components/Loading';

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
    // REDUX HOOKS
    // =================================================================
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
        <div className="p-6">
            
            {/* NOTIFICATION AREA */}
            {statusMembersError && <p className="text-sm text-red-500 mb-2">Hata: {statusMembersError}</p>}
            {assignmentError && <p className="text-sm text-red-500 mb-2">Hata: {assignmentError}</p>}
            {assignmentLoading && <p className="text-sm text-gray-400 mb-2">İşleniyor...</p>}

            {/* COLUMNS GRID */}
            <div className="flex gap-4">
                
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
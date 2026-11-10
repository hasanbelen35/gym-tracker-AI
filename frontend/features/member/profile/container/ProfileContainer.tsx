'use client';

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
    fetchCurrentMember,
    fetchMemberPrograms,
    fetchMemberSessions,
    fetchMemberMeasurements,
    ExtendedMemberState
} from "@/store/slices/memberSlice";
import { useRouter } from "next/navigation";
import MemberProfileDashboardView from "../components/MemberProfileDashboardView";

export default function MemberProfileDashboardContainer() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        profile,
        programs,
        sessions,
        measurements,
        sessionsPagination,
        measurementsPagination,
        pagination: programsPagination,
        loading,
        error
    } = useAppSelector((state) => state.member as ExtendedMemberState);

    const [selectedMeasurementIndex, setSelectedMeasurementIndex] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchCurrentMember());
        dispatch(fetchMemberPrograms({ page: 1, limit: 10 }));
        dispatch(fetchMemberSessions({ page: 1, limit: 10 }));
        dispatch(fetchMemberMeasurements({ page: 1, limit: 10 }));
    }, [dispatch]);

    const activeMeasurement = measurements[selectedMeasurementIndex] || null;

    return (
        <MemberProfileDashboardView
            profile={profile}
            programs={programs}
            sessions={sessions}
            measurements={measurements}
            sessionsTotal={sessionsPagination.total}
            programsTotal={programsPagination.total}
            activeMeasurement={activeMeasurement}
            selectedMeasurementIndex={selectedMeasurementIndex}
            onSelectMeasurement={setSelectedMeasurementIndex}
            loading={loading}
            error={error}
            onBack={() => router.back()}
            onNewMeasurement={() => router.push("/dashboard/athlete/measurements/new")}
            onNewProgram={() => router.push("/dashboard/athlete/programs/new")}
        />
    );
}
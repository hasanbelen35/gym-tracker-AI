
export interface GymSession {
    id?: number;
    memberId?: number;
    memberName?: string;
    gymId?: number;
    checkIn: string;
    checkOut?: string | null;
    duration?: number;
    gym?: {
        name: string;
    };
};
export
    interface GymSessionsViewProps {
    allSessions: GymSession[];
    activeSessions: GymSession[];
    error: string | null;
    loading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};
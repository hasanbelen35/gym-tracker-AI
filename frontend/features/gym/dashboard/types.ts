
export interface RiskAnalyticsMember {
    memberId: string;
    name: string;
    email: string | null;
    avatarUrl?: string | null;
    reason: string;
    avgGapDays: number | null;
    neverVisited: boolean;
    lastVisitDaysAgo: number;
    visitsLast14Days: number;
    visitsPrev14Days: number;
    recentSessionCount: number;
}

export interface ReasonConfig {
    badgeLabel: string;
    description: string;
    badgeClass: string;
}
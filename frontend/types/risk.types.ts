
// TYPES
export type RiskReason =
    | "NO_VISIT_30_PLUS"
    | "NO_VISIT_10_PLUS"
    | "ABSENCE_ABOVE_USUAL_PATTERN"
    | "VISIT_FREQUENCY_DROPPED"
    | "NEVER_VISITED"
    | "NEW_MEMBER"
    | "REGULAR";

export interface RiskMember {
    memberId: string;
    name: string;
    email: string | null;
    lastVisitDaysAgo: number;
    recentSessionCount: number;
    avgGapDays: number | null;
    visitsLast14Days: number;
    visitsPrev14Days: number;
    neverVisited: boolean;
    reason: RiskReason;
}

export interface RiskSummary {
    total: number;
    regularCount: number;
    atRiskCount: number;
    ghostCount: number;
}

export interface RiskAnalyticsData {
    summary: RiskSummary;
    atRiskMembers: RiskMember[];
    ghostMembers: RiskMember[];
    regularMembers: RiskMember[];
    lastCalculatedAt: string;
    source: "cache" | "calculated";
}

export interface RiskState {
    analytics: RiskAnalyticsData | null;
    loading: boolean;
    error: string | null;
}

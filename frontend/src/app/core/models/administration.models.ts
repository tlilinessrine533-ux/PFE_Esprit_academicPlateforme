export type AdministrativeDecisionStatus = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
export type AdministrativeDecisionAction = 'VALIDE' | 'REJETE';

export interface AdministrationConfig {
  referencePoints: number;
  bonusAbsencePenaltyPerDay: number;
  promotionTeachingPointFactor: number;
  teachingActivityPoint: number;
  supervisionActivityPoint: number;
  researchActivityPoint: number;
  eventActivityPoint: number;
  examSurveillanceActivityPoint: number;
  responsibilityActivityPoint: number;
  totalPrimeAmount: number;
}

export interface AdministrationConfigUpdateRequest {
  referencePoints: number;
  bonusAbsencePenaltyPerDay: number;
  promotionTeachingPointFactor: number;
  teachingActivityPoint: number;
  supervisionActivityPoint: number;
  researchActivityPoint: number;
  eventActivityPoint: number;
  examSurveillanceActivityPoint: number;
  responsibilityActivityPoint: number;
  totalPrimeAmount: number;
}

export interface AdministrativeEvaluationResponse {
  teacherId: number;
  teacherName: string;
  departmentName: string | null;
  periodLabel: string;
  validatedActivities: number;
  validatedTeachingPoints: number;
  absenceDays: number;
  activityTypePoints: number;
  calculatedWeight: number;
  calculatedBonus: number;
  calculatedPromotionPoints: number;
  decisionStatus: AdministrativeDecisionStatus;
  decisionComment: string | null;
  decidedByName: string | null;
  decidedAt: string | null;
}

export interface AdministrativeDecisionHistoryResponse {
  id: number;
  teacherId: number;
  teacherName: string;
  departmentName: string | null;
  periodLabel: string;
  validatedActivities: number;
  validatedTeachingPoints: number;
  absenceDays: number;
  activityTypePoints: number;
  calculatedBonus: number;
  calculatedPromotionPoints: number;
  decisionStatus: AdministrativeDecisionStatus;
  decisionComment: string | null;
  decidedById: number | null;
  decidedByName: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface AdministrativeDecisionRequest {
  periodLabel: string;
  decision: AdministrativeDecisionAction;
  commentText: string | null;
}

export interface AbsenceSummaryResponse {
  teacherId: number;
  teacherName: string;
  departmentName: string | null;
  periodLabel: string;
  totalRequests: number;
  totalAbsenceDays: number;
  validatedAbsenceDays: number;
  pendingAbsenceDays: number;
  rejectedAbsenceDays: number;
}

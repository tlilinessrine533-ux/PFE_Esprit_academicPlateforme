export interface AcademicYearPerformanceSnapshot {
  periodLabel: string;
  totalActivities: number;
  totalTeachingActivities: number;
  totalSupervisions: number;
  totalResearchActivities: number;
  totalEventActivities: number;
  totalExamSurveillanceActivities: number;
  totalResponsibilityActivities: number;
  totalPartnershipActivities: number;
  teachingPerformancePoints: number;
  generalScore: number;
}

export interface DashboardActivityBreakdownItem {
  key: string;
  label: string;
  total: number;
}

export interface DashboardMonthlyTrendPoint {
  monthLabel: string;
  totalActivities: number;
  submittedActivities: number;
  validatedActivities: number;
  rejectedActivities: number;
}

export interface DashboardTeacherBenchmarkItem {
  teacherId: number;
  teacherName: string;
  totalActivities: number;
  totalTeachingActivities: number;
  totalSupervisionActivities: number;
  totalResearchActivities: number;
  totalEventActivities: number;
  totalExamSurveillanceActivities: number;
  totalResponsibilityActivities: number;
  totalPartnershipActivities: number;
  totalSubmittedActivities: number;
  totalValidatedActivities: number;
  totalRejectedActivities: number;
  totalCompletedHours: number;
  totalTeachingPerformancePoints: number;
  validationRatePercent: number;
  totalPromotionPoints: number;
  calculatedPrime: number;
  calculatedWeight: number;
}

export interface DashboardDepartmentBenchmarkItem {
  departmentId: number;
  departmentName: string;
  totalTeachers: number;
  totalActivities: number;
  totalSubmittedActivities: number;
  totalValidatedActivities: number;
  totalRejectedActivities: number;
  totalCompletedHours: number;
  totalTeachingPerformancePoints: number;
  validationRatePercent: number;
}

export interface PersonalDashboardResponse {
  periodLabel: string;
  userId: number;
  teacherName: string;
  departmentName: string | null;
  totalTeachingActivities: number;
  totalPlannedHours: number;
  totalCompletedHours: number;
  teachingHourGap: number;
  totalTeachingPerformancePoints: number;
  facultyTeachingPointsMax: number;
  facultyTeachingPointsAverage: number;
  facultyTeachingPointsMin: number;
  facultyTeacherComparisonCount: number;
  departmentTeachingPointsMax: number;
  departmentTeachingPointsAverage: number;
  departmentTeachingPointsMin: number;
  departmentTeacherComparisonCount: number;
  totalSupervisions: number;
  totalPfe: number;
  totalSupportedSupervisions: number;
  totalResearchActivities: number;
  totalArticles: number;
  totalIndexedResearch: number;
  totalSubmittedActivities: number;
  totalValidatedActivities: number;
  totalRejectedActivities: number;
  totalDeclaredActivities: number;
  validationRatePercent: number;
  totalAccumulatedPoints: number;
  estimatedBonus: number;
  absenceDays: number;
  departmentRankPosition: number;
  departmentRankPopulation: number;
  totalGeneratedReports: number;
  totalEventActivities: number;
  totalExamSurveillanceActivities: number;
  totalResponsibilityActivities: number;
  totalPartnershipActivities: number;
  teachingActivitiesPermanentTeachers: number;
  teachingActivitiesVacataireTeachers: number;
  academicSupervisionsCount: number;
  jurySupervisionsCount: number;
  supervisionBalanceGap: number;
  colleagueSupervisionsCount: number;
  colleagueResearchActivitiesCount: number;
  colleagueEventActivitiesCount: number;
  colleagueExamSurveillanceActivitiesCount: number;
  colleagueResponsibilityActivitiesCount: number;
  colleaguePartnershipActivitiesCount: number;
  taughtGroupsSemesterS1: number;
  taughtGroupsSemesterS2: number;
  surveillancesSemesterS1: number;
  surveillancesSemesterS2: number;
  surveillanceBalanceGap: number;
  currentGeneralScore: number;
  historicalGeneralScoreMax: number;
  historicalGeneralScoreAverage: number;
  historicalGeneralScoreMin: number;
  availableAcademicYears: string[];
  yearlyPerformance: AcademicYearPerformanceSnapshot[];
}

export interface DepartmentDashboardResponse {
  periodLabel: string;
  departmentId: number;
  departmentName: string;
  totalUsers: number;
  totalTeachers: number;
  totalTeachingActivities: number;
  totalCompletedHours: number;
  totalTeachingPerformancePoints: number;
  totalSupervisions: number;
  totalPfe: number;
  totalResearchActivities: number;
  totalEventActivities: number;
  totalExamSurveillanceActivities: number;
  totalResponsibilityActivities: number;
  totalPartnershipActivities: number;
  totalActivities: number;
  totalSubmittedActivities: number;
  totalValidatedActivities: number;
  totalRejectedActivities: number;
  totalPendingActivities: number;
  validationRatePercent: number;
  averageValidationDelayDays: number;
  averagePointsPerTeacher: number;
  bestTeacherScore: number;
  averageAbsenceDays: number;
  departmentActivityRate: number;
  totalGeneratedReports: number;
  activityBreakdown: DashboardActivityBreakdownItem[];
  monthlyTrend: DashboardMonthlyTrendPoint[];
  teacherBenchmark: DashboardTeacherBenchmarkItem[];
}

export interface GlobalDashboardResponse {
  periodLabel: string;
  totalDepartments: number;
  totalUsers: number;
  totalActiveUsers: number;
  totalDisabledUsers: number;
  totalAdministrationUsers: number;
  totalDepartmentHeadUsers: number;
  totalSuperAdminUsers: number;
  totalRoles: number;
  totalTeachers: number;
  systemLogsCount: number;
  systemLogsCountPlaceholder: boolean;
  errorRatePercent: number;
  totalLogins: number;
  totalLoginsPlaceholder: boolean;
  totalConfigurationChanges: number;
  platformAvailabilityPercent: number;
  platformAvailabilityPlaceholder: boolean;
  totalAdministrativeIncidents: number;
  administrativeIncidentsDerived: boolean;
  totalTeachingActivities: number;
  totalCompletedHours: number;
  totalTeachingPerformancePoints: number;
  totalSupervisions: number;
  totalPfe: number;
  totalResearchActivities: number;
  totalEventActivities: number;
  totalExamSurveillanceActivities: number;
  totalResponsibilityActivities: number;
  totalPartnershipActivities: number;
  totalActivities: number;
  totalSubmittedActivities: number;
  totalValidatedActivities: number;
  totalRejectedActivities: number;
  totalGeneratedReports: number;
  activityBreakdown: DashboardActivityBreakdownItem[];
  monthlyTrend: DashboardMonthlyTrendPoint[];
  departmentBenchmark: DashboardDepartmentBenchmarkItem[];
}

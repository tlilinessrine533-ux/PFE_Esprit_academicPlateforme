export type ReportType = 'INDIVIDUEL_ANNUEL' | 'SEMESTRIEL' | 'PROMOTION_ACADEMIQUE' | 'PRIME_PERFORMANCE' | 'DEPARTEMENTAL' | 'INSTITUTIONNEL';

export type ReportFormat = 'PDF' | 'EXCEL';

export interface ReportResponse {
  id: number;
  reportType: ReportType;
  reportFormat: ReportFormat;
  periodLabel: string;
  filePath: string;
  generatedAt: string;
  generatedById: number;
  generatedByName: string;
  targetUserId: number | null;
  targetUserName: string | null;
  departmentId: number | null;
  departmentName: string | null;
}

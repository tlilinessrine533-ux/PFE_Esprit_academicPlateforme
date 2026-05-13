import { ActivityStatus, SemesterType } from './shared.models';

export type SurveillanceSessionDay = 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';

export interface ExamSurveillanceActivityResponse {
  id: number;
  userId: number;
  teacherName: string;
  sessionName: string;
  semester: SemesterType;
  sessionDay: SurveillanceSessionDay;
  sessionPoints: number;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamSurveillanceActivityPayload {
  sessionName: string;
  semester: SemesterType;
  sessionDay: SurveillanceSessionDay;
  hoursCount?: number;
  academicYear: string;
}

export interface ExamSurveillanceSummaryResponse {
  totalSurveillanceActivities: number;
  totalPoints: number;
  totalSemesterS1: number;
  totalSemesterS2: number;
  totalAnnualSessions: number;
}

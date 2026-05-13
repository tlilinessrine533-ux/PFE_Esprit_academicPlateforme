import { ActivityStatus, ResponsibilityType } from './shared.models';

export interface ResponsibilityActivityResponse {
  id: number;
  userId: number;
  teacherName: string;
  responsibilityType: ResponsibilityType;
  startDate: string;
  endDate: string | null;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResponsibilityActivityPayload {
  responsibilityType: ResponsibilityType;
  startDate: string;
  endDate: string | null;
  academicYear: string;
}

export interface ResponsibilitySummaryResponse {
  totalResponsibilities: number;
  totalActiveResponsibilities: number;
  totalCompletedResponsibilities: number;
  totalLeadershipResponsibilities: number;
}

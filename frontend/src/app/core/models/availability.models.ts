import { ActivityStatus, AvailabilityRequestType, LeaveType, MissionKind } from './shared.models';

export interface AvailabilityRequestResponse {
  id: number;
  userId: number;
  teacherName: string;
  requestType: AvailabilityRequestType;
  leaveType: LeaveType | null;
  missionKind: MissionKind | null;
  title: string | null;
  startDate: string;
  endDate: string;
  reason: string;
  pedagogicalUnit: string | null;
  departmentName: string | null;
  hasMedicalCertificate: boolean;
  absenceDays: number;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveAvailabilityPayload {
  leaveType: LeaveType;
  departmentId: number;
  pedagogicalUnit: string;
  startDate: string;
  endDate: string;
  reason: string;
  academicYear: string;
  medicalCertificateImageDataUrl: string | null;
}

export interface CreateMissionAvailabilityPayload {
  missionKind: MissionKind;
  title: string;
  startDate: string;
  endDate: string;
  reason: string;
  academicYear: string;
}

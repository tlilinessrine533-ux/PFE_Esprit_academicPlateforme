import { ActivityStatus, SemesterType, TeachingMode } from './shared.models';

export type TeachingRestructuringStatus = 'NOT_REQUESTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type PartnershipDeclarationType = 'ACADEMIQUE' | 'PROFESSIONNELLE';

export interface TeachingPointsBreakdown {
  coursePoints: number;
  newCoursePoints: number;
  declaredRestructuringPoints: number;
  approvedRestructuringPoints: number;
  syllabusPoints: number;
  carFilePoints: number;
  examPoints: number;
  eveningOrSaturdayPoints: number;
  coordinationPoints: number;
  partnershipPoints: number;
  declaredTotalPoints: number;
  approvedTotalPoints: number;
  restructuringStatus: TeachingRestructuringStatus;
}

export interface TeachingActivityResponse {
  id: number;
  userId: number;
  teacherName: string;
  programName: string;
  className: string;
  moduleName: string;
  semester: SemesterType;
  teachingMode: TeachingMode;
  language: string;
  plannedHours: number;
  completedHours: number;
  newCourseHours: number;
  courseRestructuringPercentage: number;
  syllabusCount: number;
  carFileElaborated: boolean;
  examElaborated: boolean;
  eveningOrSaturdayHours: number;
  coordination: boolean;
  hourGap: number;
  status: ActivityStatus;
  academicYear: string;
  partnershipDeclarationType: PartnershipDeclarationType | null;
  syllabusPath: string | null;
  points: TeachingPointsBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeachingActivityPayload {
  programName: string;
  className: string;
  moduleName: string;
  semester: SemesterType;
  teachingMode: TeachingMode;
  language: string;
  plannedHours: number;
  completedHours: number;
  newCourseHours: number;
  courseRestructuringPercentage: number;
  syllabusCount: number;
  carFileElaborated: boolean;
  examElaborated: boolean;
  eveningOrSaturdayHours: number;
  coordination: boolean;
  academicYear: string;
  partnershipDeclarationType: PartnershipDeclarationType | null;
  syllabusPath: string | null;
}

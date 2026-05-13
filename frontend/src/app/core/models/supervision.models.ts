import { ActivityStatus } from './shared.models';

export type SupervisionType =
  | 'PFE_ENCADREMENT_ACADEMIQUE'
  | 'PFE_RAPPORTEUR'
  | 'PFE_PRESIDENT_JURY'
  | 'SEMINAIRE'
  | 'PI'
  | 'APP0'
  | 'COURS_SOUTIEN'
  | 'PFE'
  | 'MEMOIRE'
  | 'STAGE'
  | 'THESE';

export type SupervisionStatus = 'EN_COURS' | 'SOUTENU';

export type JuryRole = 'ENCADRANT' | 'RAPPORTEUR' | 'PRESIDENT_JURY';

export interface SupervisionActivityResponse {
  id: number;
  userId: number;
  teacherName: string;
  supervisionType: SupervisionType;
  studentName: string;
  studentProgram: string;
  subjectTitle: string;
  supervisionStatus: SupervisionStatus;
  roleInJury: JuryRole;
  quantityValue: number;
  activityPoints: number;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupervisionActivityPayload {
  supervisionType: SupervisionType;
  studentName: string;
  studentProgram: string;
  subjectTitle: string;
  supervisionStatus: SupervisionStatus;
  roleInJury: JuryRole | null;
  quantityValue: number | null;
  academicYear: string;
}

export interface SupervisionSummaryResponse {
  totalSupervisions: number;
  totalPfe: number;
  totalSupported: number;
  totalJuryParticipations: number;
  totalPoints: number;
}

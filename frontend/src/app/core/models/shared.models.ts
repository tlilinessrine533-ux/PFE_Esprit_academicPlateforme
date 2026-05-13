export type RoleType = 'ENSEIGNANT' | 'CHEF_DEPARTEMENT' | 'ADMINISTRATION' | 'SUPER_ADMIN';
export type TeacherType = 'PERMANENT' | 'VACATAIRE';

export type ActivityStatus =
  | 'BROUILLON'
  | 'SOUMISE'
  | 'VALIDEE_DEPARTEMENT'
  | 'VALIDEE_FINALE'
  | 'REJETEE'
  | 'A_CORRIGER';

export type SemesterType = 'S1' | 'S2' | 'ANNUEL';

export type TeachingMode = 'PRESENTIEL' | 'EN_LIGNE' | 'ALTERNANCE' | 'EXECUTIF';

export type EventType = 'SEMINAIRE' | 'COLLOQUE' | 'WORKSHOP' | 'JOURNEE_SCIENTIFIQUE' | 'AUTRE';

export type ResponsibilityType =
  | 'MAITRE_STAGE'
  | 'COORDINATEUR_MODULE'
  | 'RESPONSABLE_FILIERE'
  | 'CHEF_DEPARTEMENT'
  | 'AUTRE';

export type AvailabilityRequestType = 'CONGE' | 'MISSION';

export type LeaveType = 'ANNUEL' | 'MALADIE' | 'EXCEPTIONNEL' | 'SANS_SOLDE' | 'AUTRE';

export type MissionKind = 'MISSION' | 'CONFERENCE';

export interface Department {
  id: number;
  name: string;
  code: string | null;
}

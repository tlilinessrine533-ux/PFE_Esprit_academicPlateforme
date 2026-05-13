import { RoleType } from './shared.models';

export type ValidationDecision = 'SOUMIS' | 'VALIDE' | 'REJETE' | 'A_CORRIGER';

export type ValidationLevel = 'ENSEIGNANT' | 'CHEF_DEPARTEMENT' | 'ADMINISTRATION';

export interface ValidationHistoryResponse {
  id: number;
  actorId: number;
  actorName: string;
  actorRole: RoleType;
  validationLevel: ValidationLevel;
  decision: ValidationDecision;
  commentText: string | null;
  decidedAt: string;
}

export interface ValidationActionPayload {
  decision: ValidationDecision;
  commentText: string;
}

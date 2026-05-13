import { RoleType } from './shared.models';

export type SignupRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateSignupRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleType;
  departmentId?: number | null;
  departmentName?: string | null;
}

export interface ReviewSignupRequestPayload {
  reviewComment?: string | null;
}

export interface SignupRequestResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  departmentId: number;
  departmentName: string;
  status: SignupRequestStatus;
  reviewComment: string | null;
  reviewedById: number | null;
  reviewedByName: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
}

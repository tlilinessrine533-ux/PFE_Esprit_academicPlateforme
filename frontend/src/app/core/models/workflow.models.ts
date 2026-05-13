import { ActivityStatus } from './shared.models';
import { ValidationActionPayload, ValidationHistoryResponse } from './validation.models';

export type WorkflowActivityType =
  | 'TEACHING'
  | 'SUPERVISION'
  | 'RESEARCH'
  | 'EVENT'
  | 'RESPONSIBILITY'
  | 'LEAVE_REQUEST'
  | 'MISSION_REQUEST'
  | 'EXAM_SURVEILLANCE'
  | 'ACTIVITY';

export interface WorkflowActivityResponse {
  id: number;
  activityType: WorkflowActivityType;
  userId: number;
  teacherName: string;
  title: string;
  subtitle: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowReviewPayload = ValidationActionPayload;
export type WorkflowHistoryResponse = ValidationHistoryResponse;

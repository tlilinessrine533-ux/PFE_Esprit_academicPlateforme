import { ActivityStatus, EventType } from './shared.models';

export interface EventActivityResponse {
  id: number;
  userId: number;
  teacherName: string;
  eventType: EventType;
  title: string;
  eventDate: string;
  organizationRole: string;
  activityPoints: number;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventActivityPayload {
  eventType: EventType;
  title: string;
  eventDate: string;
  organizationRole: string | null;
  academicYear: string;
}

export interface EventSummaryResponse {
  totalEvents: number;
  totalPoints: number;
  totalScientificEvents: number;
  totalClubActivities: number;
  totalHackathons: number;
  totalSchoolActivities: number;
}

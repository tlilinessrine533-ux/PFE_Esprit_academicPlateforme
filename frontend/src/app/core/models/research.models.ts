import { ActivityStatus } from './shared.models';

export type PublicationType =
  | 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE'
  | 'PROJET_RECHERCHE_ARTICLE_CONFERENCE'
  | 'PUBLICATION_ARTICLE'
  | 'PRESENTATION_TRAVAIL'
  | 'ARTICLE'
  | 'CONFERENCE'
  | 'COMMUNICATION'
  | 'PROJET_RECHERCHE'
  | 'CHAPITRE_OUVRAGE';

export type ResearchPublicationRank = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'CONFERENCE';

export interface ResearchActivityResponse {
  id: number;
  userId: number;
  teacherName: string;
  publicationType: PublicationType;
  title: string;
  venueName: string;
  publicationYear: number;
  indexingName: string | null;
  doi: string | null;
  studentName: string | null;
  pfeLevel: string | null;
  deliverable: string | null;
  publicationRank: ResearchPublicationRank | null;
  activityPoints: number;
  status: ActivityStatus;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResearchActivityPayload {
  publicationType: PublicationType;
  title: string;
  venueName: string | null;
  publicationYear: number | null;
  indexingName: string | null;
  doi: string | null;
  studentName: string | null;
  pfeLevel: string | null;
  deliverable: string | null;
  publicationRank: ResearchPublicationRank | null;
  academicYear: string;
}

export interface ResearchSummaryResponse {
  totalResearchActivities: number;
  totalPoints: number;
  totalDevelopmentProjects: number;
  totalResearchProjects: number;
  totalPublications: number;
  totalPresentations: number;
}

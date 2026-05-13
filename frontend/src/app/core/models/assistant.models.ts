export interface AssistantChatRequest {
  question: string;
  periodLabel?: string | null;
  activityId?: number | null;
}

export interface AssistantSuggestedAction {
  label: string;
  route: string;
  reason: string;
  prefill: Record<string, unknown> | null;
}

export interface AssistantChatResponse {
  role: 'ENSEIGNANT' | 'CHEF_DEPARTEMENT' | 'ADMINISTRATION' | 'SUPER_ADMIN';
  language: 'fr' | 'en';
  periodLabel: string;
  summary: string;
  analysis: string;
  recommendations: string[];
  risks: string[];
  evidence: string[];
  suggestedActions: AssistantSuggestedAction[];
  formattedAnswer: string;
}


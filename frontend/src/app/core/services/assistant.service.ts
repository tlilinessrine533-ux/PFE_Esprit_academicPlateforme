import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AssistantChatRequest, AssistantChatResponse } from '../models/assistant.models';

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private readonly http = inject(HttpClient);

  chat(payload: AssistantChatRequest) {
    return this.http.post<AssistantChatResponse>('/api/assistant/chat', payload);
  }
}


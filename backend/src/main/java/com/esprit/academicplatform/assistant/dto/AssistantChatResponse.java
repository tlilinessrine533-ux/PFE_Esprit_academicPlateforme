package com.esprit.academicplatform.assistant.dto;

import java.util.List;

public record AssistantChatResponse(
    String answer,
    List<AssistantSuggestedAction> suggestedActions
) {
}
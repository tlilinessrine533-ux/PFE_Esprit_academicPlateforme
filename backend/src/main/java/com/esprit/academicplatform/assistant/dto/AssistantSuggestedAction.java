package com.esprit.academicplatform.assistant.dto;

import java.util.Map;

public record AssistantSuggestedAction(
    String label,
    String route,
    String reason,
    Map<String, Object> prefill
) {
}


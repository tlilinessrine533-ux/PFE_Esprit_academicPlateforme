package com.esprit.academicplatform.assistant.dto;

import jakarta.validation.constraints.NotBlank;

public record AssistantChatRequest(
    @NotBlank(message = "La question est obligatoire")
    String question,
    String currentRoute,
    String periodLabel,
    String userRole
) {
}

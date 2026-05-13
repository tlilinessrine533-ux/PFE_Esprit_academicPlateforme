package com.esprit.academicplatform.validation.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.ValidationDecision;
import com.esprit.academicplatform.common.enums.ValidationLevel;
import java.time.LocalDateTime;

public record ValidationHistoryResponse(
    Long id,
    Long actorId,
    String actorName,
    RoleType actorRole,
    ValidationLevel validationLevel,
    ValidationDecision decision,
    String commentText,
    LocalDateTime decidedAt
) {
}

package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.JuryRole;
import com.esprit.academicplatform.common.enums.StatutEncadrement;
import com.esprit.academicplatform.common.enums.SupervisionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SupervisionActivityResponse(
    Long id,
    Long userId,
    String teacherName,
    SupervisionType supervisionType,
    String studentName,
    String studentProgram,
    String subjectTitle,
    StatutEncadrement supervisionStatus,
    JuryRole roleInJury,
    BigDecimal quantityValue,
    BigDecimal activityPoints,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

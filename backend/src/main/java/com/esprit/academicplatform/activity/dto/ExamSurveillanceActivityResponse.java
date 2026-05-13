package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.SurveillanceSessionDay;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ExamSurveillanceActivityResponse(
    Long id,
    Long userId,
    String teacherName,
    String sessionName,
    SemesterType semester,
    SurveillanceSessionDay sessionDay,
    BigDecimal sessionPoints,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.TeachingMode;
import com.esprit.academicplatform.common.enums.PartnershipDeclarationType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TeachingActivityResponse(
    Long id,
    Long userId,
    String teacherName,
    String programName,
    String className,
    String moduleName,
    SemesterType semester,
    TeachingMode teachingMode,
    String language,
    BigDecimal plannedHours,
    BigDecimal completedHours,
    BigDecimal newCourseHours,
    Integer courseRestructuringPercentage,
    Integer syllabusCount,
    boolean carFileElaborated,
    boolean examElaborated,
    BigDecimal eveningOrSaturdayHours,
    boolean coordination,
    BigDecimal hourGap,
    ActivityStatus status,
    String academicYear,
    PartnershipDeclarationType partnershipDeclarationType,
    String syllabusPath,
    TeachingPointsBreakdownResponse points,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

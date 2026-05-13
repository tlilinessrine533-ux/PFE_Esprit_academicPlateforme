package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.ResearchPublicationRank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResearchActivityResponse(
    Long id,
    Long userId,
    String teacherName,
    PublicationType publicationType,
    String title,
    String venueName,
    Integer publicationYear,
    String indexingName,
    String doi,
    String studentName,
    String pfeLevel,
    String deliverable,
    ResearchPublicationRank publicationRank,
    BigDecimal activityPoints,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

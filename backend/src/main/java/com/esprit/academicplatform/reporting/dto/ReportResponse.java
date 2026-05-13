package com.esprit.academicplatform.reporting.dto;

import com.esprit.academicplatform.common.enums.FormatRapport;
import com.esprit.academicplatform.common.enums.TypeRapport;
import java.time.LocalDateTime;

public record ReportResponse(
    Long id,
    TypeRapport reportType,
    FormatRapport reportFormat,
    String periodLabel,
    String filePath,
    LocalDateTime generatedAt,
    Long generatedById,
    String generatedByName,
    Long targetUserId,
    String targetUserName,
    Long departmentId,
    String departmentName
) {
}

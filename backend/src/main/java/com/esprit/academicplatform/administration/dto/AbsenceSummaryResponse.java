package com.esprit.academicplatform.administration.dto;

public record AbsenceSummaryResponse(
    Long teacherId,
    String teacherName,
    String departmentName,
    String periodLabel,
    long totalRequests,
    int totalAbsenceDays,
    int validatedAbsenceDays,
    int pendingAbsenceDays,
    int rejectedAbsenceDays
) {
}


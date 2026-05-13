package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import com.esprit.academicplatform.common.enums.LeaveType;
import com.esprit.academicplatform.common.enums.MissionKind;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AvailabilityRequestResponse(
    Long id,
    Long userId,
    String teacherName,
    AvailabilityRequestType requestType,
    LeaveType leaveType,
    MissionKind missionKind,
    String title,
    LocalDate startDate,
    LocalDate endDate,
    String reason,
    String pedagogicalUnit,
    String departmentName,
    boolean hasMedicalCertificate,
    int absenceDays,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

package com.esprit.academicplatform.signuprequest.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.SignupRequestStatus;
import java.time.LocalDateTime;

public record SignupRequestResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    RoleType role,
    Long departmentId,
    String departmentName,
    SignupRequestStatus status,
    String reviewComment,
    Long reviewedById,
    String reviewedByName,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime reviewedAt
) {
}

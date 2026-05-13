package com.esprit.academicplatform.user.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.TeacherType;
import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    RoleType role,
    TeacherType teacherType,
    Long departmentId,
    String departmentName,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

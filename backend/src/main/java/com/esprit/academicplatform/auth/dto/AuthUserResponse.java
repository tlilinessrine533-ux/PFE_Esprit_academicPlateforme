package com.esprit.academicplatform.auth.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.TeacherType;

public record AuthUserResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    RoleType role,
    TeacherType teacherType,
    Long departmentId,
    String departmentName
) {
}

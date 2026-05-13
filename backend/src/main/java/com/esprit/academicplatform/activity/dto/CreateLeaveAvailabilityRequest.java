package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.LeaveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateLeaveAvailabilityRequest(
    @NotNull LeaveType leaveType,
    @NotNull Long departmentId,
    @NotBlank @Size(max = 180) String pedagogicalUnit,
    @NotNull LocalDate startDate,
    @NotNull LocalDate endDate,
    @NotBlank @Size(max = 2000) String reason,
    @NotBlank @Size(max = 20) String academicYear,
    @Size(max = 7500000) String medicalCertificateImageDataUrl
) {
}

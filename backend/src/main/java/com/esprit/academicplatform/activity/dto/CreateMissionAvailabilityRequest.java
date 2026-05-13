package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.MissionKind;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateMissionAvailabilityRequest(
    @NotNull MissionKind missionKind,
    @NotBlank @Size(max = 180) String title,
    @NotNull LocalDate startDate,
    @NotNull LocalDate endDate,
    @NotBlank @Size(max = 2000) String reason,
    @NotBlank @Size(max = 20) String academicYear
) {
}

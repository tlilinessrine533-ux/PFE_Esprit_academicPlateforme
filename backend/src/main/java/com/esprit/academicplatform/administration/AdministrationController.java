package com.esprit.academicplatform.administration;

import com.esprit.academicplatform.administration.dto.AbsenceSummaryResponse;
import com.esprit.academicplatform.administration.dto.AdministrationConfigResponse;
import com.esprit.academicplatform.administration.dto.AdministrationConfigUpdateRequest;
import com.esprit.academicplatform.administration.dto.AdministrativeDecisionHistoryResponse;
import com.esprit.academicplatform.administration.dto.AdministrativeDecisionRequest;
import com.esprit.academicplatform.administration.dto.AdministrativeEvaluationResponse;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/administration")
@RequiredArgsConstructor
public class AdministrationController {

    private final AdministrationService administrationService;

    @GetMapping("/config")
    public AdministrationConfigResponse getConfiguration(Principal principal) {
        return administrationService.getConfiguration(principal.getName());
    }

    @PutMapping("/config")
    public AdministrationConfigResponse updateConfiguration(
        @Valid @RequestBody AdministrationConfigUpdateRequest request,
        Principal principal
    ) {
        return administrationService.updateConfiguration(request, principal.getName());
    }

    @GetMapping("/evaluations")
    public List<AdministrativeEvaluationResponse> getEvaluations(
        @RequestParam(required = false) String periodLabel,
        Principal principal
    ) {
        return administrationService.getEvaluations(periodLabel, principal.getName());
    }

    @PostMapping("/evaluations/{teacherId}/final-decision")
    public AdministrativeDecisionHistoryResponse submitFinalDecision(
        @PathVariable Long teacherId,
        @Valid @RequestBody AdministrativeDecisionRequest request,
        Principal principal
    ) {
        return administrationService.submitFinalDecision(teacherId, request, principal.getName());
    }

    @GetMapping("/history")
    public List<AdministrativeDecisionHistoryResponse> getDecisionHistory(
        @RequestParam(required = false) String periodLabel,
        Principal principal
    ) {
        return administrationService.getDecisionHistory(periodLabel, principal.getName());
    }

    @GetMapping("/absences")
    public List<AbsenceSummaryResponse> getAbsenceSummaries(
        @RequestParam(required = false) String periodLabel,
        Principal principal
    ) {
        return administrationService.getAbsenceSummaries(periodLabel, principal.getName());
    }
}


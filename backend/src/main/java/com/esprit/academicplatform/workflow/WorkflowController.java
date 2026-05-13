package com.esprit.academicplatform.workflow;

import com.esprit.academicplatform.validation.dto.ValidationActionRequest;
import com.esprit.academicplatform.validation.dto.ValidationHistoryResponse;
import com.esprit.academicplatform.workflow.dto.WorkflowActivityResponse;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workflow")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping("/activities")
    public List<WorkflowActivityResponse> getAccessibleActivities(Principal principal) {
        return workflowService.getAccessibleActivities(principal.getName());
    }

    @GetMapping("/pending/department")
    public List<WorkflowActivityResponse> getDepartmentPendingActivities(Principal principal) {
        return workflowService.getDepartmentPendingActivities(principal.getName());
    }

    @GetMapping("/pending/final")
    public List<WorkflowActivityResponse> getFinalPendingActivities(Principal principal) {
        return workflowService.getFinalPendingActivities(principal.getName());
    }

    @GetMapping("/{id}/history")
    public List<ValidationHistoryResponse> getValidationHistory(@PathVariable Long id, Principal principal) {
        return workflowService.getValidationHistory(id, principal.getName());
    }

    @PostMapping("/{id}/submit")
    public WorkflowActivityResponse submitActivity(@PathVariable Long id, Principal principal) {
        return workflowService.submitActivity(id, principal.getName());
    }

    @PostMapping("/{id}/department-review")
    public WorkflowActivityResponse departmentReviewActivity(
        @PathVariable Long id,
        @Valid @RequestBody ValidationActionRequest request,
        Principal principal
    ) {
        return workflowService.departmentReviewActivity(id, request, principal.getName());
    }

    @PostMapping("/{id}/final-review")
    public WorkflowActivityResponse finalReviewActivity(
        @PathVariable Long id,
        @Valid @RequestBody ValidationActionRequest request,
        Principal principal
    ) {
        return workflowService.finalReviewActivity(id, request, principal.getName());
    }
}

package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateTeachingActivityRequest;
import com.esprit.academicplatform.activity.dto.TeachingActivityResponse;
import com.esprit.academicplatform.activity.dto.UpdateTeachingActivityRequest;
import com.esprit.academicplatform.validation.dto.ValidationActionRequest;
import com.esprit.academicplatform.validation.dto.ValidationHistoryResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teaching-activities")
@RequiredArgsConstructor
public class TeachingActivityController {

    private final TeachingActivityService teachingActivityService;

    @GetMapping
    public List<TeachingActivityResponse> getAccessibleTeachingActivities(Principal principal) {
        return teachingActivityService.getAccessibleTeachingActivities(principal.getName());
    }

    @GetMapping("/{id}")
    public TeachingActivityResponse getTeachingActivityById(@PathVariable Long id, Principal principal) {
        return teachingActivityService.getTeachingActivityById(id, principal.getName());
    }

    @PostMapping
    public ResponseEntity<TeachingActivityResponse> createTeachingActivity(
        @Valid @RequestBody CreateTeachingActivityRequest request,
        Principal principal
    ) {
        TeachingActivityResponse created = teachingActivityService.createTeachingActivity(request, principal.getName());
        return ResponseEntity.created(URI.create("/api/teaching-activities/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public TeachingActivityResponse updateTeachingActivity(
        @PathVariable Long id,
        @Valid @RequestBody UpdateTeachingActivityRequest request,
        Principal principal
    ) {
        return teachingActivityService.updateTeachingActivity(id, request, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeachingActivity(@PathVariable Long id, Principal principal) {
        teachingActivityService.deleteTeachingActivity(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public TeachingActivityResponse submitTeachingActivity(@PathVariable Long id, Principal principal) {
        return teachingActivityService.submitTeachingActivity(id, principal.getName());
    }

    @GetMapping("/pending/department")
    public List<TeachingActivityResponse> getDepartmentPendingTeachingActivities(Principal principal) {
        return teachingActivityService.getDepartmentPendingTeachingActivities(principal.getName());
    }

    @GetMapping("/pending/final")
    public List<TeachingActivityResponse> getFinalPendingTeachingActivities(Principal principal) {
        return teachingActivityService.getFinalPendingTeachingActivities(principal.getName());
    }

    @PostMapping("/{id}/department-review")
    public TeachingActivityResponse departmentReviewTeachingActivity(
        @PathVariable Long id,
        @Valid @RequestBody ValidationActionRequest request,
        Principal principal
    ) {
        return teachingActivityService.departmentReviewTeachingActivity(id, request, principal.getName());
    }

    @PostMapping("/{id}/final-review")
    public TeachingActivityResponse finalReviewTeachingActivity(
        @PathVariable Long id,
        @Valid @RequestBody ValidationActionRequest request,
        Principal principal
    ) {
        return teachingActivityService.finalReviewTeachingActivity(id, request, principal.getName());
    }

    @GetMapping("/{id}/validation-history")
    public List<ValidationHistoryResponse> getValidationHistory(@PathVariable Long id, Principal principal) {
        return teachingActivityService.getValidationHistory(id, principal.getName());
    }
}

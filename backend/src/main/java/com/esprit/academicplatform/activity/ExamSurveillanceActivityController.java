package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateExamSurveillanceActivityRequest;
import com.esprit.academicplatform.activity.dto.ExamSurveillanceActivityResponse;
import com.esprit.academicplatform.activity.dto.ExamSurveillanceSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateExamSurveillanceActivityRequest;
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
@RequestMapping("/api/exam-surveillance-activities")
@RequiredArgsConstructor
public class ExamSurveillanceActivityController {

    private final ExamSurveillanceActivityService examSurveillanceActivityService;

    @GetMapping
    public List<ExamSurveillanceActivityResponse> getAccessibleExamSurveillanceActivities(Principal principal) {
        return examSurveillanceActivityService.getAccessibleExamSurveillanceActivities(principal.getName());
    }

    @GetMapping("/summary")
    public ExamSurveillanceSummaryResponse getExamSurveillanceSummary(Principal principal) {
        return examSurveillanceActivityService.getExamSurveillanceSummary(principal.getName());
    }

    @GetMapping("/{id}")
    public ExamSurveillanceActivityResponse getExamSurveillanceActivityById(@PathVariable Long id, Principal principal) {
        return examSurveillanceActivityService.getExamSurveillanceActivityById(id, principal.getName());
    }

    @PostMapping
    public ResponseEntity<ExamSurveillanceActivityResponse> createExamSurveillanceActivity(
        @Valid @RequestBody CreateExamSurveillanceActivityRequest request,
        Principal principal
    ) {
        ExamSurveillanceActivityResponse created = examSurveillanceActivityService.createExamSurveillanceActivity(
            request,
            principal.getName()
        );
        return ResponseEntity.created(URI.create("/api/exam-surveillance-activities/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public ExamSurveillanceActivityResponse updateExamSurveillanceActivity(
        @PathVariable Long id,
        @Valid @RequestBody UpdateExamSurveillanceActivityRequest request,
        Principal principal
    ) {
        return examSurveillanceActivityService.updateExamSurveillanceActivity(id, request, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamSurveillanceActivity(@PathVariable Long id, Principal principal) {
        examSurveillanceActivityService.deleteExamSurveillanceActivity(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

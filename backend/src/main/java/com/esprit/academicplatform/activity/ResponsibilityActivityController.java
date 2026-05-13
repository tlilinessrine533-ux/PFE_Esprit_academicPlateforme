package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateResponsibilityActivityRequest;
import com.esprit.academicplatform.activity.dto.ResponsibilityActivityResponse;
import com.esprit.academicplatform.activity.dto.ResponsibilitySummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateResponsibilityActivityRequest;
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
@RequestMapping("/api/responsibility-activities")
@RequiredArgsConstructor
public class ResponsibilityActivityController {

    private final ResponsibilityActivityService responsibilityActivityService;

    @GetMapping
    public List<ResponsibilityActivityResponse> getAccessibleResponsibilities(Principal principal) {
        return responsibilityActivityService.getAccessibleResponsibilities(principal.getName());
    }

    @GetMapping("/summary")
    public ResponsibilitySummaryResponse getResponsibilitySummary(Principal principal) {
        return responsibilityActivityService.getResponsibilitySummary(principal.getName());
    }

    @GetMapping("/{id}")
    public ResponsibilityActivityResponse getResponsibilityById(@PathVariable Long id, Principal principal) {
        return responsibilityActivityService.getResponsibilityById(id, principal.getName());
    }

    @PostMapping
    public ResponseEntity<ResponsibilityActivityResponse> createResponsibility(
        @Valid @RequestBody CreateResponsibilityActivityRequest request,
        Principal principal
    ) {
        ResponsibilityActivityResponse created = responsibilityActivityService.createResponsibility(
            request,
            principal.getName()
        );
        return ResponseEntity.created(URI.create("/api/responsibility-activities/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public ResponsibilityActivityResponse updateResponsibility(
        @PathVariable Long id,
        @Valid @RequestBody UpdateResponsibilityActivityRequest request,
        Principal principal
    ) {
        return responsibilityActivityService.updateResponsibility(id, request, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResponsibility(@PathVariable Long id, Principal principal) {
        responsibilityActivityService.deleteResponsibility(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

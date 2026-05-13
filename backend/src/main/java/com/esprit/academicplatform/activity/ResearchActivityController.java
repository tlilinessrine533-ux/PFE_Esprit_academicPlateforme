package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateResearchActivityRequest;
import com.esprit.academicplatform.activity.dto.ResearchActivityResponse;
import com.esprit.academicplatform.activity.dto.ResearchSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateResearchActivityRequest;
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
@RequestMapping("/api/research-activities")
@RequiredArgsConstructor
public class ResearchActivityController {

    private final ResearchActivityService researchActivityService;

    @GetMapping
    public List<ResearchActivityResponse> getAccessibleResearchActivities(Principal principal) {
        return researchActivityService.getAccessibleResearchActivities(principal.getName());
    }

    @GetMapping("/summary")
    public ResearchSummaryResponse getResearchSummary(Principal principal) {
        return researchActivityService.getResearchSummary(principal.getName());
    }

    @GetMapping("/{id}")
    public ResearchActivityResponse getResearchActivityById(@PathVariable Long id, Principal principal) {
        return researchActivityService.getResearchActivityById(id, principal.getName());
    }

    @PostMapping
    public ResponseEntity<ResearchActivityResponse> createResearchActivity(
        @Valid @RequestBody CreateResearchActivityRequest request,
        Principal principal
    ) {
        ResearchActivityResponse created = researchActivityService.createResearchActivity(request, principal.getName());
        return ResponseEntity.created(URI.create("/api/research-activities/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public ResearchActivityResponse updateResearchActivity(
        @PathVariable Long id,
        @Valid @RequestBody UpdateResearchActivityRequest request,
        Principal principal
    ) {
        return researchActivityService.updateResearchActivity(id, request, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResearchActivity(@PathVariable Long id, Principal principal) {
        researchActivityService.deleteResearchActivity(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

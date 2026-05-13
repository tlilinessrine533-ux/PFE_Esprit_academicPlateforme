package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateSupervisionActivityRequest;
import com.esprit.academicplatform.activity.dto.SupervisionActivityResponse;
import com.esprit.academicplatform.activity.dto.SupervisionSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateSupervisionActivityRequest;
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
@RequestMapping("/api/supervision-activities")
@RequiredArgsConstructor
public class SupervisionActivityController {

    private final SupervisionActivityService supervisionActivityService;

    @GetMapping
    public List<SupervisionActivityResponse> getAccessibleSupervisionActivities(Principal principal) {
        return supervisionActivityService.getAccessibleSupervisionActivities(principal.getName());
    }

    @GetMapping("/summary")
    public SupervisionSummaryResponse getSupervisionSummary(Principal principal) {
        return supervisionActivityService.getSupervisionSummary(principal.getName());
    }

    @GetMapping("/{id}")
    public SupervisionActivityResponse getSupervisionActivityById(@PathVariable Long id, Principal principal) {
        return supervisionActivityService.getSupervisionActivityById(id, principal.getName());
    }

    @PostMapping
    public ResponseEntity<SupervisionActivityResponse> createSupervisionActivity(
        @Valid @RequestBody CreateSupervisionActivityRequest request,
        Principal principal
    ) {
        SupervisionActivityResponse created = supervisionActivityService.createSupervisionActivity(
            request,
            principal.getName()
        );
        return ResponseEntity.created(URI.create("/api/supervision-activities/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public SupervisionActivityResponse updateSupervisionActivity(
        @PathVariable Long id,
        @Valid @RequestBody UpdateSupervisionActivityRequest request,
        Principal principal
    ) {
        return supervisionActivityService.updateSupervisionActivity(id, request, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupervisionActivity(@PathVariable Long id, Principal principal) {
        supervisionActivityService.deleteSupervisionActivity(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.AvailabilityRequestResponse;
import com.esprit.academicplatform.activity.dto.CreateLeaveAvailabilityRequest;
import com.esprit.academicplatform.activity.dto.CreateMissionAvailabilityRequest;
import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import jakarta.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/availability-requests")
@RequiredArgsConstructor
public class AvailabilityRequestActivityController {

    private final AvailabilityRequestActivityService availabilityRequestActivityService;

    @GetMapping
    public List<AvailabilityRequestResponse> getAccessibleRequests(
        @RequestParam AvailabilityRequestType type,
        Principal principal
    ) {
        return availabilityRequestActivityService.getAccessibleRequests(type, principal.getName());
    }

    @PostMapping("/leave")
    public ResponseEntity<AvailabilityRequestResponse> createLeaveRequest(
        @Valid @RequestBody CreateLeaveAvailabilityRequest request,
        Principal principal
    ) {
        AvailabilityRequestResponse created = availabilityRequestActivityService.createLeaveRequest(
            request,
            principal.getName()
        );
        return ResponseEntity.created(URI.create("/api/availability-requests/" + created.id())).body(created);
    }

    @PostMapping("/mission")
    public ResponseEntity<AvailabilityRequestResponse> createMissionRequest(
        @Valid @RequestBody CreateMissionAvailabilityRequest request,
        Principal principal
    ) {
        AvailabilityRequestResponse created = availabilityRequestActivityService.createMissionRequest(
            request,
            principal.getName()
        );
        return ResponseEntity.created(URI.create("/api/availability-requests/" + created.id())).body(created);
    }
}

package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateEventActivityRequest;
import com.esprit.academicplatform.activity.dto.EventActivityResponse;
import com.esprit.academicplatform.activity.dto.EventSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateEventActivityRequest;
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
@RequestMapping("/api/event-activities")
@RequiredArgsConstructor
public class EventActivityController {

    private final EventActivityService eventActivityService;

    @GetMapping
    public List<EventActivityResponse> getAccessibleEventActivities(Principal principal) {
        return eventActivityService.getAccessibleEventActivities(principal.getName());
    }

    @GetMapping("/summary")
    public EventSummaryResponse getEventSummary(Principal principal) {
        return eventActivityService.getEventSummary(principal.getName());
    }

    @GetMapping("/{id}")
    public EventActivityResponse getEventActivityById(@PathVariable Long id, Principal principal) {
        return eventActivityService.getEventActivityById(id, principal.getName());
    }

    @PostMapping
    public ResponseEntity<EventActivityResponse> createEventActivity(
        @Valid @RequestBody CreateEventActivityRequest request,
        Principal principal
    ) {
        EventActivityResponse created = eventActivityService.createEventActivity(request, principal.getName());
        return ResponseEntity.created(URI.create("/api/event-activities/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public EventActivityResponse updateEventActivity(
        @PathVariable Long id,
        @Valid @RequestBody UpdateEventActivityRequest request,
        Principal principal
    ) {
        return eventActivityService.updateEventActivity(id, request, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventActivity(@PathVariable Long id, Principal principal) {
        eventActivityService.deleteEventActivity(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

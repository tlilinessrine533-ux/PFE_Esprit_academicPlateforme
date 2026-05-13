package com.esprit.academicplatform.signuprequest;

import com.esprit.academicplatform.signuprequest.dto.CreateSignupRequest;
import com.esprit.academicplatform.signuprequest.dto.ReviewSignupRequest;
import com.esprit.academicplatform.signuprequest.dto.SignupRequestResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/signup-requests")
@RequiredArgsConstructor
public class SignupRequestController {

    private final SignupRequestService signupRequestService;

    @PostMapping
    public ResponseEntity<SignupRequestResponse> createRequest(@Valid @RequestBody CreateSignupRequest request) {
        SignupRequestResponse createdRequest = signupRequestService.createRequest(request);
        return ResponseEntity
            .created(URI.create("/api/signup-requests/" + createdRequest.id()))
            .body(createdRequest);
    }

    @GetMapping
    public List<SignupRequestResponse> getAllRequests() {
        return signupRequestService.getAllRequests();
    }

    @PostMapping("/{id}/approve")
    public SignupRequestResponse approveRequest(
        @PathVariable Long id,
        @Valid @RequestBody ReviewSignupRequest request,
        Principal principal
    ) {
        return signupRequestService.approveRequest(id, request, principal.getName());
    }

    @PostMapping("/{id}/reject")
    public SignupRequestResponse rejectRequest(
        @PathVariable Long id,
        @Valid @RequestBody ReviewSignupRequest request,
        Principal principal
    ) {
        return signupRequestService.rejectRequest(id, request, principal.getName());
    }
}

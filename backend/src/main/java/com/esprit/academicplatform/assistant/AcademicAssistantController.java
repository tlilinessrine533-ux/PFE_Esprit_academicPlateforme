package com.esprit.academicplatform.assistant;

import com.esprit.academicplatform.assistant.dto.AssistantChatRequest;
import com.esprit.academicplatform.assistant.dto.AssistantChatResponse;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AcademicAssistantController {

    private final AcademicAssistantService academicAssistantService;

    @PostMapping("/chat")
    public AssistantChatResponse chat(@Valid @RequestBody AssistantChatRequest request, Principal principal) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie");
        }
        return academicAssistantService.chat(principal.getName(), request);
    }
}

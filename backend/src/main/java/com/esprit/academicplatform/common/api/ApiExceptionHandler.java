package com.esprit.academicplatform.common.api;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatusException(
        ResponseStatusException exception,
        HttpServletRequest request
    ) {
        HttpStatusCode statusCode = exception.getStatusCode();
        String reasonPhrase = statusCode.toString();
        String message = exception.getReason() != null && !exception.getReason().isBlank()
            ? exception.getReason()
            : reasonPhrase;

        return ResponseEntity.status(statusCode).body(
            new ApiErrorResponse(
                Instant.now(),
                statusCode.value(),
                reasonPhrase,
                message,
                request.getRequestURI()
            )
        );
    }
}

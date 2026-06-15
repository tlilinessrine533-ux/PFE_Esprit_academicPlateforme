package com.esprit.academicplatform.common.api;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {
        String details = exception.getBindingResult().getFieldErrors().stream()
            .map(this::fieldErrorMessage)
            .collect(Collectors.joining(", "));

        String message = details.isBlank() ? "Requete invalide." : details;
        HttpStatusCode statusCode = HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(statusCode).body(
            new ApiErrorResponse(
                Instant.now(),
                statusCode.value(),
                statusCode.toString(),
                message,
                request.getRequestURI()
            )
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadableException(
        HttpMessageNotReadableException exception,
        HttpServletRequest request
    ) {
        HttpStatusCode statusCode = HttpStatus.BAD_REQUEST;

        String causeMessage = exception.getMostSpecificCause() != null
            ? exception.getMostSpecificCause().getMessage()
            : null;
        String message = causeMessage != null && !causeMessage.isBlank()
            ? "Format de donnees invalide: " + causeMessage
            : "Format de donnees invalide.";

        return ResponseEntity.status(statusCode).body(
            new ApiErrorResponse(
                Instant.now(),
                statusCode.value(),
                statusCode.toString(),
                message,
                request.getRequestURI()
            )
        );
    }

    private String fieldErrorMessage(FieldError error) {
        String field = error.getField() != null ? error.getField() : "champ";
        String defaultMessage = error.getDefaultMessage() != null ? error.getDefaultMessage() : "valeur invalide";
        return field + ": " + defaultMessage;
    }
}

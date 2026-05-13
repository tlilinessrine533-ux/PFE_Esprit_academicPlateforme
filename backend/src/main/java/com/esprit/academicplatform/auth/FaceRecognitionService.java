package com.esprit.academicplatform.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class FaceRecognitionService {

    private static final int EXPECTED_DESCRIPTOR_LENGTH = 128;

    private final ObjectMapper objectMapper;

    public String serializeDescriptor(List<Double> descriptor) {
        validateDescriptor(descriptor);

        try {
            return objectMapper.writeValueAsString(descriptor);
        } catch (JsonProcessingException exception) {
            throw invalidDescriptor("Le descripteur facial n'a pas pu etre enregistre.");
        }
    }

    public List<Double> deserializeDescriptor(String rawDescriptor) {
        try {
            List<Double> descriptor = objectMapper.readValue(rawDescriptor, new TypeReference<List<Double>>() {
            });
            validateDescriptor(descriptor);
            return descriptor;
        } catch (JsonProcessingException exception) {
            throw invalidDescriptor("Le descripteur facial enregistre est invalide.");
        }
    }

    public double computeDistance(List<Double> sourceDescriptor, List<Double> candidateDescriptor) {
        validateDescriptor(sourceDescriptor);
        validateDescriptor(candidateDescriptor);

        double sum = 0;
        for (int index = 0; index < EXPECTED_DESCRIPTOR_LENGTH; index++) {
            double delta = sourceDescriptor.get(index) - candidateDescriptor.get(index);
            sum += delta * delta;
        }

        return Math.sqrt(sum);
    }

    public void validateDescriptor(List<Double> descriptor) {
        if (descriptor == null || descriptor.size() != EXPECTED_DESCRIPTOR_LENGTH) {
            throw invalidDescriptor("Le descripteur facial est incomplet.");
        }

        for (Double value : descriptor) {
            if (value == null || !Double.isFinite(value)) {
                throw invalidDescriptor("Le descripteur facial est invalide.");
            }
        }
    }

    private ResponseStatusException invalidDescriptor(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}

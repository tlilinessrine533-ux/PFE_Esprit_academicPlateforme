package com.esprit.academicplatform.assistant;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebsiteKnowledgeService {

    private final ObjectMapper objectMapper;

    private List<WebsiteKnowledgeEntry> knowledgeEntries = Collections.emptyList();

    @PostConstruct
    public void init() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("assistant-knowledge.json")) {
            if (inputStream == null) {
                throw new IllegalStateException("assistant-knowledge.json not found in resources");
            }

            knowledgeEntries = objectMapper.readValue(
                inputStream,
                new TypeReference<List<WebsiteKnowledgeEntry>>() {}
            );
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load assistant knowledge file", e);
        }
    }

    public List<WebsiteKnowledgeEntry> getAll() {
        return knowledgeEntries;
    }
}
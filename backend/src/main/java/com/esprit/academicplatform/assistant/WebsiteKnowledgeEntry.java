package com.esprit.academicplatform.assistant;

import java.util.List;

public record WebsiteKnowledgeEntry(
    String route,
    List<String> aliases,
    String title,
    String description,
    List<String> keywords,
    List<String> faqHints,
    List<String> allowedRoles,
    List<String> mainActions,
    String notes
) {
}
package com.esprit.academicplatform.workflow;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.workflow.mail")
public class WorkflowMailProperties {

    private String sender = "no-reply@esprit.tn";
    private String rhRecipient = "";
    private String scolariteRecipient = "";

    public List<String> availabilityApprovalRecipients() {
        Set<String> recipients = new LinkedHashSet<>();
        addIfPresent(recipients, rhRecipient);
        addIfPresent(recipients, scolariteRecipient);
        return new ArrayList<>(recipients);
    }

    private void addIfPresent(Set<String> recipients, String candidate) {
        if (!StringUtils.hasText(candidate)) {
            return;
        }

        recipients.add(candidate.trim());
    }
}

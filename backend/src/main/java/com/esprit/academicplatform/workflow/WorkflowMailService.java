package com.esprit.academicplatform.workflow;

import com.esprit.academicplatform.activity.AvailabilityRequestActivity;
import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import com.esprit.academicplatform.common.enums.LeaveType;
import com.esprit.academicplatform.common.enums.MissionKind;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.user.User;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowMailService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final WorkflowMailProperties workflowMailProperties;

    public void sendAvailabilityApprovalMail(AvailabilityRequestActivity activity, User departmentHead) {
        System.out.println("========== MAIL DEBUG START ==========");
        System.out.println("MAIL DEBUG - sendAvailabilityApprovalMail called");
        System.out.println("MAIL DEBUG - activity id = " + activity.getId());
        System.out.println("MAIL DEBUG - sender = " + workflowMailProperties.getSender());

        List<String> recipients = workflowMailProperties.availabilityApprovalRecipients();
        System.out.println("MAIL DEBUG - recipients = " + recipients);

        if (recipients.isEmpty()) {
            System.out.println("MAIL DEBUG - STOP: no recipients configured");
            log.info("Skipping availability approval email for activity {} because no recipients are configured.", activity.getId());
            System.out.println("========== MAIL DEBUG END ==========");
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        System.out.println("MAIL DEBUG - mailSender available = " + (mailSender != null));

        if (mailSender == null) {
            System.out.println("MAIL DEBUG - STOP: JavaMailSender unavailable");
            log.warn("Skipping availability approval email for activity {} because mail sender is unavailable.", activity.getId());
            System.out.println("========== MAIL DEBUG END ==========");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();

        if (StringUtils.hasText(workflowMailProperties.getSender())) {
            message.setFrom(workflowMailProperties.getSender().trim());
        }

        message.setTo(recipients.toArray(String[]::new));
        message.setSubject(buildSubject(activity));
        message.setText(buildBody(activity, departmentHead));

        System.out.println("MAIL DEBUG - from = " + workflowMailProperties.getSender());
        System.out.println("MAIL DEBUG - to = " + recipients);
        System.out.println("MAIL DEBUG - subject = " + message.getSubject());
        System.out.println("MAIL DEBUG - sending email...");

        try {
            mailSender.send(message);
            System.out.println("MAIL DEBUG - SUCCESS: email sent");
            log.info("Availability approval email sent for activity {} to {}.", activity.getId(), recipients);
        } catch (MailException exception) {
            System.out.println("MAIL DEBUG - FAILED: email not sent");
            exception.printStackTrace();
            log.warn(
                "Failed to send availability approval email for activity {} to {}: {}",
                activity.getId(),
                recipients,
                exception.getMessage()
            );
        }

        System.out.println("========== MAIL DEBUG END ==========");
    }

    private String buildSubject(AvailabilityRequestActivity activity) {
        return "[ESPRIT] " + requestTypeLabel(activity) + " validee par le chef de departement";
    }

    private String buildBody(AvailabilityRequestActivity activity, User departmentHead) {
        User teacher = activity.getUser();
        Department selectedDepartment = activity.getDepartment();
        String departmentName = selectedDepartment != null
            ? selectedDepartment.getName()
            : (StringUtils.hasText(activity.getDepartmentName()) ? activity.getDepartmentName() : "Non renseigne");

        return """
            Bonjour,

            Une %s a ete validee par le chef de departement et doit etre prise en charge.

            Enseignant : %s %s
            Email enseignant : %s
            Departement : %s
            Annee universitaire : %s
            Periode : du %s au %s
            Intitule : %s
            Detail : %s
            Validee par : %s %s

            Merci de poursuivre le traitement administratif.

            Plateforme academique ESPRIT
            """.formatted(
            requestTypeLabel(activity).toLowerCase(),
            teacher.getFirstName(),
            teacher.getLastName(),
            teacher.getEmail(),
            departmentName,
            activity.getAcademicYear(),
            activity.getStartDate().format(DATE_FORMATTER),
            activity.getEndDate().format(DATE_FORMATTER),
            requestTitle(activity),
            safeText(activity.getReason()),
            departmentHead.getFirstName(),
            departmentHead.getLastName()
        );
    }

    private String requestTypeLabel(AvailabilityRequestActivity activity) {
        if (activity.getRequestType() == AvailabilityRequestType.CONGE) {
            return "Demande de conge";
        }

        return "Demande de mission";
    }

    private String requestTitle(AvailabilityRequestActivity activity) {
        if (activity.getRequestType() == AvailabilityRequestType.CONGE) {
            LeaveType leaveType = activity.getLeaveType();
            return leaveType != null ? "Conge " + leaveType.name() : "Conge";
        }

        if (StringUtils.hasText(activity.getTitle())) {
            return activity.getTitle().trim();
        }

        MissionKind missionKind = activity.getMissionKind();
        if (missionKind == MissionKind.CONFERENCE) {
            return "Participation a une conference";
        }

        return "Mission";
    }

    private String safeText(String value) {
        return StringUtils.hasText(value) ? value.trim() : "Non renseigne";
    }
}
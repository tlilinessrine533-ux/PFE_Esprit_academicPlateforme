package com.esprit.academicplatform.workflow;

import com.esprit.academicplatform.activity.Activity;
import com.esprit.academicplatform.activity.ActivityRepository;
import com.esprit.academicplatform.activity.AvailabilityRequestActivity;
import com.esprit.academicplatform.activity.EventActivity;
import com.esprit.academicplatform.activity.ExamSurveillanceActivity;
import com.esprit.academicplatform.activity.ResearchActivity;
import com.esprit.academicplatform.activity.ResponsibilityActivity;
import com.esprit.academicplatform.activity.SupervisionActivity;
import com.esprit.academicplatform.activity.TeachingActivity;
import com.esprit.academicplatform.activity.TeachingPerformanceCalculator;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.MissionKind;
import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.ResearchPublicationRank;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.ValidationDecision;
import com.esprit.academicplatform.common.enums.ValidationLevel;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.notification.NotificationService;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import com.esprit.academicplatform.validation.ValidationHistory;
import com.esprit.academicplatform.validation.ValidationHistoryRepository;
import com.esprit.academicplatform.validation.dto.ValidationActionRequest;
import com.esprit.academicplatform.validation.dto.ValidationHistoryResponse;
import com.esprit.academicplatform.workflow.dto.WorkflowActivityResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final ActivityRepository activityRepository;
    private final TeachingPerformanceCalculator teachingPerformanceCalculator;
    private final UserRepository userRepository;
    private final ValidationHistoryRepository validationHistoryRepository;
    private final NotificationService notificationService;
    private final WorkflowMailService workflowMailService;

    @Transactional(readOnly = true)
    public List<WorkflowActivityResponse> getAccessibleActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        return getAccessibleActivities(currentUser).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<WorkflowActivityResponse> getDepartmentPendingActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (!canDepartmentReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé au chef de département");
        }

        return activityRepository.findByStatusOrderByCreatedAtDesc(ActivityStatus.SOUMISE).stream()
            .filter(activity -> belongsToReviewScope(currentUser, activity))
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<WorkflowActivityResponse> getFinalPendingActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (!canFinalReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé à l’administration");
        }

        return activityRepository.findByStatusOrderByCreatedAtDesc(ActivityStatus.VALIDEE_DEPARTEMENT).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ValidationHistoryResponse> getValidationHistory(Long activityId, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        Activity activity = findActivity(activityId);

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé à cette activité");
        }

        return validationHistoryRepository.findByActivityIdOrderByDecidedAtAsc(activityId).stream()
            .map(this::toHistoryResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public WorkflowActivityResponse getAccessibleActivity(Long activityId, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        Activity activity = findActivity(activityId);

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cette activite");
        }

        return toResponse(activity);
    }

    @Transactional
    public WorkflowActivityResponse submitActivity(Long activityId, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        Activity activity = findActivity(activityId);

        if (!isOwner(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas soumettre cette activité");
        }

        if (activity.getStatus() != ActivityStatus.BROUILLON && activity.getStatus() != ActivityStatus.A_CORRIGER) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Seule une activité en brouillon ou à corriger peut être soumise"
            );
        }

        activity.setStatus(ActivityStatus.SOUMISE);
        if (activity instanceof TeachingActivity teaching && teaching.getCourseRestructuringPercentage() != null
            && teaching.getCourseRestructuringPercentage() > 0) {
            teaching.setCourseRestructuringApproved(null);
        }
        activityRepository.save(activity);

        saveHistory(activity, currentUser, ValidationLevel.ENSEIGNANT, ValidationDecision.SOUMIS, "Soumission de l’activité");
        notifySubmission(activity, currentUser);
        return toResponse(activity);
    }

    @Transactional
    public WorkflowActivityResponse departmentReviewActivity(
        Long activityId,
        ValidationActionRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        Activity activity = findActivity(activityId);

        if (!canDepartmentReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé au chef de département");
        }

        if (!belongsToReviewScope(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas traiter cette activité");
        }

        if (activity.getStatus() != ActivityStatus.SOUMISE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cette activité n’est pas en attente départementale");
        }

        ActivityStatus nextStatus = mapDepartmentDecision(request.decision());
        activity.setStatus(nextStatus);
        applyDepartmentPerformanceDecision(activity, request.decision());
        activityRepository.save(activity);

        saveHistory(activity, currentUser, ValidationLevel.CHEF_DEPARTEMENT, request.decision(), request.commentText());
        notifyDepartmentDecision(activity, currentUser, request.decision(), request.commentText());
        return toResponse(activity);
    }

    @Transactional
    public WorkflowActivityResponse finalReviewActivity(
        Long activityId,
        ValidationActionRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        Activity activity = findActivity(activityId);

        if (!canFinalReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé à l’administration");
        }

        if (activity.getStatus() != ActivityStatus.VALIDEE_DEPARTEMENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cette activité n’est pas en attente de validation finale");
        }

        ActivityStatus nextStatus = mapFinalDecision(request.decision());
        activity.setStatus(nextStatus);
        activityRepository.save(activity);

        saveHistory(activity, currentUser, ValidationLevel.ADMINISTRATION, request.decision(), request.commentText());
        notifyFinalDecision(activity, currentUser, request.decision(), request.commentText());
        return toResponse(activity);
    }

    private Activity findActivity(Long activityId) {
        return activityRepository.findById(activityId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activité introuvable"));
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
    }

    private List<Activity> getAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION) {
            return getAdministrationAccessibleActivities();
        }

        return activityRepository.findAllByOrderByCreatedAtDesc().stream()
            .filter(activity -> canAccess(currentUser, activity))
            .toList();
    }

    private List<Activity> getAdministrationAccessibleActivities() {
        List<Activity> candidates = activityRepository.findByStatusInOrderByCreatedAtDesc(
            List.of(
                ActivityStatus.VALIDEE_DEPARTEMENT,
                ActivityStatus.VALIDEE_FINALE,
                ActivityStatus.REJETEE,
                ActivityStatus.A_CORRIGER
            )
        );

        if (candidates.isEmpty()) {
            return candidates;
        }

        List<Long> requiresAdminHistoryIds = candidates.stream()
            .filter(activity -> activity.getStatus() != ActivityStatus.VALIDEE_DEPARTEMENT)
            .map(Activity::getId)
            .toList();

        Set<Long> adminReviewedActivityIds = requiresAdminHistoryIds.isEmpty()
            ? Set.of()
            : new HashSet<>(
                validationHistoryRepository.findDistinctActivityIdsByValidationLevelAndActivityIdIn(
                    ValidationLevel.ADMINISTRATION,
                    requiresAdminHistoryIds
                )
            );

        return candidates.stream()
            .filter(activity -> activity.getStatus() == ActivityStatus.VALIDEE_DEPARTEMENT
                || adminReviewedActivityIds.contains(activity.getId()))
            .toList();
    }

    private boolean canAccess(User currentUser, Activity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION) {
            return isAdministrationVisible(activity);
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToReviewScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean isOwner(User currentUser, Activity activity) {
        if (currentUser == null || currentUser.getId() == null || activity == null) {
            return false;
        }

        User owner = activity.getUser();
        return owner != null && currentUser.getId().equals(owner.getId());
    }

    private boolean canDepartmentReview(User currentUser) {
        return currentUser.getRole() == RoleType.CHEF_DEPARTEMENT;
    }

    private boolean canFinalReview(User currentUser) {
        return currentUser.getRole() == RoleType.ADMINISTRATION;
    }

    private boolean belongsToReviewScope(User reviewer, Activity activity) {
        Long activityDepartmentId = resolveActivityDepartmentId(activity);
        if (activityDepartmentId == null) {
            return false;
        }

        Long reviewerDepartmentId = getRequiredDepartmentId(reviewer);
        return reviewerDepartmentId.equals(activityDepartmentId);
    }

    private boolean isAdministrationVisible(Activity activity) {
        if (activity.getStatus() == ActivityStatus.VALIDEE_DEPARTEMENT) {
            return true;
        }

        if (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.SOUMISE) {
            return false;
        }

        return validationHistoryRepository.existsByActivityIdAndValidationLevel(activity.getId(), ValidationLevel.ADMINISTRATION);
    }

    private Long getRequiredDepartmentId(User user) {
        if (user.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun département n’est associé à cet utilisateur");
        }
        return user.getDepartment().getId();
    }

    private ActivityStatus mapDepartmentDecision(ValidationDecision decision) {
        return switch (decision) {
            case VALIDE -> ActivityStatus.VALIDEE_DEPARTEMENT;
            case REJETE -> ActivityStatus.REJETEE;
            case A_CORRIGER -> ActivityStatus.A_CORRIGER;
            case SOUMIS -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Décision invalide pour la revue départementale");
        };
    }

    private ActivityStatus mapFinalDecision(ValidationDecision decision) {
        return switch (decision) {
            case VALIDE -> ActivityStatus.VALIDEE_FINALE;
            case REJETE -> ActivityStatus.REJETEE;
            case A_CORRIGER -> ActivityStatus.A_CORRIGER;
            case SOUMIS -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Décision invalide pour la validation finale");
        };
    }

    private void saveHistory(
        Activity activity,
        User actor,
        ValidationLevel level,
        ValidationDecision decision,
        String commentText
    ) {
        ValidationHistory history = new ValidationHistory();
        history.setActivity(activity);
        history.setActor(actor);
        history.setValidationLevel(level);
        history.setDecision(decision);
        history.setCommentText(commentText);
        validationHistoryRepository.save(history);
    }

    private void notifySubmission(Activity activity, User teacher) {
        List<User> recipients = new ArrayList<>();
        Long activityDepartmentId = resolveActivityDepartmentId(activity);
        if (activityDepartmentId != null) {
            recipients.addAll(
                userRepository.findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.CHEF_DEPARTEMENT, activityDepartmentId)
            );
        }

        List<User> distinctRecipients = recipients.stream()
            .filter(recipient -> !recipient.getId().equals(teacher.getId()))
            .distinct()
            .toList();

        notificationService.createForUsers(
            distinctRecipients,
            "Nouvelle soumission d’activité",
            "L’activité " + activityTypeLabel(activity).toLowerCase() + " \"" + activityDisplayTitle(activity) + "\" de "
                + formatUserDisplayName(teacher) + " attend une validation."
        );
    }

    private void notifyDepartmentDecision(
        Activity activity,
        User actor,
        ValidationDecision decision,
        String commentText
    ) {
        User teacher = activity.getUser();
        if (teacher != null) {
            notificationService.createForUser(
                teacher,
                "Décision du chef de département",
                buildDecisionMessage(activity, actor, decision, commentText)
            );
        }

        if (decision == ValidationDecision.VALIDE) {
            List<User> finalReviewers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ADMINISTRATION))
                .stream()
                .filter(reviewer -> !reviewer.getId().equals(actor.getId()))
                .distinct()
                .toList();

            notificationService.createForUsers(
                finalReviewers,
                "Validation finale requise",
                "L’activité " + activityTypeLabel(activity).toLowerCase() + " \"" + activityDisplayTitle(activity) + "\" de "
                    + formatUserDisplayName(teacher)
                    + " a été validée par le département et attend la validation finale."
            );
                System.out.println("MAIL DEBUG - decision = " + decision);
                System.out.println("MAIL DEBUG - activity class = " + activity.getClass().getName());
                System.out.println("MAIL DEBUG - is availability = " + (activity instanceof AvailabilityRequestActivity));
            if (activity instanceof AvailabilityRequestActivity availabilityRequestActivity) {
                workflowMailService.sendAvailabilityApprovalMail(availabilityRequestActivity, actor);
            }
        }
    }

    private void notifyFinalDecision(
        Activity activity,
        User actor,
        ValidationDecision decision,
        String commentText
    ) {
        User teacher = activity.getUser();
        if (teacher == null) {
            return;
        }

        notificationService.createForUser(
            teacher,
            "Décision finale sur votre activité",
            buildDecisionMessage(activity, actor, decision, commentText)
        );
    }

    private String buildDecisionMessage(
        Activity activity,
        User actor,
        ValidationDecision decision,
        String commentText
    ) {
        String decisionLabel = switch (decision) {
            case VALIDE -> "a été validée";
            case A_CORRIGER -> "doit être corrigée";
            case REJETE -> "a été rejetée";
            case SOUMIS -> "a été soumise";
        };

        String baseMessage = "L’activité " + activityTypeLabel(activity).toLowerCase() + " \"" + activityDisplayTitle(activity)
            + "\" " + decisionLabel + " par " + formatUserDisplayName(actor) + ".";

        if (commentText == null || commentText.isBlank()) {
            return baseMessage;
        }

        return baseMessage + " Commentaire: " + commentText;
    }

    private ValidationHistoryResponse toHistoryResponse(ValidationHistory history) {
        User actor = history.getActor();
        RoleType actorRole = actor != null && actor.getRole() != null
            ? actor.getRole()
            : roleFromValidationLevel(history.getValidationLevel());

        return new ValidationHistoryResponse(
            history.getId(),
            actor != null && actor.getId() != null ? actor.getId() : 0L,
            formatUserDisplayName(actor),
            actorRole,
            history.getValidationLevel(),
            history.getDecision(),
            history.getCommentText(),
            history.getDecidedAt()
        );
    }

    private WorkflowActivityResponse toResponse(Activity activity) {
        User teacher = activity.getUser();
        return new WorkflowActivityResponse(
            activity.getId(),
            activityTypeLabel(activity),
            teacher != null && teacher.getId() != null ? teacher.getId() : 0L,
            formatUserDisplayName(teacher),
            activityDisplayTitle(activity),
            activitySubtitle(activity),
            activitySummary(activity),
            activityMetricLabel(activity),
            activityMetricValue(activity),
            activity.getStatus() != null ? activity.getStatus() : ActivityStatus.BROUILLON,
            safeText(activity.getAcademicYear(), "Annee non renseignee"),
            activity.getCreatedAt(),
            activity.getUpdatedAt()
        );
    }

    private String activityTypeLabel(Activity activity) {
        if (activity instanceof TeachingActivity) {
            return "TEACHING";
        }
        if (activity instanceof SupervisionActivity) {
            return "SUPERVISION";
        }
        if (activity instanceof ResearchActivity) {
            return "RESEARCH";
        }
        if (activity instanceof EventActivity) {
            return "EVENT";
        }
        if (activity instanceof ResponsibilityActivity) {
            return "RESPONSIBILITY";
        }
        if (activity instanceof AvailabilityRequestActivity availability) {
            if (availability.getRequestType() == null) {
                return "ACTIVITY";
            }

            return availability.getRequestType().name().equals("CONGE") ? "LEAVE_REQUEST" : "MISSION_REQUEST";
        }
        if (activity instanceof ExamSurveillanceActivity) {
            return "EXAM_SURVEILLANCE";
        }
        return "ACTIVITY";
    }

    private String activityDisplayTitle(Activity activity) {
        if (activity instanceof TeachingActivity teaching) {
            return safeText(teaching.getModuleName(), "Module non renseigne");
        }
        if (activity instanceof SupervisionActivity supervision) {
            return safeText(supervision.getStudentName(), "Etudiant non renseigne");
        }
        if (activity instanceof ResearchActivity research) {
            return safeText(research.getTitle(), "Titre non renseigne");
        }
        if (activity instanceof EventActivity event) {
            return safeText(event.getTitle(), "Evenement non renseigne");
        }
        if (activity instanceof ResponsibilityActivity responsibility) {
            return responsibility.getResponsibilityType() != null
                ? responsibility.getResponsibilityType().name()
                : "RESPONSABILITE";
        }
        if (activity instanceof AvailabilityRequestActivity availability) {
            if (availability.getRequestType() != null && availability.getRequestType().name().equals("CONGE")) {
                return availability.getLeaveType() != null ? availability.getLeaveType().name() : "CONGE";
            }

            return availability.getTitle() != null && !availability.getTitle().isBlank()
                ? availability.getTitle().trim()
                : missionKindLabel(availability.getMissionKind());
        }
        if (activity instanceof ExamSurveillanceActivity exam) {
            return safeText(exam.getSessionName(), "Session non renseignee");
        }
        return "Activité";
    }

    private String activitySubtitle(Activity activity) {
        if (activity instanceof TeachingActivity teaching) {
            return safeText(teaching.getProgramName(), "Programme non renseigne")
                + " / "
                + safeText(teaching.getClassName(), "Classe non renseignee");
        }
        if (activity instanceof SupervisionActivity supervision) {
            String supervisionType = supervision.getSupervisionType() != null
                ? supervision.getSupervisionType().name()
                : "SUPERVISION";
            String studentProgram = supervision.getStudentProgram() != null && !supervision.getStudentProgram().isBlank()
                ? supervision.getStudentProgram()
                : "Programme non renseigne";
            return supervisionType + " / " + studentProgram;
        }
        if (activity instanceof ResearchActivity research) {
            return researchTypeLabel(research) + " / " + safeText(research.getVenueName(), "Lieu non renseigne");
        }
        if (activity instanceof EventActivity event) {
            return safeEnumName(event.getEventType(), "EVENT")
                + " / "
                + (event.getEventDate() != null ? event.getEventDate() : "Date non renseignee");
        }
        if (activity instanceof ResponsibilityActivity responsibility) {
            return (responsibility.getStartDate() != null ? responsibility.getStartDate() : "Date non renseignee")
                + " / "
                + (responsibility.getEndDate() != null ? responsibility.getEndDate() : "EN_COURS");
        }
        if (activity instanceof AvailabilityRequestActivity availability) {
            if (availability.getRequestType() != null && availability.getRequestType().name().equals("MISSION")) {
                return missionKindLabel(availability.getMissionKind());
            }

            return (availability.getStartDate() != null ? availability.getStartDate() : "Date non renseignee")
                + " / "
                + (availability.getEndDate() != null ? availability.getEndDate() : "Date non renseignee");
        }
        if (activity instanceof ExamSurveillanceActivity exam) {
            return safeEnumName(exam.getSemester(), "SEMESTRE") + " / " + surveillanceDayLabel(exam) + " / "
                + formatDecimal(resolveExamSurveillancePoints(exam)) + " pts";
        }
        return safeText(activity.getAcademicYear(), "Annee non renseignee");
    }

    private String activitySummary(Activity activity) {
        if (activity instanceof TeachingActivity teaching) {
            return "Semestre " + safeEnumName(teaching.getSemester(), "SEMESTRE") + " / " + formatDecimal(teaching.getCompletedHours())
                + " sur " + formatDecimal(teaching.getPlannedHours()) + " h / "
                + formatDecimal(teachingPerformanceCalculator.calculate(teaching).declaredTotalPoints()) + " pts declares";
        }
        if (activity instanceof SupervisionActivity supervision) {
            return safeText(supervision.getSubjectTitle(), "Sujet non renseigne");
        }
        if (activity instanceof ResearchActivity research) {
            return formatDecimal(resolveResearchPoints(research)) + " pts"
                + (research.getIndexingName() != null && !research.getIndexingName().isBlank() ? " / " + research.getIndexingName() : "");
        }
        if (activity instanceof EventActivity event) {
            return safeText(event.getOrganizationRole(), "Role non renseigne");
        }
        if (activity instanceof ResponsibilityActivity responsibility) {
            return "Responsabilité académique";
        }
        if (activity instanceof AvailabilityRequestActivity availability) {
            return safeText(availability.getReason(), "Motif non renseigne");
        }
        if (activity instanceof ExamSurveillanceActivity exam) {
            return "Surveillance d’examen";
        }
        return safeText(activity.getAcademicYear(), "Annee non renseignee");
    }

    private String activityMetricLabel(Activity activity) {
        if (activity instanceof TeachingActivity) {
            return "Points";
        }
        if (activity instanceof SupervisionActivity) {
            return "Jury";
        }
        if (activity instanceof ResearchActivity) {
            return "Points";
        }
        if (activity instanceof EventActivity) {
            return "Role";
        }
        if (activity instanceof ResponsibilityActivity) {
            return "Etat";
        }
        if (activity instanceof AvailabilityRequestActivity) {
            return "Periode";
        }
        if (activity instanceof ExamSurveillanceActivity) {
            return "Points";
        }
        return "Info";
    }

    private String activityMetricValue(Activity activity) {
        if (activity instanceof TeachingActivity teaching) {
            return formatDecimal(teachingPerformanceCalculator.calculate(teaching).declaredTotalPoints()) + " pts";
        }
        if (activity instanceof SupervisionActivity supervision) {
            return supervision.getRoleInJury() != null ? supervision.getRoleInJury().name() : "N/A";
        }
        if (activity instanceof ResearchActivity research) {
            return formatDecimal(resolveResearchPoints(research)) + " pts";
        }
        if (activity instanceof EventActivity event) {
            return safeText(event.getOrganizationRole(), "N/A");
        }
        if (activity instanceof ResponsibilityActivity responsibility) {
            LocalDate today = LocalDate.now();
            return responsibility.getEndDate() != null && responsibility.getEndDate().isBefore(today) ? "TERMINEE" : "ACTIVE";
        }
        if (activity instanceof AvailabilityRequestActivity availability) {
            return (availability.getStartDate() != null ? availability.getStartDate() : "Date non renseignee")
                + " -> "
                + (availability.getEndDate() != null ? availability.getEndDate() : "Date non renseignee");
        }
        if (activity instanceof ExamSurveillanceActivity exam) {
            return formatDecimal(resolveExamSurveillancePoints(exam)) + " pts";
        }
        return "";
    }

    private String formatDecimal(BigDecimal value) {
        if (value == null) {
            return "0";
        }

        return value.stripTrailingZeros().toPlainString();
    }

    private BigDecimal resolveResearchPoints(ResearchActivity research) {
        if (research.getActivityPoints() != null) {
            return research.getActivityPoints();
        }

        PublicationType normalizedType = normalizeResearchType(research.getPublicationType());
        ResearchPublicationRank rank = resolveResearchRank(research, normalizedType);

        return switch (normalizedType) {
            case PROJET_DEVELOPPEMENT_UNITE_RECHERCHE -> BigDecimal.valueOf(50);
            case PROJET_RECHERCHE_ARTICLE_CONFERENCE -> BigDecimal.valueOf(120);
            case PRESENTATION_TRAVAIL -> BigDecimal.valueOf(10);
            case PUBLICATION_ARTICLE -> BigDecimal.valueOf(50).multiply(switch (rank) {
                case Q1 -> BigDecimal.valueOf(2);
                case Q2 -> BigDecimal.valueOf(1.5);
                case Q4 -> BigDecimal.valueOf(0.75);
                case CONFERENCE -> BigDecimal.valueOf(0.5);
                case Q3 -> BigDecimal.ONE;
            });
            default -> BigDecimal.valueOf(50);
        };
    }

    private PublicationType normalizeResearchType(PublicationType publicationType) {
        if (publicationType == null) {
            return PublicationType.PUBLICATION_ARTICLE;
        }

        return switch (publicationType) {
            case ARTICLE, CONFERENCE, CHAPITRE_OUVRAGE -> PublicationType.PUBLICATION_ARTICLE;
            case COMMUNICATION -> PublicationType.PRESENTATION_TRAVAIL;
            case PROJET_RECHERCHE -> PublicationType.PROJET_RECHERCHE_ARTICLE_CONFERENCE;
            default -> publicationType;
        };
    }

    private ResearchPublicationRank resolveResearchRank(ResearchActivity research, PublicationType normalizedType) {
        if (normalizedType != PublicationType.PUBLICATION_ARTICLE) {
            return ResearchPublicationRank.Q3;
        }

        if (research.getPublicationRank() != null) {
            return research.getPublicationRank();
        }

        if (research.getPublicationType() == PublicationType.CONFERENCE) {
            return ResearchPublicationRank.CONFERENCE;
        }

        return ResearchPublicationRank.Q3;
    }

    private String researchTypeLabel(ResearchActivity research) {
        PublicationType normalizedType = normalizeResearchType(research.getPublicationType());
        return switch (normalizedType) {
            case PROJET_DEVELOPPEMENT_UNITE_RECHERCHE -> "PROJET DEVELOPPEMENT";
            case PROJET_RECHERCHE_ARTICLE_CONFERENCE -> "PROJET RECHERCHE";
            case PUBLICATION_ARTICLE -> "PUBLICATION";
            case PRESENTATION_TRAVAIL -> "PRESENTATION";
            default -> normalizedType.name();
        };
    }

    private BigDecimal resolveExamSurveillancePoints(ExamSurveillanceActivity exam) {
        if (exam.getSessionPoints() != null) {
            return exam.getSessionPoints();
        }
        if (exam.getSessionDay() != null) {
            return exam.getSessionDay().name().equals("SAMEDI") ? BigDecimal.valueOf(2) : BigDecimal.ONE;
        }
        if (exam.getHoursCount() != null) {
            return exam.getHoursCount();
        }
        return BigDecimal.ONE;
    }

    private String surveillanceDayLabel(ExamSurveillanceActivity exam) {
        if (exam.getSessionDay() == null) {
            return "LUNDI";
        }
        return exam.getSessionDay().name();
    }

    private void applyDepartmentPerformanceDecision(Activity activity, ValidationDecision decision) {
        if (!(activity instanceof TeachingActivity teaching)) {
            return;
        }

        if (teaching.getCourseRestructuringPercentage() == null || teaching.getCourseRestructuringPercentage() <= 0) {
            teaching.setCourseRestructuringApproved(null);
            return;
        }

        if (decision == ValidationDecision.VALIDE) {
            teaching.setCourseRestructuringApproved(true);
            return;
        }

        teaching.setCourseRestructuringApproved(false);
    }

    private Long resolveActivityDepartmentId(Activity activity) {
        if (activity instanceof AvailabilityRequestActivity availability) {
            Department selectedDepartment = availability.getDepartment();
            if (selectedDepartment != null) {
                return selectedDepartment.getId();
            }
        }

        User owner = activity.getUser();
        if (owner == null || owner.getDepartment() == null) {
            return null;
        }

        return owner.getDepartment().getId();
    }

    private String formatUserDisplayName(User user) {
        if (user == null) {
            return "Utilisateur inconnu";
        }

        String firstName = safeText(user.getFirstName(), "");
        String lastName = safeText(user.getLastName(), "");
        String combined = (firstName + " " + lastName).trim();

        return combined.isEmpty() ? "Utilisateur inconnu" : combined;
    }

    private String safeText(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        return value.trim();
    }

    private String safeEnumName(Enum<?> value, String fallback) {
        return value == null ? fallback : value.name();
    }

    private RoleType roleFromValidationLevel(ValidationLevel level) {
        if (level == null) {
            return RoleType.ENSEIGNANT;
        }

        return switch (level) {
            case ENSEIGNANT -> RoleType.ENSEIGNANT;
            case CHEF_DEPARTEMENT -> RoleType.CHEF_DEPARTEMENT;
            case ADMINISTRATION -> RoleType.ADMINISTRATION;
        };
    }

    private String missionKindLabel(MissionKind missionKind) {
        if (missionKind == MissionKind.CONFERENCE) {
            return "Participation a une conference";
        }

        return "Mission";
    }
}



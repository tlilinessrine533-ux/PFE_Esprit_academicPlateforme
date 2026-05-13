package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateTeachingActivityRequest;
import com.esprit.academicplatform.activity.dto.TeachingActivityResponse;
import com.esprit.academicplatform.activity.dto.UpdateTeachingActivityRequest;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.ValidationDecision;
import com.esprit.academicplatform.common.enums.ValidationLevel;
import com.esprit.academicplatform.notification.NotificationService;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import com.esprit.academicplatform.validation.ValidationHistory;
import com.esprit.academicplatform.validation.ValidationHistoryRepository;
import com.esprit.academicplatform.validation.dto.ValidationActionRequest;
import com.esprit.academicplatform.validation.dto.ValidationHistoryResponse;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TeachingActivityService {

    private final TeachingActivityRepository teachingActivityRepository;
    private final TeachingPerformanceCalculator teachingPerformanceCalculator;
    private final UserRepository userRepository;
    private final ValidationHistoryRepository validationHistoryRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TeachingActivityResponse> getAccessibleTeachingActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<TeachingActivity> activities = findAccessibleActivities(currentUser);

        return activities.stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public TeachingActivityResponse getTeachingActivityById(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé à cet enseignement");
        }

        return toResponse(activity);
    }

    @Transactional
    public TeachingActivityResponse createTeachingActivity(CreateTeachingActivityRequest request, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        TeachingActivity activity = new TeachingActivity();
        activity.setUser(currentUser);
        validateHours(request.completedHours(), request.newCourseHours(), request.eveningOrSaturdayHours());
        applyChanges(activity, request);

        return toResponse(teachingActivityRepository.save(activity));
    }

    @Transactional
    public TeachingActivityResponse updateTeachingActivity(
        Long id,
        UpdateTeachingActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier cet enseignement");
        }

        validateHours(request.completedHours(), request.newCourseHours(), request.eveningOrSaturdayHours());
        applyChanges(activity, request);
        return toResponse(teachingActivityRepository.save(activity));
    }

    @Transactional
    public void deleteTeachingActivity(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas supprimer cet enseignement");
        }

        teachingActivityRepository.delete(activity);
    }

    @Transactional
    public TeachingActivityResponse submitTeachingActivity(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!isOwner(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas soumettre cet enseignement");
        }

        if (activity.getStatus() != ActivityStatus.BROUILLON && activity.getStatus() != ActivityStatus.A_CORRIGER) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Seul un enseignement en brouillon ou à corriger peut être soumis"
            );
        }

        activity.setStatus(ActivityStatus.SOUMISE);
        if (activity.getCourseRestructuringPercentage() != null && activity.getCourseRestructuringPercentage() > 0) {
            activity.setCourseRestructuringApproved(null);
        }
        teachingActivityRepository.save(activity);

        saveHistory(activity, currentUser, ValidationLevel.ENSEIGNANT, ValidationDecision.SOUMIS, "Soumission de l'activite");
        notifySubmission(activity, currentUser);
        return toResponse(activity);
    }

    @Transactional(readOnly = true)
    public List<TeachingActivityResponse> getDepartmentPendingTeachingActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (!canDepartmentReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé au chef de département");
        }

        List<TeachingActivity> activities = currentUser.getRole() == RoleType.SUPER_ADMIN
            ? teachingActivityRepository.findByStatusOrderByCreatedAtDesc(ActivityStatus.SOUMISE)
            : teachingActivityRepository.findByStatusAndUserDepartmentIdOrderByCreatedAtDesc(
                ActivityStatus.SOUMISE,
                getRequiredDepartmentId(currentUser)
            );

        return activities.stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TeachingActivityResponse> getFinalPendingTeachingActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (!canFinalReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé à l'administration");
        }

        List<TeachingActivity> activities = teachingActivityRepository.findByStatusOrderByCreatedAtDesc(
            ActivityStatus.VALIDEE_DEPARTEMENT
        );

        return activities.stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public TeachingActivityResponse departmentReviewTeachingActivity(
        Long id,
        ValidationActionRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!canDepartmentReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé au chef de département");
        }

        if (!belongsToReviewScope(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas traiter cet enseignement");
        }

        if (activity.getStatus() != ActivityStatus.SOUMISE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cet enseignement n'est pas en attente départementale");
        }

        ActivityStatus nextStatus = mapDepartmentDecision(request.decision());
        activity.setStatus(nextStatus);
        applyDepartmentPerformanceDecision(activity, request.decision());
        teachingActivityRepository.save(activity);

        saveHistory(activity, currentUser, ValidationLevel.CHEF_DEPARTEMENT, request.decision(), request.commentText());
        notifyDepartmentDecision(activity, currentUser, request.decision(), request.commentText());
        return toResponse(activity);
    }

    @Transactional
    public TeachingActivityResponse finalReviewTeachingActivity(
        Long id,
        ValidationActionRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!canFinalReview(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé à l'administration");
        }

        if (activity.getStatus() != ActivityStatus.VALIDEE_DEPARTEMENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cet enseignement n'est pas en attente de validation finale");
        }

        ActivityStatus nextStatus = mapFinalDecision(request.decision());
        activity.setStatus(nextStatus);
        teachingActivityRepository.save(activity);

        saveHistory(activity, currentUser, ValidationLevel.ADMINISTRATION, request.decision(), request.commentText());
        notifyFinalDecision(activity, currentUser, request.decision(), request.commentText());
        return toResponse(activity);
    }

    @Transactional(readOnly = true)
    public List<ValidationHistoryResponse> getValidationHistory(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        TeachingActivity activity = teachingActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignement introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé à cet enseignement");
        }

        return validationHistoryRepository.findByActivityIdOrderByDecidedAtAsc(id)
            .stream()
            .map(this::toHistoryResponse)
            .toList();
    }

    private void applyChanges(TeachingActivity activity, CreateTeachingActivityRequest request) {
        activity.setProgramName(request.programName());
        activity.setClassName(request.className());
        activity.setModuleName(request.moduleName());
        activity.setSemester(request.semester());
        activity.setTeachingMode(request.teachingMode());
        activity.setLanguage(request.language());
        activity.setPlannedHours(request.plannedHours());
        activity.setCompletedHours(request.completedHours());
        activity.setNewCourseHours(request.newCourseHours());
        activity.setCourseRestructuringPercentage(request.courseRestructuringPercentage());
        activity.setCourseRestructuringApproved(null);
        activity.setSyllabusCount(request.syllabusCount());
        activity.setCarFileElaborated(request.carFileElaborated());
        activity.setExamElaborated(request.examElaborated());
        activity.setEveningOrSaturdayHours(request.eveningOrSaturdayHours());
        activity.setCoordination(request.coordination());
        activity.setAcademicYear(request.academicYear());
        activity.setPartnershipDeclarationType(request.partnershipDeclarationType());
        activity.setSyllabusPath(request.syllabusPath());
    }

    private void applyChanges(TeachingActivity activity, UpdateTeachingActivityRequest request) {
        activity.setProgramName(request.programName());
        activity.setClassName(request.className());
        activity.setModuleName(request.moduleName());
        activity.setSemester(request.semester());
        activity.setTeachingMode(request.teachingMode());
        activity.setLanguage(request.language());
        activity.setPlannedHours(request.plannedHours());
        activity.setCompletedHours(request.completedHours());
        activity.setNewCourseHours(request.newCourseHours());
        activity.setCourseRestructuringPercentage(request.courseRestructuringPercentage());
        activity.setCourseRestructuringApproved(null);
        activity.setSyllabusCount(request.syllabusCount());
        activity.setCarFileElaborated(request.carFileElaborated());
        activity.setExamElaborated(request.examElaborated());
        activity.setEveningOrSaturdayHours(request.eveningOrSaturdayHours());
        activity.setCoordination(request.coordination());
        activity.setAcademicYear(request.academicYear());
        activity.setPartnershipDeclarationType(request.partnershipDeclarationType());
        activity.setSyllabusPath(request.syllabusPath());
    }

    private TeachingActivityResponse toResponse(TeachingActivity activity) {
        User teacher = activity.getUser();
        BigDecimal planned = nullSafe(activity.getPlannedHours());
        BigDecimal completed = nullSafe(activity.getCompletedHours());
        var points = teachingPerformanceCalculator.calculate(activity);

        return new TeachingActivityResponse(
            activity.getId(),
            teacher != null ? teacher.getId() : null,
            teacher != null ? teacher.getFirstName() + " " + teacher.getLastName() : "Inconnu",
            activity.getProgramName(),
            activity.getClassName(),
            activity.getModuleName(),
            activity.getSemester(),
            activity.getTeachingMode(),
            activity.getLanguage(),
            planned,
            completed,
            activity.getNewCourseHours(),
            activity.getCourseRestructuringPercentage(),
            activity.getSyllabusCount(),
            activity.isCarFileElaborated(),
            activity.isExamElaborated(),
            activity.getEveningOrSaturdayHours(),
            activity.isCoordination(),
            completed.subtract(planned),
            activity.getStatus(),
            activity.getAcademicYear(),
            activity.getPartnershipDeclarationType(),
            activity.getSyllabusPath(),
            points,
            activity.getCreatedAt(),
            activity.getUpdatedAt()
        );
    }

    private void applyDepartmentPerformanceDecision(TeachingActivity activity, ValidationDecision decision) {
        if (activity.getCourseRestructuringPercentage() == null || activity.getCourseRestructuringPercentage() <= 0) {
            activity.setCourseRestructuringApproved(null);
            return;
        }

        if (decision == ValidationDecision.VALIDE) {
            activity.setCourseRestructuringApproved(true);
            return;
        }

        activity.setCourseRestructuringApproved(false);
    }

    private void validateHours(BigDecimal completedHours, BigDecimal newCourseHours, BigDecimal eveningOrSaturdayHours) {
        if (completedHours.compareTo(BigDecimal.ZERO) > 0 && newCourseHours.compareTo(completedHours) > 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Les heures de nouveau cours ne peuvent pas depasser les heures realisees"
            );
        }

        if (completedHours.compareTo(BigDecimal.ZERO) > 0 && eveningOrSaturdayHours.compareTo(completedHours) > 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Les heures de soir ou samedi ne peuvent pas depasser les heures realisees"
            );
        }
    }

    private ValidationHistoryResponse toHistoryResponse(ValidationHistory history) {
        User actor = history.getActor();
        return new ValidationHistoryResponse(
            history.getId(),
            actor.getId(),
            actor.getFirstName() + " " + actor.getLastName(),
            actor.getRole(),
            history.getValidationLevel(),
            history.getDecision(),
            history.getCommentText(),
            history.getDecidedAt()
        );
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
    }

    private List<TeachingActivity> findAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return teachingActivityRepository.findAllByOrderByCreatedAtDesc();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return teachingActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(getRequiredDepartmentId(currentUser));
        }

        return teachingActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    private boolean canAccess(User currentUser, TeachingActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToReviewScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean canManage(User currentUser, TeachingActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        return isOwner(currentUser, activity)
            && (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.A_CORRIGER);
    }

    private boolean isOwner(User currentUser, TeachingActivity activity) {
        return activity.getUser().getId().equals(currentUser.getId());
    }

    private boolean canDepartmentReview(User currentUser) {
        return currentUser.getRole() == RoleType.CHEF_DEPARTEMENT || currentUser.getRole() == RoleType.SUPER_ADMIN;
    }

    private boolean canFinalReview(User currentUser) {
        return currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN;
    }

    private boolean belongsToReviewScope(User reviewer, TeachingActivity activity) {
        if (reviewer.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        Long reviewerDepartmentId = getRequiredDepartmentId(reviewer);
        User activityOwner = activity.getUser();
        if (activityOwner.getDepartment() == null) {
            return false;
        }

        return reviewerDepartmentId.equals(activityOwner.getDepartment().getId());
    }

    private Long getRequiredDepartmentId(User user) {
        if (user.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun département n'est associé à cet utilisateur");
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
            case SOUMIS -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Decision invalide pour la validation finale");
        };
    }

    private void saveHistory(
        TeachingActivity activity,
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

    private void notifySubmission(TeachingActivity activity, User teacher) {
        List<User> recipients = new ArrayList<>();
        if (teacher.getDepartment() != null) {
            recipients.addAll(
                userRepository.findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.CHEF_DEPARTEMENT, teacher.getDepartment().getId())
            );
        }

        recipients.addAll(userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ADMINISTRATION, RoleType.SUPER_ADMIN)));

        List<User> distinctRecipients = recipients.stream()
            .filter(recipient -> !recipient.getId().equals(teacher.getId()))
            .distinct()
            .toList();

        notificationService.createForUsers(
            distinctRecipients,
            "Nouvelle soumission d enseignement",
            "Le cours " + activity.getModuleName() + " de " + teacher.getFirstName() + " " + teacher.getLastName()
                + " attend une validation."
        );
    }

    private void notifyDepartmentDecision(
        TeachingActivity activity,
        User actor,
        ValidationDecision decision,
        String commentText
    ) {
        User teacher = activity.getUser();
        notificationService.createForUser(
            teacher,
            "Décision du chef de département",
            buildDecisionMessage(activity, actor, decision, commentText)
        );

        if (decision == ValidationDecision.VALIDE) {
            List<User> finalReviewers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ADMINISTRATION, RoleType.SUPER_ADMIN))
                .stream()
                .filter(reviewer -> !reviewer.getId().equals(actor.getId()))
                .distinct()
                .toList();

            notificationService.createForUsers(
                finalReviewers,
                "Validation finale requise",
                "Le cours " + activity.getModuleName() + " de " + teacher.getFirstName() + " " + teacher.getLastName()
                    + " a été validé par le département et attend la validation finale."
            );
        }
    }

    private void notifyFinalDecision(
        TeachingActivity activity,
        User actor,
        ValidationDecision decision,
        String commentText
    ) {
        notificationService.createForUser(
            activity.getUser(),
            "Decision finale sur votre enseignement",
            buildDecisionMessage(activity, actor, decision, commentText)
        );
    }

    private String buildDecisionMessage(
        TeachingActivity activity,
        User actor,
        ValidationDecision decision,
        String commentText
    ) {
        String decisionLabel = switch (decision) {
            case VALIDE -> "a ete valide";
            case A_CORRIGER -> "doit être corrigé";
            case REJETE -> "a ete rejete";
            case SOUMIS -> "a ete soumis";
        };

        String baseMessage = "Le cours " + activity.getModuleName() + " " + decisionLabel + " par "
            + actor.getFirstName() + " " + actor.getLastName() + ".";

        if (commentText == null || commentText.isBlank()) {
            return baseMessage;
        }

        return baseMessage + " Commentaire: " + commentText;
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}

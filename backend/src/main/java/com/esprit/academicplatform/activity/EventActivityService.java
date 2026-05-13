package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateEventActivityRequest;
import com.esprit.academicplatform.activity.dto.EventActivityResponse;
import com.esprit.academicplatform.activity.dto.EventSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateEventActivityRequest;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.EventType;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EventActivityService {

    private static final String ROLE_ORGANISATION = "ORGANISATION";
    private static final String ROLE_MEMBRE = "MEMBRE";

    private static final BigDecimal SCIENTIFIC_EVENT_ORGANISATION_POINTS = BigDecimal.valueOf(20);
    private static final BigDecimal SCIENTIFIC_EVENT_MEMBER_POINTS = BigDecimal.valueOf(10);
    private static final BigDecimal CLUB_ACTIVITY_POINTS = BigDecimal.valueOf(10);
    private static final BigDecimal HACKATHON_POINTS = BigDecimal.valueOf(10);
    private static final BigDecimal SCHOOL_ACTIVITY_POINTS = BigDecimal.valueOf(10);
    private static final BigDecimal DEFAULT_EVENT_POINTS = BigDecimal.valueOf(10);

    private final EventActivityRepository eventActivityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EventActivityResponse> getAccessibleEventActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        return findAccessibleActivities(currentUser)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public EventSummaryResponse getEventSummary(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<EventActivity> activities = findAccessibleActivities(currentUser);

        BigDecimal totalPoints = activities.stream()
            .map(this::resolveActivityPoints)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new EventSummaryResponse(
            activities.size(),
            totalPoints,
            activities.stream().filter(activity -> activity.getEventType() == EventType.SEMINAIRE).count(),
            activities.stream().filter(activity -> activity.getEventType() == EventType.COLLOQUE).count(),
            activities.stream().filter(activity -> activity.getEventType() == EventType.WORKSHOP).count(),
            activities.stream().filter(activity -> activity.getEventType() == EventType.JOURNEE_SCIENTIFIQUE || activity.getEventType() == EventType.AUTRE).count()
        );
    }

    @Transactional(readOnly = true)
    public EventActivityResponse getEventActivityById(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        EventActivity activity = eventActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cet evenement");
        }

        return toResponse(activity);
    }

    @Transactional
    public EventActivityResponse createEventActivity(CreateEventActivityRequest request, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        EventActivity activity = new EventActivity();
        activity.setUser(currentUser);
        applyChanges(activity, request);

        return toResponse(eventActivityRepository.save(activity));
    }

    @Transactional
    public EventActivityResponse updateEventActivity(Long id, UpdateEventActivityRequest request, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        EventActivity activity = eventActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier cet evenement");
        }

        applyChanges(activity, request);
        return toResponse(eventActivityRepository.save(activity));
    }

    @Transactional
    public void deleteEventActivity(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        EventActivity activity = eventActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas supprimer cet evenement");
        }

        eventActivityRepository.delete(activity);
    }

    private void applyChanges(EventActivity activity, CreateEventActivityRequest request) {
        applyChanges(activity, request.eventType(), request.title(), request.eventDate(), request.organizationRole(), request.academicYear());
    }

    private void applyChanges(EventActivity activity, UpdateEventActivityRequest request) {
        applyChanges(activity, request.eventType(), request.title(), request.eventDate(), request.organizationRole(), request.academicYear());
    }

    private void applyChanges(
        EventActivity activity,
        EventType requestedType,
        String titleValue,
        LocalDate eventDate,
        String requestedRole,
        String academicYearValue
    ) {
        if (requestedType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le type d evenement est obligatoire");
        }
        if (eventDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de l evenement est obligatoire");
        }

        String title = requireText(titleValue, "Le titre est obligatoire");
        String academicYear = requireText(academicYearValue, "L'annee universitaire est obligatoire");
        String organizationRole = resolveOrganizationRole(requestedType, requestedRole);

        activity.setEventType(requestedType);
        activity.setTitle(title);
        activity.setEventDate(eventDate);
        activity.setOrganizationRole(organizationRole);
        activity.setAcademicYear(academicYear);
    }

    private EventActivityResponse toResponse(EventActivity activity) {
        User teacher = activity.getUser();
        String organizationRole = resolveStoredOrganizationRole(activity);
        return new EventActivityResponse(
            activity.getId(),
            teacher.getId(),
            teacher.getFirstName() + " " + teacher.getLastName(),
            activity.getEventType(),
            activity.getTitle(),
            activity.getEventDate(),
            organizationRole,
            calculatePoints(activity.getEventType(), organizationRole),
            activity.getStatus(),
            activity.getAcademicYear(),
            activity.getCreatedAt(),
            activity.getUpdatedAt()
        );
    }

    private BigDecimal resolveActivityPoints(EventActivity activity) {
        return calculatePoints(activity.getEventType(), resolveStoredOrganizationRole(activity));
    }

    private String resolveStoredOrganizationRole(EventActivity activity) {
        if (activity.getEventType() == EventType.SEMINAIRE) {
            String normalizedRole = normalizeScientificRole(activity.getOrganizationRole());
            return normalizedRole != null ? normalizedRole : ROLE_MEMBRE;
        }

        String role = trimToNull(activity.getOrganizationRole());
        if (role != null) {
            return role;
        }

        return defaultRoleForEventType(activity.getEventType());
    }

    private String resolveOrganizationRole(EventType eventType, String requestedRole) {
        if (eventType == EventType.SEMINAIRE) {
            String normalizedRole = normalizeScientificRole(requestedRole);
            if (normalizedRole == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pour un evenement scientifique, choisissez Organisation ou Membre"
                );
            }
            return normalizedRole;
        }

        String role = trimToNull(requestedRole);
        if (role != null) {
            return role;
        }

        return defaultRoleForEventType(eventType);
    }

    private String normalizeScientificRole(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }

        String normalized = value.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "ORGANISATION", "ORGANIZATION", "ORGANISATEUR", "ORGANISATRICE", "ORGANISER" -> ROLE_ORGANISATION;
            case "MEMBRE", "PARTICIPANT", "PARTICIPANTE" -> ROLE_MEMBRE;
            default -> null;
        };
    }

    private String defaultRoleForEventType(EventType eventType) {
        if (eventType == EventType.SEMINAIRE) {
            return ROLE_MEMBRE;
        }
        return "-";
    }

    private BigDecimal calculatePoints(EventType eventType, String organizationRole) {
        if (eventType == null) {
            return DEFAULT_EVENT_POINTS;
        }

        return switch (eventType) {
            case SEMINAIRE -> ROLE_ORGANISATION.equals(organizationRole)
                ? SCIENTIFIC_EVENT_ORGANISATION_POINTS
                : SCIENTIFIC_EVENT_MEMBER_POINTS;
            case COLLOQUE -> CLUB_ACTIVITY_POINTS;
            case WORKSHOP -> HACKATHON_POINTS;
            case JOURNEE_SCIENTIFIQUE -> SCHOOL_ACTIVITY_POINTS;
            case AUTRE -> DEFAULT_EVENT_POINTS;
        };
    }

    private String requireText(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
    }

    private List<EventActivity> findAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return eventActivityRepository.findAllByOrderByCreatedAtDesc();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return eventActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(getRequiredDepartmentId(currentUser));
        }

        return eventActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    private boolean canAccess(User currentUser, EventActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToDepartmentScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean canManage(User currentUser, EventActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        return isOwner(currentUser, activity)
            && (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.A_CORRIGER);
    }

    private boolean belongsToDepartmentScope(User reviewer, EventActivity activity) {
        Long reviewerDepartmentId = getRequiredDepartmentId(reviewer);
        User activityOwner = activity.getUser();
        if (activityOwner.getDepartment() == null) {
            return false;
        }

        return reviewerDepartmentId.equals(activityOwner.getDepartment().getId());
    }

    private Long getRequiredDepartmentId(User user) {
        if (user.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun departement n'est associe a cet utilisateur");
        }
        return user.getDepartment().getId();
    }

    private boolean isOwner(User currentUser, EventActivity activity) {
        return activity.getUser().getId().equals(currentUser.getId());
    }
}


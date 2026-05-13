package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateResearchActivityRequest;
import com.esprit.academicplatform.activity.dto.ResearchActivityResponse;
import com.esprit.academicplatform.activity.dto.ResearchSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateResearchActivityRequest;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.ResearchPublicationRank;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ResearchActivityService {

    private static final BigDecimal DEVELOPMENT_PROJECT_POINTS = BigDecimal.valueOf(50);
    private static final BigDecimal RESEARCH_PROJECT_POINTS = BigDecimal.valueOf(120);
    private static final BigDecimal PUBLICATION_BASE_POINTS = BigDecimal.valueOf(50);
    private static final BigDecimal PRESENTATION_POINTS = BigDecimal.valueOf(10);

    private static final BigDecimal MULTIPLIER_Q1 = BigDecimal.valueOf(2);
    private static final BigDecimal MULTIPLIER_Q2 = BigDecimal.valueOf(1.5);
    private static final BigDecimal MULTIPLIER_Q3 = BigDecimal.ONE;
    private static final BigDecimal MULTIPLIER_Q4 = BigDecimal.valueOf(0.75);
    private static final BigDecimal MULTIPLIER_CONFERENCE = BigDecimal.valueOf(0.5);

    private final ResearchActivityRepository researchActivityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ResearchActivityResponse> getAccessibleResearchActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        return findAccessibleActivities(currentUser)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ResearchActivityResponse getResearchActivityById(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ResearchActivity activity = researchActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activite de recherche introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cette activite de recherche");
        }

        return toResponse(activity);
    }

    @Transactional
    public ResearchActivityResponse createResearchActivity(CreateResearchActivityRequest request, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        ResearchActivity activity = new ResearchActivity();
        activity.setUser(currentUser);
        applyChanges(activity, request);

        return toResponse(researchActivityRepository.save(activity));
    }

    @Transactional
    public ResearchActivityResponse updateResearchActivity(
        Long id,
        UpdateResearchActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        ResearchActivity activity = researchActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activite de recherche introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier cette activite de recherche");
        }

        applyChanges(activity, request);
        return toResponse(researchActivityRepository.save(activity));
    }

    @Transactional
    public void deleteResearchActivity(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ResearchActivity activity = researchActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activite de recherche introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas supprimer cette activite de recherche");
        }

        researchActivityRepository.delete(activity);
    }

    @Transactional(readOnly = true)
    public ResearchSummaryResponse getResearchSummary(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<ResearchActivity> activities = findAccessibleActivities(currentUser);

        BigDecimal totalPoints = activities.stream()
            .map(this::resolveActivityPoints)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalDevelopmentProjects = activities.stream()
            .filter(activity -> normalizePublicationType(activity.getPublicationType()) == PublicationType.PROJET_DEVELOPPEMENT_UNITE_RECHERCHE)
            .count();
        long totalResearchProjects = activities.stream()
            .filter(activity -> normalizePublicationType(activity.getPublicationType()) == PublicationType.PROJET_RECHERCHE_ARTICLE_CONFERENCE)
            .count();
        long totalPublications = activities.stream()
            .filter(activity -> normalizePublicationType(activity.getPublicationType()) == PublicationType.PUBLICATION_ARTICLE)
            .count();
        long totalPresentations = activities.stream()
            .filter(activity -> normalizePublicationType(activity.getPublicationType()) == PublicationType.PRESENTATION_TRAVAIL)
            .count();

        return new ResearchSummaryResponse(
            activities.size(),
            totalPoints,
            totalDevelopmentProjects,
            totalResearchProjects,
            totalPublications,
            totalPresentations
        );
    }

    private void applyChanges(ResearchActivity activity, CreateResearchActivityRequest request) {
        applyChanges(
            activity,
            request.publicationType(),
            request.title(),
            request.venueName(),
            request.publicationYear(),
            request.indexingName(),
            request.doi(),
            request.studentName(),
            request.pfeLevel(),
            request.deliverable(),
            request.publicationRank(),
            request.academicYear()
        );
    }

    private void applyChanges(ResearchActivity activity, UpdateResearchActivityRequest request) {
        applyChanges(
            activity,
            request.publicationType(),
            request.title(),
            request.venueName(),
            request.publicationYear(),
            request.indexingName(),
            request.doi(),
            request.studentName(),
            request.pfeLevel(),
            request.deliverable(),
            request.publicationRank(),
            request.academicYear()
        );
    }

    private void applyChanges(
        ResearchActivity activity,
        PublicationType requestedType,
        String titleValue,
        String venueNameValue,
        Integer publicationYearValue,
        String indexingNameValue,
        String doiValue,
        String studentNameValue,
        String pfeLevelValue,
        String deliverableValue,
        ResearchPublicationRank requestedRank,
        String academicYearValue
    ) {
        if (requestedType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le type de recherche est obligatoire");
        }

        PublicationType normalizedType = normalizePublicationType(requestedType);
        String title = requireText(titleValue, "Le titre est obligatoire");
        String venueName = trimToNull(venueNameValue);
        Integer publicationYear = publicationYearValue != null ? publicationYearValue : Year.now().getValue();
        String indexingName = trimToNull(indexingNameValue);
        String doi = trimToNull(doiValue);
        String studentName = trimToNull(studentNameValue);
        String pfeLevel = trimToNull(pfeLevelValue);
        String deliverable = trimToNull(deliverableValue);
        String academicYear = requireText(academicYearValue, "L'annee universitaire est obligatoire");

        ResearchPublicationRank rank = resolveRequestedPublicationRank(normalizedType, requestedType, requestedRank);
        validateByType(normalizedType, studentName, pfeLevel, deliverable, rank);

        activity.setPublicationType(normalizedType);
        activity.setTitle(title);
        activity.setVenueName(resolveVenueName(normalizedType, venueName));
        activity.setPublicationYear(publicationYear);
        activity.setIndexingName(indexingName);
        activity.setDoi(doi);
        activity.setStudentName(normalizedType == PublicationType.PROJET_DEVELOPPEMENT_UNITE_RECHERCHE ? studentName : null);
        activity.setPfeLevel(normalizedType == PublicationType.PROJET_DEVELOPPEMENT_UNITE_RECHERCHE ? pfeLevel : null);
        activity.setDeliverable(normalizedType == PublicationType.PROJET_DEVELOPPEMENT_UNITE_RECHERCHE ? deliverable : null);
        activity.setPublicationRank(normalizedType == PublicationType.PUBLICATION_ARTICLE ? rank : null);
        activity.setActivityPoints(activity.getUser() != null && activity.getUser().isTeacherWithoutPoints()
            ? BigDecimal.ZERO
            : calculatePoints(normalizedType, rank));
        activity.setAcademicYear(academicYear);
    }

    private ResearchActivityResponse toResponse(ResearchActivity activity) {
        User teacher = activity.getUser();
        PublicationType normalizedType = normalizePublicationType(activity.getPublicationType());
        ResearchPublicationRank rank = resolveStoredPublicationRank(activity, normalizedType);

        return new ResearchActivityResponse(
            activity.getId(),
            teacher.getId(),
            teacher.getFirstName() + " " + teacher.getLastName(),
            normalizedType,
            activity.getTitle(),
            resolveVenueName(normalizedType, activity.getVenueName()),
            activity.getPublicationYear(),
            activity.getIndexingName(),
            activity.getDoi(),
            activity.getStudentName(),
            activity.getPfeLevel(),
            activity.getDeliverable(),
            rank,
            resolveActivityPoints(activity),
            activity.getStatus(),
            activity.getAcademicYear(),
            activity.getCreatedAt(),
            activity.getUpdatedAt()
        );
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
    }

    private List<ResearchActivity> findAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return researchActivityRepository.findAllByOrderByCreatedAtDesc();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return researchActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(getRequiredDepartmentId(currentUser));
        }

        return researchActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    private boolean canAccess(User currentUser, ResearchActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToDepartmentScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean canManage(User currentUser, ResearchActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        return isOwner(currentUser, activity)
            && (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.A_CORRIGER);
    }

    private boolean belongsToDepartmentScope(User reviewer, ResearchActivity activity) {
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

    private boolean isOwner(User currentUser, ResearchActivity activity) {
        return activity.getUser().getId().equals(currentUser.getId());
    }

    private PublicationType normalizePublicationType(PublicationType publicationType) {
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

    private void validateByType(
        PublicationType publicationType,
        String studentName,
        String pfeLevel,
        String deliverable,
        ResearchPublicationRank publicationRank
    ) {
        if (publicationType == PublicationType.PROJET_DEVELOPPEMENT_UNITE_RECHERCHE) {
            requireText(studentName, "L'etudiant est obligatoire pour ce type d'activite");
            requireText(pfeLevel, "Le niveau est obligatoire pour ce type d'activite");
            requireText(deliverable, "Le livrable est obligatoire pour ce type d'activite");
        }

        if (publicationType == PublicationType.PUBLICATION_ARTICLE && publicationRank == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le classement (Q1..Q4 ou Conference) est obligatoire");
        }
    }

    private String resolveVenueName(PublicationType publicationType, String rawVenueName) {
        if (StringUtils.hasText(rawVenueName)) {
            return rawVenueName.trim();
        }

        return switch (publicationType) {
            case PROJET_DEVELOPPEMENT_UNITE_RECHERCHE -> "Encadrement professionnel";
            case PROJET_RECHERCHE_ARTICLE_CONFERENCE -> "Article et Conference";
            case PRESENTATION_TRAVAIL -> "Presentation";
            default -> "Publication";
        };
    }

    private ResearchPublicationRank resolveRequestedPublicationRank(
        PublicationType normalizedType,
        PublicationType requestedType,
        ResearchPublicationRank requestedRank
    ) {
        if (normalizedType != PublicationType.PUBLICATION_ARTICLE) {
            return null;
        }

        if (requestedRank != null) {
            return requestedRank;
        }

        if (requestedType == PublicationType.CONFERENCE) {
            return ResearchPublicationRank.CONFERENCE;
        }

        return ResearchPublicationRank.Q3;
    }

    private ResearchPublicationRank resolveStoredPublicationRank(
        ResearchActivity activity,
        PublicationType normalizedType
    ) {
        if (normalizedType != PublicationType.PUBLICATION_ARTICLE) {
            return null;
        }

        if (activity.getPublicationRank() != null) {
            return activity.getPublicationRank();
        }

        if (activity.getPublicationType() == PublicationType.CONFERENCE) {
            return ResearchPublicationRank.CONFERENCE;
        }

        return ResearchPublicationRank.Q3;
    }

    private BigDecimal resolveActivityPoints(ResearchActivity activity) {
        if (activity.getUser() != null && activity.getUser().isTeacherWithoutPoints()) {
            return BigDecimal.ZERO;
        }

        if (activity.getActivityPoints() != null) {
            return activity.getActivityPoints();
        }

        PublicationType normalizedType = normalizePublicationType(activity.getPublicationType());
        ResearchPublicationRank rank = resolveStoredPublicationRank(activity, normalizedType);
        return calculatePoints(normalizedType, rank);
    }

    private BigDecimal calculatePoints(PublicationType publicationType, ResearchPublicationRank publicationRank) {
        return switch (publicationType) {
            case PROJET_DEVELOPPEMENT_UNITE_RECHERCHE -> DEVELOPMENT_PROJECT_POINTS;
            case PROJET_RECHERCHE_ARTICLE_CONFERENCE -> RESEARCH_PROJECT_POINTS;
            case PRESENTATION_TRAVAIL -> PRESENTATION_POINTS;
            case PUBLICATION_ARTICLE -> PUBLICATION_BASE_POINTS.multiply(rankMultiplier(publicationRank));
            default -> PUBLICATION_BASE_POINTS;
        };
    }

    private BigDecimal rankMultiplier(ResearchPublicationRank publicationRank) {
        if (publicationRank == null) {
            return MULTIPLIER_Q3;
        }

        return switch (publicationRank) {
            case Q1 -> MULTIPLIER_Q1;
            case Q2 -> MULTIPLIER_Q2;
            case Q3 -> MULTIPLIER_Q3;
            case Q4 -> MULTIPLIER_Q4;
            case CONFERENCE -> MULTIPLIER_CONFERENCE;
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
}

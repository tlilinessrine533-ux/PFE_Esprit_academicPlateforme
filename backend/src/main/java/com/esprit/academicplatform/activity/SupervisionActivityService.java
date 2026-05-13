package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateSupervisionActivityRequest;
import com.esprit.academicplatform.activity.dto.SupervisionActivityResponse;
import com.esprit.academicplatform.activity.dto.SupervisionSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateSupervisionActivityRequest;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.JuryRole;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.StatutEncadrement;
import com.esprit.academicplatform.common.enums.SupervisionType;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SupervisionActivityService {

    private static final BigDecimal PFE_ACADEMIC_POINTS = BigDecimal.valueOf(25);
    private static final BigDecimal PFE_REVIEWER_POINTS = BigDecimal.valueOf(10);
    private static final BigDecimal PFE_JURY_PRESIDENT_POINTS = BigDecimal.valueOf(5);
    private static final BigDecimal GROUP_POINTS = BigDecimal.valueOf(10);
    private static final BigDecimal APP0_POINTS = BigDecimal.valueOf(5);
    private static final BigDecimal SUPPORT_HOUR_POINTS = BigDecimal.valueOf(0.5);
    private static final BigDecimal DEFAULT_QUANTITY = BigDecimal.ONE;
    private static final BigDecimal SEMINAR_PI_MIN_QUANTITY = BigDecimal.valueOf(4);

    private final SupervisionActivityRepository supervisionActivityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<SupervisionActivityResponse> getAccessibleSupervisionActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        return findAccessibleActivities(currentUser)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public SupervisionActivityResponse getSupervisionActivityById(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        SupervisionActivity activity = supervisionActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encadrement introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cet encadrement");
        }

        return toResponse(activity);
    }

    @Transactional
    public SupervisionActivityResponse createSupervisionActivity(
        CreateSupervisionActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);

        SupervisionActivity activity = new SupervisionActivity();
        activity.setUser(currentUser);
        applyChanges(activity, request);

        return toResponse(supervisionActivityRepository.save(activity));
    }

    @Transactional
    public SupervisionActivityResponse updateSupervisionActivity(
        Long id,
        UpdateSupervisionActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        SupervisionActivity activity = supervisionActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encadrement introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier cet encadrement");
        }

        applyChanges(activity, request);
        return toResponse(supervisionActivityRepository.save(activity));
    }

    @Transactional
    public void deleteSupervisionActivity(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        SupervisionActivity activity = supervisionActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encadrement introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas supprimer cet encadrement");
        }

        supervisionActivityRepository.delete(activity);
    }

    @Transactional(readOnly = true)
    public SupervisionSummaryResponse getSupervisionSummary(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<SupervisionActivity> activities = findAccessibleActivities(currentUser);

        BigDecimal totalPoints = activities.stream()
            .map(this::resolveActivityPoints)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalSupervisions = activities.size();
        long totalPfe = activities.stream()
            .filter(this::isPfeActivity)
            .count();
        long totalSupported = activities.stream()
            .filter(activity -> activity.getSupervisionStatus() == StatutEncadrement.SOUTENU)
            .count();
        long totalJuryParticipations = activities.stream()
            .filter(activity -> resolveJuryRole(
                normalizeSupervisionType(activity.getSupervisionType()),
                activity.getRoleInJury()
            ) != JuryRole.MEMBRE_JURY)
            .count();

        return new SupervisionSummaryResponse(
            totalSupervisions,
            totalPfe,
            totalSupported,
            totalJuryParticipations,
            totalPoints
        );
    }

    private void applyChanges(SupervisionActivity activity, CreateSupervisionActivityRequest request) {
        applyChanges(
            activity,
            request.supervisionType(),
            request.studentName(),
            request.studentProgram(),
            request.subjectTitle(),
            request.supervisionStatus(),
            request.roleInJury(),
            request.quantityValue(),
            request.academicYear()
        );
    }

    private void applyChanges(SupervisionActivity activity, UpdateSupervisionActivityRequest request) {
        applyChanges(
            activity,
            request.supervisionType(),
            request.studentName(),
            request.studentProgram(),
            request.subjectTitle(),
            request.supervisionStatus(),
            request.roleInJury(),
            request.quantityValue(),
            request.academicYear()
        );
    }

    private void applyChanges(
        SupervisionActivity activity,
        SupervisionType requestedType,
        String studentNameValue,
        String levelValue,
        String subjectTitleValue,
        StatutEncadrement requestedStatus,
        JuryRole requestedRole,
        BigDecimal requestedQuantity,
        String academicYearValue
    ) {
        if (requestedType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le type d'encadrement est obligatoire");
        }
        if (requestedStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le statut de l'encadrement est obligatoire");
        }

        SupervisionType supervisionType = resolveRequestedSupervisionType(requestedType, requestedRole);
        String studentName = requireText(studentNameValue, "Le nom de l'etudiant est obligatoire");
        String level = requireText(levelValue, "Le niveau est obligatoire");
        String subjectTitle = requireText(subjectTitleValue, "Le titre du sujet est obligatoire");
        String academicYear = requireText(academicYearValue, "L'annee universitaire est obligatoire");
        BigDecimal quantity = normalizeQuantity(supervisionType, requestedQuantity);
        JuryRole roleInJury = resolveJuryRole(supervisionType, requestedRole);

        activity.setSupervisionType(supervisionType);
        activity.setStudentName(studentName);
        activity.setStudentProgram(level);
        activity.setSubjectTitle(subjectTitle);
        activity.setSupervisionStatus(requestedStatus);
        activity.setRoleInJury(roleInJury);
        activity.setQuantityValue(quantity);
        activity.setActivityPoints(activity.getUser() != null && activity.getUser().isTeacherWithoutPoints()
            ? BigDecimal.ZERO
            : calculatePoints(supervisionType, quantity));
        activity.setAcademicYear(academicYear);
    }

    private SupervisionActivityResponse toResponse(SupervisionActivity activity) {
        User teacher = activity.getUser();
        SupervisionType normalizedType = normalizeSupervisionType(activity.getSupervisionType());
        BigDecimal quantity = resolveQuantity(activity, normalizedType);
        BigDecimal activityPoints = resolveActivityPoints(activity, normalizedType, quantity);

        return new SupervisionActivityResponse(
            activity.getId(),
            teacher.getId(),
            teacher.getFirstName() + " " + teacher.getLastName(),
            normalizedType,
            activity.getStudentName(),
            activity.getStudentProgram(),
            activity.getSubjectTitle(),
            activity.getSupervisionStatus(),
            resolveJuryRole(normalizedType, activity.getRoleInJury()),
            quantity,
            activityPoints,
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

    private List<SupervisionActivity> findAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return supervisionActivityRepository.findAllByOrderByCreatedAtDesc();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return supervisionActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(getRequiredDepartmentId(currentUser));
        }

        return supervisionActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    private boolean canAccess(User currentUser, SupervisionActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToDepartmentScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean canManage(User currentUser, SupervisionActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        return isOwner(currentUser, activity)
            && (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.A_CORRIGER);
    }

    private boolean belongsToDepartmentScope(User reviewer, SupervisionActivity activity) {
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

    private boolean isOwner(User currentUser, SupervisionActivity activity) {
        return activity.getUser().getId().equals(currentUser.getId());
    }

    private SupervisionType normalizeSupervisionType(SupervisionType type) {
        if (type == null) {
            return SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
        }

        return switch (type) {
            case PFE -> SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
            case MEMOIRE, STAGE -> SupervisionType.PI;
            case THESE -> SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
            default -> type;
        };
    }

    private SupervisionType resolveRequestedSupervisionType(SupervisionType type, JuryRole requestedRole) {
        if (type == SupervisionType.PFE) {
            if (requestedRole == JuryRole.RAPPORTEUR) {
                return SupervisionType.PFE_RAPPORTEUR;
            }
            if (requestedRole == JuryRole.PRESIDENT_JURY) {
                return SupervisionType.PFE_PRESIDENT_JURY;
            }
            return SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
        }

        return normalizeSupervisionType(type);
    }

    private JuryRole resolveJuryRole(SupervisionType supervisionType, JuryRole requestedRole) {
        return switch (supervisionType) {
            case PFE_ENCADREMENT_ACADEMIQUE -> JuryRole.ENCADRANT;
            case PFE_RAPPORTEUR -> JuryRole.RAPPORTEUR;
            case PFE_PRESIDENT_JURY -> JuryRole.PRESIDENT_JURY;
            default -> requestedRole != null ? requestedRole : JuryRole.MEMBRE_JURY;
        };
    }

    private BigDecimal normalizeQuantity(SupervisionType supervisionType, BigDecimal requestedQuantity) {
        BigDecimal quantity = requestedQuantity != null ? requestedQuantity : DEFAULT_QUANTITY;

        if (quantity.signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La quantite doit etre strictement positive");
        }

        if (supervisionType == SupervisionType.SEMINAIRE || supervisionType == SupervisionType.PI) {
            if (quantity.compareTo(SEMINAR_PI_MIN_QUANTITY) < 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pour le type Seminaire ou PI, la quantite doit etre superieure ou egale a 4 par an"
                );
            }
            return quantity.setScale(2, RoundingMode.HALF_UP);
        }

        if (supervisionType == SupervisionType.COURS_SOUTIEN) {
            return quantity.setScale(2, RoundingMode.HALF_UP);
        }

        return DEFAULT_QUANTITY.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculatePoints(SupervisionType supervisionType, BigDecimal quantity) {
        return switch (supervisionType) {
            case PFE_ENCADREMENT_ACADEMIQUE -> PFE_ACADEMIC_POINTS;
            case PFE_RAPPORTEUR -> PFE_REVIEWER_POINTS;
            case PFE_PRESIDENT_JURY -> PFE_JURY_PRESIDENT_POINTS;
            case SEMINAIRE, PI -> GROUP_POINTS.multiply(quantity);
            case APP0 -> APP0_POINTS;
            case COURS_SOUTIEN -> SUPPORT_HOUR_POINTS.multiply(quantity);
            default -> PFE_ACADEMIC_POINTS;
        };
    }

    private BigDecimal resolveQuantity(SupervisionActivity activity, SupervisionType supervisionType) {
        if (activity.getQuantityValue() != null && activity.getQuantityValue().signum() > 0) {
            return activity.getQuantityValue().setScale(2, RoundingMode.HALF_UP);
        }

        if (supervisionType == SupervisionType.SEMINAIRE
            || supervisionType == SupervisionType.PI
            || supervisionType == SupervisionType.COURS_SOUTIEN) {
            return DEFAULT_QUANTITY.setScale(2, RoundingMode.HALF_UP);
        }

        return DEFAULT_QUANTITY.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveActivityPoints(SupervisionActivity activity) {
        if (activity.getUser() != null && activity.getUser().isTeacherWithoutPoints()) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        SupervisionType supervisionType = normalizeSupervisionType(activity.getSupervisionType());
        BigDecimal quantity = resolveQuantity(activity, supervisionType);
        return resolveActivityPoints(activity, supervisionType, quantity);
    }

    private BigDecimal resolveActivityPoints(
        SupervisionActivity activity,
        SupervisionType supervisionType,
        BigDecimal quantity
    ) {
        if (activity.getActivityPoints() != null) {
            return activity.getActivityPoints().setScale(2, RoundingMode.HALF_UP);
        }
        return calculatePoints(supervisionType, quantity).setScale(2, RoundingMode.HALF_UP);
    }

    private boolean isPfeActivity(SupervisionActivity activity) {
        SupervisionType supervisionType = normalizeSupervisionType(activity.getSupervisionType());
        return supervisionType == SupervisionType.PFE_ENCADREMENT_ACADEMIQUE
            || supervisionType == SupervisionType.PFE_RAPPORTEUR
            || supervisionType == SupervisionType.PFE_PRESIDENT_JURY;
    }

    private String requireText(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }
}

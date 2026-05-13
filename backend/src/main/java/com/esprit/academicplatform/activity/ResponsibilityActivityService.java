package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateResponsibilityActivityRequest;
import com.esprit.academicplatform.activity.dto.ResponsibilityActivityResponse;
import com.esprit.academicplatform.activity.dto.ResponsibilitySummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateResponsibilityActivityRequest;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.ResponsibilityType;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ResponsibilityActivityService {

    private final ResponsibilityActivityRepository responsibilityActivityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ResponsibilityActivityResponse> getAccessibleResponsibilities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        return findAccessibleActivities(currentUser)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ResponsibilitySummaryResponse getResponsibilitySummary(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<ResponsibilityActivity> activities = findAccessibleActivities(currentUser);
        LocalDate today = LocalDate.now();

        long activeResponsibilities = activities.stream()
            .filter(activity -> !activity.getStartDate().isAfter(today))
            .filter(activity -> activity.getEndDate() == null || !activity.getEndDate().isBefore(today))
            .count();

        long completedResponsibilities = activities.stream()
            .filter(activity -> activity.getEndDate() != null && activity.getEndDate().isBefore(today))
            .count();

        long leadershipResponsibilities = activities.stream()
            .filter(activity -> {
                ResponsibilityType normalizedType = normalizeResponsibilityType(activity.getResponsibilityType());
                return normalizedType == ResponsibilityType.CHEF_DEPARTEMENT
                    || normalizedType == ResponsibilityType.RESPONSABLE_FILIERE;
            })
            .count();

        return new ResponsibilitySummaryResponse(
            activities.size(),
            activeResponsibilities,
            completedResponsibilities,
            leadershipResponsibilities
        );
    }

    @Transactional(readOnly = true)
    public ResponsibilityActivityResponse getResponsibilityById(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ResponsibilityActivity activity = responsibilityActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsabilité introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé à cette responsabilité");
        }

        return toResponse(activity);
    }

    @Transactional
    public ResponsibilityActivityResponse createResponsibility(
        CreateResponsibilityActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);

        ResponsibilityActivity activity = new ResponsibilityActivity();
        activity.setUser(currentUser);
        applyChanges(activity, request, currentUser);

        return toResponse(responsibilityActivityRepository.save(activity));
    }

    @Transactional
    public ResponsibilityActivityResponse updateResponsibility(
        Long id,
        UpdateResponsibilityActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        ResponsibilityActivity activity = responsibilityActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsabilité introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier cette responsabilité");
        }

        applyChanges(activity, request, currentUser);
        return toResponse(responsibilityActivityRepository.save(activity));
    }

    @Transactional
    public void deleteResponsibility(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ResponsibilityActivity activity = responsibilityActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsabilité introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas supprimer cette responsabilité");
        }

        responsibilityActivityRepository.delete(activity);
    }

    private void applyChanges(
        ResponsibilityActivity activity,
        CreateResponsibilityActivityRequest request,
        User currentUser
    ) {
        ResponsibilityType responsibilityType = normalizeResponsibilityType(request.responsibilityType());
        validateResponsibilityTypeForRole(currentUser);
        validateDates(request.startDate(), request.endDate());

        activity.setResponsibilityType(responsibilityType);
        activity.setStartDate(request.startDate());
        activity.setEndDate(request.endDate());
        activity.setAcademicYear(request.academicYear());
    }

    private void applyChanges(
        ResponsibilityActivity activity,
        UpdateResponsibilityActivityRequest request,
        User currentUser
    ) {
        ResponsibilityType responsibilityType = normalizeResponsibilityType(request.responsibilityType());
        validateResponsibilityTypeForRole(currentUser);
        validateDates(request.startDate(), request.endDate());

        activity.setResponsibilityType(responsibilityType);
        activity.setStartDate(request.startDate());
        activity.setEndDate(request.endDate());
        activity.setAcademicYear(request.academicYear());
    }

    private ResponsibilityActivityResponse toResponse(ResponsibilityActivity activity) {
        User teacher = activity.getUser();
        ResponsibilityType normalizedType = normalizeResponsibilityType(activity.getResponsibilityType());
        return new ResponsibilityActivityResponse(
            activity.getId(),
            teacher.getId(),
            teacher.getFirstName() + " " + teacher.getLastName(),
            normalizedType,
            activity.getStartDate(),
            activity.getEndDate(),
            activity.getStatus(),
            activity.getAcademicYear(),
            activity.getCreatedAt(),
            activity.getUpdatedAt()
        );
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
    }

    private List<ResponsibilityActivity> findAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return responsibilityActivityRepository.findAllByOrderByCreatedAtDesc();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return responsibilityActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(getRequiredDepartmentId(currentUser));
        }

        return responsibilityActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    private boolean canAccess(User currentUser, ResponsibilityActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToDepartmentScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean canManage(User currentUser, ResponsibilityActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        return isOwner(currentUser, activity)
            && (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.A_CORRIGER);
    }

    private boolean belongsToDepartmentScope(User reviewer, ResponsibilityActivity activity) {
        Long reviewerDepartmentId = getRequiredDepartmentId(reviewer);
        User activityOwner = activity.getUser();
        if (activityOwner.getDepartment() == null) {
            return false;
        }

        return reviewerDepartmentId.equals(activityOwner.getDepartment().getId());
    }

    private Long getRequiredDepartmentId(User user) {
        if (user.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun département n’est associé à cet utilisateur");
        }
        return user.getDepartment().getId();
    }

    private boolean isOwner(User currentUser, ResponsibilityActivity activity) {
        return activity.getUser().getId().equals(currentUser.getId());
    }

    private ResponsibilityType normalizeResponsibilityType(ResponsibilityType type) {
        if (type == null) {
            return ResponsibilityType.RESPONSABLE_FILIERE;
        }
        if (type == ResponsibilityType.MAITRE_STAGE || type == ResponsibilityType.COORDINATEUR_MODULE) {
            return ResponsibilityType.RESPONSABLE_FILIERE;
        }
        return type;
    }

    private void validateResponsibilityTypeForRole(User currentUser) {
        boolean canDeclareResponsibility = switch (currentUser.getRole()) {
            case ENSEIGNANT, CHEF_DEPARTEMENT, ADMINISTRATION, SUPER_ADMIN -> true;
            default -> false;
        };

        if (!canDeclareResponsibility) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Ce role n'est pas autorise a declarer une responsabilite"
            );
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de debut est obligatoire");
        }

        if (endDate != null && endDate.isBefore(startDate)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La date de fin doit etre superieure ou egale a la date de debut"
            );
        }
    }
}

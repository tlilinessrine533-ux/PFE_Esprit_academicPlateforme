package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.CreateExamSurveillanceActivityRequest;
import com.esprit.academicplatform.activity.dto.ExamSurveillanceActivityResponse;
import com.esprit.academicplatform.activity.dto.ExamSurveillanceSummaryResponse;
import com.esprit.academicplatform.activity.dto.UpdateExamSurveillanceActivityRequest;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.SurveillanceSessionDay;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ExamSurveillanceActivityService {

    private static final BigDecimal WEEKDAY_POINTS = BigDecimal.ONE;
    private static final BigDecimal SATURDAY_POINTS = BigDecimal.valueOf(2);

    private final ExamSurveillanceActivityRepository examSurveillanceActivityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ExamSurveillanceActivityResponse> getAccessibleExamSurveillanceActivities(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        return findAccessibleActivities(currentUser)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ExamSurveillanceSummaryResponse getExamSurveillanceSummary(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<ExamSurveillanceActivity> activities = findAccessibleActivities(currentUser);

        BigDecimal totalPoints = activities.stream()
            .map(this::resolveSessionPoints)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ExamSurveillanceSummaryResponse(
            activities.size(),
            totalPoints,
            activities.stream().filter(activity -> activity.getSemester() == SemesterType.S1).count(),
            activities.stream().filter(activity -> activity.getSemester() == SemesterType.S2).count(),
            activities.stream().filter(activity -> activity.getSemester() == SemesterType.ANNUEL).count()
        );
    }

    @Transactional(readOnly = true)
    public ExamSurveillanceActivityResponse getExamSurveillanceActivityById(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ExamSurveillanceActivity activity = examSurveillanceActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Surveillance introuvable"));

        if (!canAccess(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cette surveillance");
        }

        return toResponse(activity);
    }

    @Transactional
    public ExamSurveillanceActivityResponse createExamSurveillanceActivity(
        CreateExamSurveillanceActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);

        ExamSurveillanceActivity activity = new ExamSurveillanceActivity();
        activity.setUser(currentUser);
        applyChanges(activity, request);

        return toResponse(examSurveillanceActivityRepository.save(activity));
    }

    @Transactional
    public ExamSurveillanceActivityResponse updateExamSurveillanceActivity(
        Long id,
        UpdateExamSurveillanceActivityRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        ExamSurveillanceActivity activity = examSurveillanceActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Surveillance introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier cette surveillance");
        }

        applyChanges(activity, request);
        return toResponse(examSurveillanceActivityRepository.save(activity));
    }

    @Transactional
    public void deleteExamSurveillanceActivity(Long id, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ExamSurveillanceActivity activity = examSurveillanceActivityRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Surveillance introuvable"));

        if (!canManage(currentUser, activity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas supprimer cette surveillance");
        }

        examSurveillanceActivityRepository.delete(activity);
    }

    private void applyChanges(ExamSurveillanceActivity activity, CreateExamSurveillanceActivityRequest request) {
        activity.setSessionName(request.sessionName());
        activity.setSemester(request.semester());
        activity.setSessionDay(request.sessionDay());

        BigDecimal points = pointsForDay(request.sessionDay());
        activity.setSessionPoints(points);
        activity.setHoursCount(points);
        activity.setAcademicYear(request.academicYear());
    }

    private void applyChanges(ExamSurveillanceActivity activity, UpdateExamSurveillanceActivityRequest request) {
        activity.setSessionName(request.sessionName());
        activity.setSemester(request.semester());
        activity.setSessionDay(request.sessionDay());

        BigDecimal points = pointsForDay(request.sessionDay());
        activity.setSessionPoints(points);
        activity.setHoursCount(points);
        activity.setAcademicYear(request.academicYear());
    }

    private ExamSurveillanceActivityResponse toResponse(ExamSurveillanceActivity activity) {
        User teacher = activity.getUser();
        return new ExamSurveillanceActivityResponse(
            activity.getId(),
            teacher.getId(),
            teacher.getFirstName() + " " + teacher.getLastName(),
            activity.getSessionName(),
            activity.getSemester(),
            resolveSessionDay(activity),
            resolveSessionPoints(activity),
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

    private List<ExamSurveillanceActivity> findAccessibleActivities(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return examSurveillanceActivityRepository.findAllByOrderByCreatedAtDesc();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return examSurveillanceActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(getRequiredDepartmentId(currentUser));
        }

        return examSurveillanceActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    private boolean canAccess(User currentUser, ExamSurveillanceActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return belongsToDepartmentScope(currentUser, activity) || isOwner(currentUser, activity);
        }

        return isOwner(currentUser, activity);
    }

    private boolean canManage(User currentUser, ExamSurveillanceActivity activity) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return true;
        }

        return isOwner(currentUser, activity)
            && (activity.getStatus() == ActivityStatus.BROUILLON || activity.getStatus() == ActivityStatus.A_CORRIGER);
    }

    private boolean belongsToDepartmentScope(User reviewer, ExamSurveillanceActivity activity) {
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

    private boolean isOwner(User currentUser, ExamSurveillanceActivity activity) {
        return activity.getUser().getId().equals(currentUser.getId());
    }

    private SurveillanceSessionDay resolveSessionDay(ExamSurveillanceActivity activity) {
        if (activity.getSessionDay() != null) {
            return activity.getSessionDay();
        }
        return SurveillanceSessionDay.LUNDI;
    }

    private BigDecimal resolveSessionPoints(ExamSurveillanceActivity activity) {
        if (activity.getSessionPoints() != null) {
            return activity.getSessionPoints();
        }
        if (activity.getSessionDay() != null) {
            return pointsForDay(activity.getSessionDay());
        }
        if (activity.getHoursCount() != null && activity.getHoursCount().signum() > 0) {
            return activity.getHoursCount();
        }
        return WEEKDAY_POINTS;
    }

    private BigDecimal pointsForDay(SurveillanceSessionDay sessionDay) {
        return sessionDay == SurveillanceSessionDay.SAMEDI ? SATURDAY_POINTS : WEEKDAY_POINTS;
    }
}

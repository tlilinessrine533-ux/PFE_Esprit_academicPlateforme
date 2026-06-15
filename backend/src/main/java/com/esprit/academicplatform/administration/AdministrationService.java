package com.esprit.academicplatform.administration;

import com.esprit.academicplatform.activity.Activity;
import com.esprit.academicplatform.activity.ActivityRepository;
import com.esprit.academicplatform.activity.AvailabilityRequestActivity;
import com.esprit.academicplatform.activity.AvailabilityRequestActivityRepository;
import com.esprit.academicplatform.activity.EventActivity;
import com.esprit.academicplatform.activity.ExamSurveillanceActivity;
import com.esprit.academicplatform.activity.ResearchActivity;
import com.esprit.academicplatform.activity.ResponsibilityActivity;
import com.esprit.academicplatform.activity.SupervisionActivity;
import com.esprit.academicplatform.activity.TeachingActivity;
import com.esprit.academicplatform.activity.TeachingPerformanceCalculator;
import com.esprit.academicplatform.administration.dto.AbsenceSummaryResponse;
import com.esprit.academicplatform.administration.dto.AdministrationConfigResponse;
import com.esprit.academicplatform.administration.dto.AdministrationConfigUpdateRequest;
import com.esprit.academicplatform.administration.dto.AdministrativeDecisionHistoryResponse;
import com.esprit.academicplatform.administration.dto.AdministrativeDecisionRequest;
import com.esprit.academicplatform.administration.dto.AdministrativeEvaluationResponse;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.ValidationDecision;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdministrationService {

    private static final String KEY_REFERENCE_POINTS = "prime.reference.points";
    private static final String LEGACY_KEY_BONUS_BASE_AMOUNT = "bonus.base.amount";
    private static final String KEY_TOTAL_PRIME_AMOUNT = "prime.total.amount";
    private static final String KEY_BONUS_ABSENCE_PENALTY_PER_DAY = "bonus.absence.penalty.per.day";
    private static final String KEY_PROMOTION_TEACHING_POINT_FACTOR = "promotion.teaching.point.factor";
    private static final String KEY_POINTS_TEACHING = "points.teaching";
    private static final String KEY_POINTS_SUPERVISION = "points.supervision";
    private static final String KEY_POINTS_RESEARCH = "points.research";
    private static final String KEY_POINTS_EVENT = "points.event";
    private static final String KEY_POINTS_EXAM_SURVEILLANCE = "points.exam.surveillance";
    private static final String KEY_POINTS_RESPONSIBILITY = "points.responsibility";

    private static final BigDecimal DEFAULT_REFERENCE_POINTS = new BigDecimal("500.00");
    private static final BigDecimal DEFAULT_TOTAL_PRIME_AMOUNT = new BigDecimal("0.00");
    private static final BigDecimal DEFAULT_BONUS_ABSENCE_PENALTY_PER_DAY = new BigDecimal("5.00");
    private static final BigDecimal DEFAULT_PROMOTION_TEACHING_POINT_FACTOR = new BigDecimal("0.10");
    private static final BigDecimal DEFAULT_POINTS_TEACHING = new BigDecimal("5.00");
    private static final BigDecimal DEFAULT_POINTS_SUPERVISION = new BigDecimal("3.00");
    private static final BigDecimal DEFAULT_POINTS_RESEARCH = new BigDecimal("4.00");
    private static final BigDecimal DEFAULT_POINTS_EVENT = new BigDecimal("2.00");
    private static final BigDecimal DEFAULT_POINTS_EXAM_SURVEILLANCE = new BigDecimal("1.00");
    private static final BigDecimal DEFAULT_POINTS_RESPONSIBILITY = new BigDecimal("3.00");

    private final AdministrationSettingRepository administrationSettingRepository;
    private final AdministrativeDecisionRepository administrativeDecisionRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final AvailabilityRequestActivityRepository availabilityRequestActivityRepository;
    private final TeachingPerformanceCalculator teachingPerformanceCalculator;

    @Transactional(readOnly = true)
    public AdministrationConfigResponse getConfiguration(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        requireAdministration(currentUser);
        return toConfigResponse(loadConfig());
    }

    @Transactional
    public AdministrationConfigResponse updateConfiguration(
        AdministrationConfigUpdateRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        requireAdministration(currentUser);

        saveSetting(KEY_REFERENCE_POINTS, request.referencePoints());
        saveSetting(LEGACY_KEY_BONUS_BASE_AMOUNT, request.referencePoints());
        saveSetting(KEY_TOTAL_PRIME_AMOUNT, request.totalPrimeAmount());
        saveSetting(KEY_BONUS_ABSENCE_PENALTY_PER_DAY, request.bonusAbsencePenaltyPerDay());
        saveSetting(KEY_PROMOTION_TEACHING_POINT_FACTOR, request.promotionTeachingPointFactor());
        saveSetting(KEY_POINTS_TEACHING, request.teachingActivityPoint());
        saveSetting(KEY_POINTS_SUPERVISION, request.supervisionActivityPoint());
        saveSetting(KEY_POINTS_RESEARCH, request.researchActivityPoint());
        saveSetting(KEY_POINTS_EVENT, request.eventActivityPoint());
        saveSetting(KEY_POINTS_EXAM_SURVEILLANCE, request.examSurveillanceActivityPoint());
        saveSetting(KEY_POINTS_RESPONSIBILITY, request.responsibilityActivityPoint());

        return toConfigResponse(loadConfig());
    }

    @Transactional(readOnly = true)
    public List<AdministrativeEvaluationResponse> getEvaluations(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        requireAdministrationOrDepartmentHead(currentUser);
        String resolvedPeriodLabel = resolvePeriodLabel(periodLabel);
        List<AdministrativeEvaluationResponse> evaluations = computeEvaluations(resolvedPeriodLabel);

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            Long departmentId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (departmentId == null) {
                return List.of();
            }

            Set<Long> teacherIdsInDepartment = userRepository.findByRoleInAndIsActiveTrue(
                    List.of(RoleType.ENSEIGNANT)
                ).stream()
                .filter(user -> user.getDepartment() != null && Objects.equals(user.getDepartment().getId(), departmentId))
                .map(User::getId)
                .collect(Collectors.toSet());

            return evaluations.stream()
                .filter(item -> teacherIdsInDepartment.contains(item.teacherId()))
                .toList();
        }

        return evaluations;
    }

    @Transactional(readOnly = true)
    public List<AdministrativeEvaluationResponse> computeEvaluationsForPeriod(String periodLabel) {
        return computeEvaluations(resolvePeriodLabel(periodLabel));
    }

    @Transactional
    public AdministrativeDecisionHistoryResponse submitFinalDecision(
        Long teacherId,
        AdministrativeDecisionRequest request,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);
        requireAdministration(currentUser);
        String resolvedPeriodLabel = resolvePeriodLabel(request.periodLabel());

        if (request.decision() != ValidationDecision.VALIDE && request.decision() != ValidationDecision.REJETE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La decision finale doit etre VALIDE ou REJETE."
            );
        }

        User teacher = userRepository.findById(teacherId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignant introuvable"));

        if (teacher.getRole() != RoleType.ENSEIGNANT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur selectionne n'est pas un enseignant.");
        }

        AdministrativeEvaluationResponse evaluation = computeEvaluations(resolvedPeriodLabel).stream()
            .filter(item -> Objects.equals(item.teacherId(), teacherId))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluation introuvable pour cet enseignant."));

        AdministrativeDecision decision = new AdministrativeDecision();
        decision.setTeacher(teacher);
        decision.setPeriodLabel(resolvedPeriodLabel);
        decision.setValidatedActivities(evaluation.validatedActivities());
        decision.setValidatedTeachingPoints(scaled(evaluation.validatedTeachingPoints()));
        decision.setAbsenceDays(evaluation.absenceDays());
        decision.setActivityTypePoints(scaled(evaluation.activityTypePoints()));
        decision.setCalculatedBonus(scaled(evaluation.calculatedBonus()));
        decision.setCalculatedPromotionPoints(scaled(evaluation.calculatedPromotionPoints()));
        decision.setDecisionStatus(request.decision().name());
        decision.setDecisionComment(safeTrim(request.commentText()));
        decision.setDecidedBy(currentUser);
        decision.setDecidedAt(java.time.LocalDateTime.now());

        AdministrativeDecision saved = administrativeDecisionRepository.save(decision);
        return toHistoryResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AdministrativeDecisionHistoryResponse> getDecisionHistory(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        requireAdministration(currentUser);
        String resolvedPeriod = StringUtils.hasText(periodLabel) ? periodLabel.trim() : null;

        return administrativeDecisionRepository.findAll().stream()
            .filter(item -> resolvedPeriod == null || Objects.equals(item.getPeriodLabel(), resolvedPeriod))
            .sorted(Comparator.comparing(AdministrativeDecision::getCreatedAt).reversed())
            .map(this::toHistoryResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AbsenceSummaryResponse> getAbsenceSummaries(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        if (currentUser.getRole() != RoleType.ADMINISTRATION
            && currentUser.getRole() != RoleType.CHEF_DEPARTEMENT
            && currentUser.getRole() != RoleType.ENSEIGNANT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse au suivi des absences.");
        }

        String resolvedPeriodLabel = resolvePeriodLabel(periodLabel);
        List<AvailabilityRequestActivity> leaveRequests = availabilityRequestActivityRepository.findAllByOrderByCreatedAtDesc().stream()
            .filter(item -> item.getRequestType() == AvailabilityRequestType.CONGE)
            .filter(item -> Objects.equals(item.getAcademicYear(), resolvedPeriodLabel))
            .filter(item -> canAccessAbsenceRequest(currentUser, item))
            .toList();

        Map<Long, AbsenceAccumulator> accumulators = new LinkedHashMap<>();
        for (AvailabilityRequestActivity request : leaveRequests) {
            if (request.getUser() == null || request.getUser().getId() == null) {
                continue;
            }

            Long teacherId = request.getUser().getId();
            AbsenceAccumulator accumulator = accumulators.computeIfAbsent(teacherId, ignored -> new AbsenceAccumulator(request.getUser()));
            int days = calculateAbsenceDays(request);
            accumulator.addRequest(days, request.getStatus());
        }

        return accumulators.values().stream()
            .map(item -> item.toResponse(resolvedPeriodLabel))
            .sorted(Comparator.comparing(AbsenceSummaryResponse::totalAbsenceDays).reversed()
                .thenComparing(AbsenceSummaryResponse::teacherName))
            .toList();
    }

    private List<AdministrativeEvaluationResponse> computeEvaluations(String periodLabel) {
        List<User> teachers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT))
            .stream()
            .sorted(Comparator.comparing(this::displayName))
            .toList();

        if (teachers.isEmpty()) {
            return List.of();
        }

        AdminConfig config = loadConfig();

        Map<Long, List<Activity>> activitiesByTeacher = new LinkedHashMap<>();
        for (User teacher : teachers) {
            activitiesByTeacher.put(teacher.getId(), new ArrayList<>());
        }

        for (Activity activity : activityRepository.findAllByOrderByCreatedAtDesc()) {
            if (activity == null || activity.getUser() == null || activity.getUser().getId() == null) {
                continue;
            }
            if (!Objects.equals(activity.getAcademicYear(), periodLabel)) {
                continue;
            }
            if (!isValidatedActivity(activity.getStatus())) {
                continue;
            }
            List<Activity> bucket = activitiesByTeacher.get(activity.getUser().getId());
            if (bucket != null) {
                bucket.add(activity);
            }
        }

        Map<Long, Integer> absenceDaysByTeacher = buildValidatedAbsenceDaysByTeacher(periodLabel);
        Map<Long, AdministrativeDecision> latestDecisionByTeacher = latestDecisionsByTeacher(periodLabel);
        Map<Long, TeacherComputation> computationsByTeacherId = new LinkedHashMap<>();
        BigDecimal totalWeight = zeroWeight();

        for (User teacher : teachers) {
            TeacherComputation computation = computeTeacherMetrics(
                activitiesByTeacher.getOrDefault(teacher.getId(), List.of()),
                absenceDaysByTeacher.getOrDefault(teacher.getId(), 0),
                config
            );
            computationsByTeacherId.put(teacher.getId(), computation);
            totalWeight = totalWeight.add(computation.calculatedWeight());
        }

        BigDecimal resolvedTotalWeight = scaledWeight(totalWeight);

        List<AdministrativeEvaluationResponse> evaluations = new ArrayList<>();
        for (User teacher : teachers) {
            TeacherComputation computation = computationsByTeacherId.get(teacher.getId());
            AdministrativeDecision latestDecision = latestDecisionByTeacher.get(teacher.getId());
            BigDecimal calculatedPrime = calculatePrimeAmount(
                computation.calculatedWeight(),
                resolvedTotalWeight,
                config.totalPrimeAmount()
            );

            evaluations.add(new AdministrativeEvaluationResponse(
                teacher.getId(),
                displayName(teacher),
                teacher.getDepartment() != null ? teacher.getDepartment().getName() : null,
                periodLabel,
                computation.validatedActivities(),
                computation.validatedTeachingPoints(),
                computation.absenceDays(),
                computation.activityTypePoints(),
                computation.calculatedWeight(),
                calculatedPrime,
                computation.calculatedPromotionPoints(),
                latestDecision != null ? latestDecision.getDecisionStatus() : "EN_ATTENTE",
                latestDecision != null ? latestDecision.getDecisionComment() : null,
                latestDecision != null ? displayName(latestDecision.getDecidedBy()) : null,
                latestDecision != null ? latestDecision.getDecidedAt() : null
            ));
        }

        return evaluations.stream()
            .sorted(Comparator.comparing(AdministrativeEvaluationResponse::calculatedBonus).reversed()
                .thenComparing(AdministrativeEvaluationResponse::teacherName))
            .toList();
    }

    private TeacherComputation computeTeacherMetrics(
        List<Activity> validatedActivities,
        int validatedAbsenceDays,
        AdminConfig config
    ) {
        long teachingCount = 0;
        long supervisionCount = 0;
        long researchCount = 0;
        long eventCount = 0;
        long examCount = 0;
        long responsibilityCount = 0;
        BigDecimal validatedTeachingPoints = zero();

        for (Activity activity : validatedActivities) {
            if (activity instanceof TeachingActivity teaching) {
                teachingCount += 1;
                validatedTeachingPoints = validatedTeachingPoints.add(
                    nullSafe(teachingPerformanceCalculator.calculateApprovedTotalPoints(teaching))
                );
                continue;
            }
            if (activity instanceof SupervisionActivity) {
                supervisionCount += 1;
                continue;
            }
            if (activity instanceof ResearchActivity) {
                researchCount += 1;
                continue;
            }
            if (activity instanceof EventActivity) {
                eventCount += 1;
                continue;
            }
            if (activity instanceof ExamSurveillanceActivity) {
                examCount += 1;
                continue;
            }
            if (activity instanceof ResponsibilityActivity) {
                responsibilityCount += 1;
            }
        }

        BigDecimal activityTypePoints = scaled(
            config.teachingActivityPoint().multiply(BigDecimal.valueOf(teachingCount))
                .add(config.supervisionActivityPoint().multiply(BigDecimal.valueOf(supervisionCount)))
                .add(config.researchActivityPoint().multiply(BigDecimal.valueOf(researchCount)))
                .add(config.eventActivityPoint().multiply(BigDecimal.valueOf(eventCount)))
                .add(config.examSurveillanceActivityPoint().multiply(BigDecimal.valueOf(examCount)))
                .add(config.responsibilityActivityPoint().multiply(BigDecimal.valueOf(responsibilityCount)))
        );

        BigDecimal promotionPointsBeforePenalty = scaled(
            activityTypePoints.add(validatedTeachingPoints.multiply(config.promotionTeachingPointFactor()))
        );
        BigDecimal promotionPoints = scaled(
            promotionPointsBeforePenalty
                .subtract(config.bonusAbsencePenaltyPerDay().multiply(BigDecimal.valueOf(validatedAbsenceDays)))
        );
        BigDecimal calculatedWeight = calculateWeight(promotionPoints, config.referencePoints());

        return new TeacherComputation(
            validatedActivities.size(),
            scaled(validatedTeachingPoints),
            validatedAbsenceDays,
            activityTypePoints,
            calculatedWeight,
            promotionPoints
        );
    }

    private Map<Long, Integer> buildValidatedAbsenceDaysByTeacher(String periodLabel) {
        Map<Long, Integer> totals = new LinkedHashMap<>();
        for (AvailabilityRequestActivity activity : availabilityRequestActivityRepository.findAllByOrderByCreatedAtDesc()) {
            if (activity.getRequestType() != AvailabilityRequestType.CONGE) {
                continue;
            }
            if (!Objects.equals(activity.getAcademicYear(), periodLabel)) {
                continue;
            }
            if (!isValidatedActivity(activity.getStatus())) {
                continue;
            }
            if (activity.getUser() == null || activity.getUser().getId() == null) {
                continue;
            }

            int days = calculateAbsenceDays(activity);
            totals.merge(activity.getUser().getId(), days, Integer::sum);
        }
        return totals;
    }

    private Map<Long, AdministrativeDecision> latestDecisionsByTeacher(String periodLabel) {
        Map<Long, AdministrativeDecision> latest = new LinkedHashMap<>();
        administrativeDecisionRepository.findAll().stream()
            .filter(item -> Objects.equals(item.getPeriodLabel(), periodLabel))
            .sorted(Comparator.comparing(AdministrativeDecision::getCreatedAt).reversed())
            .forEach(item -> {
                if (item.getTeacher() == null || item.getTeacher().getId() == null) {
                    return;
                }
                latest.putIfAbsent(item.getTeacher().getId(), item);
            });
        return latest;
    }

    private AdministrationConfigResponse toConfigResponse(AdminConfig config) {
        return new AdministrationConfigResponse(
            config.referencePoints(),
            config.bonusAbsencePenaltyPerDay(),
            config.promotionTeachingPointFactor(),
            config.teachingActivityPoint(),
            config.supervisionActivityPoint(),
            config.researchActivityPoint(),
            config.eventActivityPoint(),
            config.examSurveillanceActivityPoint(),
            config.responsibilityActivityPoint(),
            config.totalPrimeAmount()
        );
    }

    private AdministrativeDecisionHistoryResponse toHistoryResponse(AdministrativeDecision item) {
        return new AdministrativeDecisionHistoryResponse(
            item.getId(),
            item.getTeacher() != null ? item.getTeacher().getId() : null,
            displayName(item.getTeacher()),
            item.getTeacher() != null && item.getTeacher().getDepartment() != null
                ? item.getTeacher().getDepartment().getName()
                : null,
            item.getPeriodLabel(),
            item.getValidatedActivities(),
            scaled(item.getValidatedTeachingPoints()),
            item.getAbsenceDays(),
            scaled(item.getActivityTypePoints()),
            scaled(item.getCalculatedBonus()),
            scaled(item.getCalculatedPromotionPoints()),
            item.getDecisionStatus(),
            item.getDecisionComment(),
            item.getDecidedBy() != null ? item.getDecidedBy().getId() : null,
            displayName(item.getDecidedBy()),
            item.getDecidedAt(),
            item.getCreatedAt()
        );
    }

    private AdminConfig loadConfig() {
        Map<String, String> valuesByKey = new LinkedHashMap<>();
        for (AdministrationSetting setting : administrationSettingRepository.findAll()) {
            valuesByKey.put(setting.getSettingKey(), setting.getSettingValue());
        }

        return new AdminConfig(
            readDecimalWithFallback(valuesByKey, KEY_REFERENCE_POINTS, LEGACY_KEY_BONUS_BASE_AMOUNT, DEFAULT_REFERENCE_POINTS),
            readDecimal(valuesByKey, KEY_TOTAL_PRIME_AMOUNT, DEFAULT_TOTAL_PRIME_AMOUNT),
            readDecimal(valuesByKey, KEY_BONUS_ABSENCE_PENALTY_PER_DAY, DEFAULT_BONUS_ABSENCE_PENALTY_PER_DAY),
            readDecimal(valuesByKey, KEY_PROMOTION_TEACHING_POINT_FACTOR, DEFAULT_PROMOTION_TEACHING_POINT_FACTOR),
            readDecimal(valuesByKey, KEY_POINTS_TEACHING, DEFAULT_POINTS_TEACHING),
            readDecimal(valuesByKey, KEY_POINTS_SUPERVISION, DEFAULT_POINTS_SUPERVISION),
            readDecimal(valuesByKey, KEY_POINTS_RESEARCH, DEFAULT_POINTS_RESEARCH),
            readDecimal(valuesByKey, KEY_POINTS_EVENT, DEFAULT_POINTS_EVENT),
            readDecimal(valuesByKey, KEY_POINTS_EXAM_SURVEILLANCE, DEFAULT_POINTS_EXAM_SURVEILLANCE),
            readDecimal(valuesByKey, KEY_POINTS_RESPONSIBILITY, DEFAULT_POINTS_RESPONSIBILITY)
        );
    }

    private void saveSetting(String key, BigDecimal value) {
        AdministrationSetting setting = administrationSettingRepository.findById(key).orElseGet(AdministrationSetting::new);
        setting.setSettingKey(key);
        setting.setSettingValue(scaled(value).toPlainString());
        administrationSettingRepository.save(setting);
    }

    private BigDecimal readDecimal(Map<String, String> valuesByKey, String key, BigDecimal fallback) {
        String raw = valuesByKey.get(key);
        if (!StringUtils.hasText(raw)) {
            return fallback;
        }

        try {
            return scaled(new BigDecimal(raw.trim()));
        } catch (NumberFormatException exception) {
            return fallback;
        }
    }

    private BigDecimal readDecimalWithFallback(
        Map<String, String> valuesByKey,
        String key,
        String fallbackKey,
        BigDecimal fallbackValue
    ) {
        String raw = valuesByKey.get(key);
        if (!StringUtils.hasText(raw)) {
            raw = valuesByKey.get(fallbackKey);
        }
        if (!StringUtils.hasText(raw)) {
            return fallbackValue;
        }

        try {
            return scaled(new BigDecimal(raw.trim()));
        } catch (NumberFormatException exception) {
            return fallbackValue;
        }
    }

    private boolean canAccessAbsenceRequest(User currentUser, AvailabilityRequestActivity request) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION) {
            return true;
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            Long currentDepartmentId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            Long requestDepartmentId = resolveAbsenceDepartmentId(request);
            return currentDepartmentId != null && Objects.equals(currentDepartmentId, requestDepartmentId);
        }

        if (currentUser.getRole() == RoleType.ENSEIGNANT) {
            return request.getUser() != null && Objects.equals(currentUser.getId(), request.getUser().getId());
        }

        return false;
    }

    private Long resolveAbsenceDepartmentId(AvailabilityRequestActivity request) {
        if (request.getDepartment() != null) {
            return request.getDepartment().getId();
        }

        if (request.getUser() != null && request.getUser().getDepartment() != null) {
            return request.getUser().getDepartment().getId();
        }

        return null;
    }

    private boolean isValidatedActivity(ActivityStatus status) {
        return status == ActivityStatus.VALIDEE_DEPARTEMENT || status == ActivityStatus.VALIDEE_FINALE;
    }

    private int calculateAbsenceDays(AvailabilityRequestActivity activity) {
        if (activity.getStartDate() == null || activity.getEndDate() == null) {
            return 0;
        }

        long days = ChronoUnit.DAYS.between(activity.getStartDate(), activity.getEndDate()) + 1;
        if (days < 0) {
            return 0;
        }
        if (days > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }
        return (int) days;
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
    }

    private void requireAdministration(User currentUser) {
        if (currentUser.getRole() != RoleType.ADMINISTRATION) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces reserve a l'administration.");
        }
    }

    private void requireAdministrationOrDepartmentHead(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces reserve a l'administration et au chef de departement.");
    }

    private String resolvePeriodLabel(String requestedPeriodLabel) {
        if (StringUtils.hasText(requestedPeriodLabel)) {
            return requestedPeriodLabel.trim();
        }

        LocalDate now = LocalDate.now();
        int year = now.getYear();
        if (now.getMonthValue() >= 8) {
            return year + "-" + (year + 1);
        }

        return (year - 1) + "-" + year;
    }

    private String displayName(User user) {
        if (user == null) {
            return "Utilisateur inconnu";
        }
        String firstName = safeTrim(user.getFirstName());
        String lastName = safeTrim(user.getLastName());
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? "Utilisateur inconnu" : fullName;
    }

    private String safeTrim(String value) {
        return value == null ? null : value.trim();
    }

    private BigDecimal scaled(BigDecimal value) {
        if (value == null) {
            return zero();
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal scaledWeight(BigDecimal value) {
        if (value == null) {
            return zeroWeight();
        }
        return value.setScale(6, RoundingMode.HALF_UP);
    }

    private BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal zeroWeight() {
        return BigDecimal.ZERO.setScale(6, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateWeight(BigDecimal totalPoints, BigDecimal referencePoints) {
        BigDecimal resolvedReferencePoints = nullSafe(referencePoints);
        if (resolvedReferencePoints.signum() <= 0) {
            return zeroWeight();
        }

        BigDecimal resolvedTotalPoints = nullSafe(totalPoints);
        if (resolvedTotalPoints.compareTo(resolvedReferencePoints) <= 0) {
            return zeroWeight();
        }

        return scaledWeight(
            resolvedTotalPoints.subtract(resolvedReferencePoints)
                .divide(resolvedReferencePoints, 8, RoundingMode.HALF_UP)
        );
    }

    private BigDecimal calculatePrimeAmount(BigDecimal weight, BigDecimal totalWeight, BigDecimal totalPrimeAmount) {
        BigDecimal resolvedTotalWeight = scaledWeight(totalWeight);
        if (resolvedTotalWeight.signum() == 0) {
            return zero();
        }

        BigDecimal resolvedWeight = scaledWeight(weight);
        BigDecimal resolvedTotalPrimeAmount = scaled(totalPrimeAmount);
        return scaled(
            resolvedTotalPrimeAmount.multiply(resolvedWeight)
                .divide(resolvedTotalWeight, 8, RoundingMode.HALF_UP)
        );
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private record AdminConfig(
        BigDecimal referencePoints,
        BigDecimal totalPrimeAmount,
        BigDecimal bonusAbsencePenaltyPerDay,
        BigDecimal promotionTeachingPointFactor,
        BigDecimal teachingActivityPoint,
        BigDecimal supervisionActivityPoint,
        BigDecimal researchActivityPoint,
        BigDecimal eventActivityPoint,
        BigDecimal examSurveillanceActivityPoint,
        BigDecimal responsibilityActivityPoint
    ) {
    }

    private record TeacherComputation(
        long validatedActivities,
        BigDecimal validatedTeachingPoints,
        int absenceDays,
        BigDecimal activityTypePoints,
        BigDecimal calculatedWeight,
        BigDecimal calculatedPromotionPoints
    ) {
    }

    private static final class AbsenceAccumulator {

        private final User teacher;
        private long totalRequests;
        private int totalAbsenceDays;
        private int validatedAbsenceDays;
        private int pendingAbsenceDays;
        private int rejectedAbsenceDays;

        private AbsenceAccumulator(User teacher) {
            this.teacher = teacher;
        }

        private void addRequest(int days, ActivityStatus status) {
            totalRequests += 1;

            if (status == ActivityStatus.REJETEE) {
                rejectedAbsenceDays += days;
                return;
            }

            totalAbsenceDays += days;
            if (status == ActivityStatus.VALIDEE_DEPARTEMENT || status == ActivityStatus.VALIDEE_FINALE) {
                validatedAbsenceDays += days;
                return;
            }

            pendingAbsenceDays += days;
        }

        private AbsenceSummaryResponse toResponse(String periodLabel) {
            return new AbsenceSummaryResponse(
                teacher.getId(),
                (teacher.getFirstName() + " " + teacher.getLastName()).trim(),
                teacher.getDepartment() != null ? teacher.getDepartment().getName() : null,
                periodLabel,
                totalRequests,
                totalAbsenceDays,
                validatedAbsenceDays,
                pendingAbsenceDays,
                rejectedAbsenceDays
            );
        }
    }
}

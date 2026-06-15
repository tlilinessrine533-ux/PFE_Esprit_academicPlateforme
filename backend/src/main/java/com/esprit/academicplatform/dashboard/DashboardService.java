package com.esprit.academicplatform.dashboard;

import com.esprit.academicplatform.activity.Activity;
import com.esprit.academicplatform.activity.AvailabilityRequestActivity;
import com.esprit.academicplatform.activity.AvailabilityRequestActivityRepository;
import com.esprit.academicplatform.activity.EventActivity;
import com.esprit.academicplatform.activity.EventActivityRepository;
import com.esprit.academicplatform.activity.ExamSurveillanceActivity;
import com.esprit.academicplatform.activity.ExamSurveillanceActivityRepository;
import com.esprit.academicplatform.activity.ResearchActivity;
import com.esprit.academicplatform.activity.ResearchActivityRepository;
import com.esprit.academicplatform.activity.ResponsibilityActivity;
import com.esprit.academicplatform.activity.ResponsibilityActivityRepository;
import com.esprit.academicplatform.activity.SupervisionActivity;
import com.esprit.academicplatform.activity.SupervisionActivityRepository;
import com.esprit.academicplatform.activity.TeachingActivity;
import com.esprit.academicplatform.activity.TeachingActivityRepository;
import com.esprit.academicplatform.activity.TeachingPerformanceCalculator;
import com.esprit.academicplatform.administration.AdministrationService;
import com.esprit.academicplatform.administration.AdministrationSettingRepository;
import com.esprit.academicplatform.administration.dto.AdministrativeEvaluationResponse;
import com.esprit.academicplatform.auth.AuthSecurityState;
import com.esprit.academicplatform.auth.AuthSecurityStateRepository;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.StatutEncadrement;
import com.esprit.academicplatform.common.enums.SupervisionType;
import com.esprit.academicplatform.common.enums.TeacherType;
import com.esprit.academicplatform.dashboard.dto.AcademicYearPerformanceSnapshot;
import com.esprit.academicplatform.dashboard.dto.DashboardActivityBreakdownItem;
import com.esprit.academicplatform.dashboard.dto.DashboardDepartmentBenchmarkItem;
import com.esprit.academicplatform.dashboard.dto.DashboardMonthlyTrendPoint;
import com.esprit.academicplatform.dashboard.dto.DashboardTeacherBenchmarkItem;
import com.esprit.academicplatform.dashboard.dto.DepartmentDashboardResponse;
import com.esprit.academicplatform.dashboard.dto.GlobalDashboardResponse;
import com.esprit.academicplatform.dashboard.dto.PersonalDashboardResponse;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.department.DepartmentRepository;
import com.esprit.academicplatform.reporting.Report;
import com.esprit.academicplatform.reporting.ReportRepository;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);
    private static final DateTimeFormatter MONTH_LABEL_FORMATTER = DateTimeFormatter.ofPattern("MM/yyyy", Locale.ROOT);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TeachingActivityRepository teachingActivityRepository;
    private final TeachingPerformanceCalculator teachingPerformanceCalculator;
    private final SupervisionActivityRepository supervisionActivityRepository;
    private final ResearchActivityRepository researchActivityRepository;
    private final EventActivityRepository eventActivityRepository;
    private final ExamSurveillanceActivityRepository examSurveillanceActivityRepository;
    private final ResponsibilityActivityRepository responsibilityActivityRepository;
    private final AvailabilityRequestActivityRepository availabilityRequestActivityRepository;
    private final AdministrationSettingRepository administrationSettingRepository;
    private final AdministrationService administrationService;
    private final AuthSecurityStateRepository authSecurityStateRepository;
    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public PersonalDashboardResponse getPersonalDashboard(String currentUserEmail, String periodLabel) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (currentUser.getRole() != RoleType.ENSEIGNANT
            && currentUser.getRole() != RoleType.CHEF_DEPARTEMENT
            && currentUser.getRole() != RoleType.ADMINISTRATION
            && currentUser.getRole() != RoleType.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces reserve au tableau de bord personnel");
        }

        String resolvedPeriodLabel = resolvePeriodLabel(periodLabel);

        List<TeachingActivity> teachings = safeList(
            () -> getTeachingsForUser(currentUser.getId(), resolvedPeriodLabel),
            "teachings-for-user"
        );
        List<SupervisionActivity> supervisions = safeList(
            () -> getSupervisionsForUser(currentUser.getId(), resolvedPeriodLabel),
            "supervisions-for-user"
        );
        List<ResearchActivity> researches = safeList(
            () -> getResearchesForUser(currentUser.getId(), resolvedPeriodLabel),
            "researches-for-user"
        );
        List<EventActivity> events = safeList(
            () -> getEventsForUser(currentUser.getId(), resolvedPeriodLabel),
            "events-for-user"
        );
        List<ExamSurveillanceActivity> surveillances = safeList(
            () -> getExamSurveillancesForUser(currentUser.getId(), resolvedPeriodLabel),
            "exam-surveillances-for-user"
        );
        List<ResponsibilityActivity> responsibilities = safeList(
            () -> getResponsibilitiesForUser(currentUser.getId(), resolvedPeriodLabel),
            "responsibilities-for-user"
        );
        List<AvailabilityRequestActivity> availabilityRequests = safeList(
            () -> getAvailabilityRequestsForUser(currentUser.getId(), resolvedPeriodLabel),
            "availability-requests-for-user"
        );
        List<Report> reports = safeList(
            () -> reportRepository.findByGeneratedByIdOrTargetUserIdOrderByGeneratedAtDesc(currentUser.getId(), currentUser.getId())
                .stream()
                .filter(report -> matchesPeriod(report.getPeriodLabel(), resolvedPeriodLabel))
                .toList(),
            "reports-for-user"
        );

        BigDecimal totalPlannedHours = teachings.stream()
            .map(item -> nullSafe(item.getPlannedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCompletedHours = teachings.stream()
            .map(item -> nullSafe(item.getCompletedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTeachingPerformancePoints = teachings.stream()
            .map(this::calculateApprovedPointsSafely)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        TeacherPointsComparisonStats teacherPointsComparison = safeTeacherPointsComparison(resolvedPeriodLabel);
        TeacherPointsComparisonStats departmentTeacherPointsComparison = safeDepartmentTeacherPointsComparison(
            currentUser,
            resolvedPeriodLabel
        );

        long totalSubmittedActivities = countActivitiesWithStatus(
            ActivityStatus.SOUMISE,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalValidatedActivities = countValidatedActivities(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalRejectedActivities = countActivitiesWithStatus(
            ActivityStatus.REJETEE,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );

        long totalPartnershipActivities = countPartnershipActivities(teachings);

        long academicSupervisionsCount = supervisions.stream()
            .filter(this::isAcademicSupervision)
            .count();
        long jurySupervisionsCount = supervisions.stream()
            .filter(this::isJurySupervision)
            .count();
        long supervisionBalanceGap = Math.abs(academicSupervisionsCount - jurySupervisionsCount);

        SemesterCounts taughtGroups = calculateTaughtGroupsBySemester(teachings);
        SemesterCounts surveillanceCounts = calculateSurveillancesBySemester(surveillances);
        long surveillanceBalanceGap = Math.abs(taughtGroups.s1Count() - surveillanceCounts.s1Count())
            + Math.abs(taughtGroups.s2Count() - surveillanceCounts.s2Count());

        List<TeachingActivity> facultyTeachings = safeList(
            () -> getTeachings(resolvedPeriodLabel),
            "teachings-for-faculty-period"
        );
        List<SupervisionActivity> facultySupervisions = safeList(
            () -> getSupervisions(resolvedPeriodLabel),
            "supervisions-for-faculty-period"
        );
        List<ResearchActivity> facultyResearches = safeList(
            () -> getResearches(resolvedPeriodLabel),
            "researches-for-faculty-period"
        );
        List<EventActivity> facultyEvents = safeList(
            () -> getEvents(resolvedPeriodLabel),
            "events-for-faculty-period"
        );
        List<ExamSurveillanceActivity> facultySurveillances = safeList(
            () -> getExamSurveillances(resolvedPeriodLabel),
            "surveillances-for-faculty-period"
        );
        List<ResponsibilityActivity> facultyResponsibilities = safeList(
            () -> getResponsibilities(resolvedPeriodLabel),
            "responsibilities-for-faculty-period"
        );

        long teachingActivitiesPermanentTeachers = facultyTeachings.stream()
            .filter(this::isCourseDeclaration)
            .filter(activity -> resolveTeacherType(resolveActivityUser(activity)) == TeacherType.PERMANENT)
            .count();
        long teachingActivitiesVacataireTeachers = facultyTeachings.stream()
            .filter(this::isCourseDeclaration)
            .filter(activity -> resolveTeacherType(resolveActivityUser(activity)) == TeacherType.VACATAIRE)
            .count();

        Set<Long> colleagueTeacherIds = getColleagueTeacherIds(currentUser);
        int colleagueTeacherCount = colleagueTeacherIds.size();

        long colleagueSupervisionsCount = averageByColleagueCount(
            countActivitiesByTeacherIds(facultySupervisions, colleagueTeacherIds),
            colleagueTeacherCount
        );
        long colleagueResearchActivitiesCount = averageByColleagueCount(
            countActivitiesByTeacherIds(facultyResearches, colleagueTeacherIds),
            colleagueTeacherCount
        );
        long colleagueEventActivitiesCount = averageByColleagueCount(
            countActivitiesByTeacherIds(facultyEvents, colleagueTeacherIds),
            colleagueTeacherCount
        );
        long colleagueExamSurveillanceActivitiesCount = averageByColleagueCount(
            countActivitiesByTeacherIds(facultySurveillances, colleagueTeacherIds),
            colleagueTeacherCount
        );
        long colleagueResponsibilityActivitiesCount = averageByColleagueCount(
            countActivitiesByTeacherIds(facultyResponsibilities, colleagueTeacherIds),
            colleagueTeacherCount
        );
        long colleaguePartnershipActivitiesCount = averageByColleagueCount(
            countPartnershipActivitiesByTeacherIds(facultyTeachings, colleagueTeacherIds),
            colleagueTeacherCount
        );

        List<AcademicYearPerformanceSnapshot> yearlyPerformance = buildYearlyPerformanceHistory(
            currentUser.getId(),
            resolvedPeriodLabel
        );

        GeneralScoreRange historicalGeneralScoreRange = calculateGeneralScoreRange(yearlyPerformance);
        BigDecimal currentGeneralScore = yearlyPerformance.stream()
            .filter(item -> resolvedPeriodLabel.equals(item.periodLabel()))
            .findFirst()
            .map(AcademicYearPerformanceSnapshot::generalScore)
            .orElseGet(this::zero);

        List<String> availableAcademicYears = yearlyPerformance.stream()
            .map(AcademicYearPerformanceSnapshot::periodLabel)
            .toList();

        long totalDeclaredActivities = totalSubmittedActivities + totalValidatedActivities + totalRejectedActivities;
        BigDecimal validationRatePercent = percentage(totalValidatedActivities, totalDeclaredActivities);
        Map<Long, Integer> validatedAbsenceDaysByTeacher = buildValidatedAbsenceDaysByTeacher(resolvedPeriodLabel);
        List<AdministrativeEvaluationResponse> evaluations = safeList(
            () -> administrationService.computeEvaluationsForPeriod(resolvedPeriodLabel),
            "administrative-evaluations-for-dashboard"
        );
        Map<Long, AdministrativeEvaluationResponse> evaluationByTeacherId = evaluations.stream()
            .filter(item -> item != null && item.teacherId() != null)
            .collect(Collectors.toMap(AdministrativeEvaluationResponse::teacherId, item -> item, (left, right) -> right));
        AdministrativeEvaluationResponse personalEvaluation = evaluationByTeacherId.get(currentUser.getId());

        int absenceDays = personalEvaluation != null
            ? Math.max(0, personalEvaluation.absenceDays())
            : validatedAbsenceDaysByTeacher.getOrDefault(currentUser.getId(), 0);
        BigDecimal totalAccumulatedPoints = personalEvaluation != null
            ? scaled(personalEvaluation.calculatedPromotionPoints())
            : scaled(totalTeachingPerformancePoints);
        BigDecimal estimatedBonus = personalEvaluation != null
            ? scaled(personalEvaluation.calculatedBonus())
            : zero();
        DepartmentRanking departmentRanking = calculateDepartmentRankingPosition(
            currentUser,
            resolvedPeriodLabel,
            totalTeachingPerformancePoints
        );

        return new PersonalDashboardResponse(
            resolvedPeriodLabel,
            currentUser.getId(),
            currentUser.getFirstName() + " " + currentUser.getLastName(),
            currentUser.getDepartment() != null ? currentUser.getDepartment().getName() : null,
            teachings.size(),
            totalPlannedHours,
            totalCompletedHours,
            totalCompletedHours.subtract(totalPlannedHours),
            totalTeachingPerformancePoints,
            teacherPointsComparison.maxPoints(),
            teacherPointsComparison.averagePoints(),
            teacherPointsComparison.minPoints(),
            teacherPointsComparison.teacherCount(),
            departmentTeacherPointsComparison.maxPoints(),
            departmentTeacherPointsComparison.averagePoints(),
            departmentTeacherPointsComparison.minPoints(),
            departmentTeacherPointsComparison.teacherCount(),
            supervisions.size(),
            supervisions.stream().filter(item -> item != null && isPfeSupervisionType(item.getSupervisionType())).count(),
            supervisions.stream().filter(item -> item != null && item.getSupervisionStatus() == StatutEncadrement.SOUTENU).count(),
            researches.size(),
            researches.stream().filter(item ->
                item != null
                    && (item.getPublicationType() == PublicationType.ARTICLE
                    || item.getPublicationType() == PublicationType.PUBLICATION_ARTICLE
                )
            ).count(),
            researches.stream().filter(item -> item != null && StringUtils.hasText(item.getIndexingName())).count(),
            totalSubmittedActivities,
            totalValidatedActivities,
            totalRejectedActivities,
            totalDeclaredActivities,
            validationRatePercent,
            totalAccumulatedPoints,
            estimatedBonus,
            absenceDays,
            departmentRanking.position(),
            departmentRanking.population(),
            reports.size(),
            events.size(),
            surveillances.size(),
            responsibilities.size(),
            totalPartnershipActivities,
            teachingActivitiesPermanentTeachers,
            teachingActivitiesVacataireTeachers,
            academicSupervisionsCount,
            jurySupervisionsCount,
            supervisionBalanceGap,
            colleagueSupervisionsCount,
            colleagueResearchActivitiesCount,
            colleagueEventActivitiesCount,
            colleagueExamSurveillanceActivitiesCount,
            colleagueResponsibilityActivitiesCount,
            colleaguePartnershipActivitiesCount,
            taughtGroups.s1Count(),
            taughtGroups.s2Count(),
            surveillanceCounts.s1Count(),
            surveillanceCounts.s2Count(),
            surveillanceBalanceGap,
            currentGeneralScore,
            historicalGeneralScoreRange.max(),
            historicalGeneralScoreRange.average(),
            historicalGeneralScoreRange.min(),
            availableAcademicYears,
            yearlyPerformance
        );
    }

    @Transactional(readOnly = true)
    public DepartmentDashboardResponse getDepartmentDashboard(String currentUserEmail, String periodLabel, Long departmentId) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (currentUser.getRole() != RoleType.CHEF_DEPARTEMENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces reserve au tableau de bord departemental");
        }

        String resolvedPeriodLabel = resolvePeriodLabel(periodLabel);
        Department department = resolveDepartmentForDashboard(currentUser, departmentId);
        Long resolvedDepartmentId = department.getId();

        List<User> departmentUsers = userRepository.findAll()
            .stream()
            .filter(user -> user.getDepartment() != null && resolvedDepartmentId.equals(user.getDepartment().getId()))
            .toList();

        List<TeachingActivity> teachings = safeList(
            () -> getTeachingsForDepartment(resolvedDepartmentId, resolvedPeriodLabel),
            "teachings-for-department"
        );
        List<SupervisionActivity> supervisions = safeList(
            () -> getSupervisionsForDepartment(resolvedDepartmentId, resolvedPeriodLabel),
            "supervisions-for-department"
        );
        List<ResearchActivity> researches = safeList(
            () -> getResearchesForDepartment(resolvedDepartmentId, resolvedPeriodLabel),
            "researches-for-department"
        );
        List<EventActivity> events = safeList(
            () -> getEventsForDepartment(resolvedDepartmentId, resolvedPeriodLabel),
            "events-for-department"
        );
        List<ExamSurveillanceActivity> surveillances = safeList(
            () -> getExamSurveillancesForDepartment(resolvedDepartmentId, resolvedPeriodLabel),
            "surveillances-for-department"
        );
        List<ResponsibilityActivity> responsibilities = safeList(
            () -> getResponsibilitiesForDepartment(resolvedDepartmentId, resolvedPeriodLabel),
            "responsibilities-for-department"
        );
        List<Report> reports = safeList(
            () -> reportRepository.findAllByOrderByGeneratedAtDesc()
                .stream()
                .filter(report -> matchesPeriod(report.getPeriodLabel(), resolvedPeriodLabel))
                .filter(report -> report.getTargetUser() != null
                    && report.getTargetUser().getDepartment() != null
                    && resolvedDepartmentId.equals(report.getTargetUser().getDepartment().getId()))
                .toList(),
            "reports-for-department"
        );

        BigDecimal totalCompletedHours = teachings.stream()
            .map(item -> nullSafe(item.getCompletedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTeachingPerformancePoints = teachings.stream()
            .map(this::calculateApprovedPointsSafely)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalEventActivities = events.size();
        long totalExamSurveillanceActivities = surveillances.size();
        long totalResponsibilityActivities = responsibilities.size();
        long totalPartnershipActivities = countPartnershipActivities(teachings);
        long totalActivities = teachings.size()
            + supervisions.size()
            + researches.size()
            + events.size()
            + surveillances.size()
            + responsibilities.size();
        long totalSubmittedActivities = countActivitiesWithStatus(
            ActivityStatus.SOUMISE,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalValidatedActivities = countValidatedActivities(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalRejectedActivities = countActivitiesWithStatus(
            ActivityStatus.REJETEE,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        List<DashboardActivityBreakdownItem> activityBreakdown = buildActivityBreakdown(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities,
            totalPartnershipActivities
        );
        List<DashboardMonthlyTrendPoint> monthlyTrend = buildMonthlyTrend(
            resolvedPeriodLabel,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        Map<Long, AdministrativeEvaluationResponse> evaluationByTeacherId = safeList(
            () -> administrationService.computeEvaluationsForPeriod(resolvedPeriodLabel),
            "administrative-evaluations-for-department-dashboard"
        ).stream()
            .filter(item -> item != null && item.teacherId() != null)
            .collect(Collectors.toMap(AdministrativeEvaluationResponse::teacherId, item -> item, (left, right) -> right));
        List<DashboardTeacherBenchmarkItem> teacherBenchmark = buildTeacherBenchmark(
            resolvedDepartmentId,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities,
            evaluationByTeacherId
        );
        long totalPendingActivities = countPendingActivities(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalDeclaredActivities = totalSubmittedActivities + totalValidatedActivities + totalRejectedActivities;
        BigDecimal validationRatePercent = percentage(totalValidatedActivities, totalDeclaredActivities);
        BigDecimal averageValidationDelayDays = averageValidationDelayDays(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalTeachers = departmentUsers.stream().filter(user -> user.getRole() == RoleType.ENSEIGNANT).count();
        BigDecimal totalBonusPoints = teacherBenchmark.stream()
            .map(DashboardTeacherBenchmarkItem::totalPromotionPoints)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal averagePointsPerTeacher = totalTeachers <= 0
            ? zero()
            : scaled(totalBonusPoints.divide(BigDecimal.valueOf(totalTeachers), 2, RoundingMode.HALF_UP));
        BigDecimal bestTeacherScore = teacherBenchmark.stream()
            .map(DashboardTeacherBenchmarkItem::totalTeachingPerformancePoints)
            .reduce(BigDecimal.ZERO, BigDecimal::max);
        Map<Long, Integer> validatedAbsenceDaysByTeacher = buildValidatedAbsenceDaysByTeacher(resolvedPeriodLabel);
        BigDecimal averageAbsenceDays = totalTeachers <= 0
            ? zero()
            : scaled(
                BigDecimal.valueOf(
                    departmentUsers.stream()
                        .filter(user -> user.getRole() == RoleType.ENSEIGNANT)
                        .mapToInt(user -> validatedAbsenceDaysByTeacher.getOrDefault(user.getId(), 0))
                        .sum()
                ).divide(BigDecimal.valueOf(totalTeachers), 2, RoundingMode.HALF_UP)
            );
        BigDecimal departmentActivityRate = totalTeachers <= 0
            ? zero()
            : scaled(BigDecimal.valueOf(totalActivities).divide(BigDecimal.valueOf(totalTeachers), 2, RoundingMode.HALF_UP));

        return new DepartmentDashboardResponse(
            resolvedPeriodLabel,
            department.getId(),
            department.getName(),
            departmentUsers.size(),
            totalTeachers,
            teachings.size(),
            totalCompletedHours,
            totalTeachingPerformancePoints,
            supervisions.size(),
            supervisions.stream().filter(item -> item != null && isPfeSupervisionType(item.getSupervisionType())).count(),
            researches.size(),
            totalEventActivities,
            totalExamSurveillanceActivities,
            totalResponsibilityActivities,
            totalPartnershipActivities,
            totalActivities,
            totalSubmittedActivities,
            totalValidatedActivities,
            totalRejectedActivities,
            totalPendingActivities,
            validationRatePercent,
            averageValidationDelayDays,
            averagePointsPerTeacher,
            bestTeacherScore,
            averageAbsenceDays,
            departmentActivityRate,
            reports.size(),
            activityBreakdown,
            monthlyTrend,
            teacherBenchmark
        );
    }

    @Transactional(readOnly = true)
    public GlobalDashboardResponse getGlobalDashboard(String currentUserEmail, String periodLabel) {
        User currentUser = findCurrentUser(currentUserEmail);

        if (currentUser.getRole() != RoleType.ADMINISTRATION && currentUser.getRole() != RoleType.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces reserve au tableau de bord global");
        }

        String resolvedPeriodLabel = resolvePeriodLabel(periodLabel);

        List<User> users = userRepository.findAll();
        List<TeachingActivity> teachings = safeList(
            () -> getTeachings(resolvedPeriodLabel),
            "teachings-global"
        );
        List<SupervisionActivity> supervisions = safeList(
            () -> getSupervisions(resolvedPeriodLabel),
            "supervisions-global"
        );
        List<ResearchActivity> researches = safeList(
            () -> getResearches(resolvedPeriodLabel),
            "researches-global"
        );
        List<EventActivity> events = safeList(
            () -> getEvents(resolvedPeriodLabel),
            "events-global"
        );
        List<ExamSurveillanceActivity> surveillances = safeList(
            () -> getExamSurveillances(resolvedPeriodLabel),
            "surveillances-global"
        );
        List<ResponsibilityActivity> responsibilities = safeList(
            () -> getResponsibilities(resolvedPeriodLabel),
            "responsibilities-global"
        );
        List<Report> reports = safeList(
            () -> reportRepository.findAllByOrderByGeneratedAtDesc()
                .stream()
                .filter(report -> matchesPeriod(report.getPeriodLabel(), resolvedPeriodLabel))
                .toList(),
            "reports-global"
        );

        BigDecimal totalCompletedHours = teachings.stream()
            .map(item -> nullSafe(item.getCompletedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTeachingPerformancePoints = teachings.stream()
            .map(this::calculateApprovedPointsSafely)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalEventActivities = events.size();
        long totalExamSurveillanceActivities = surveillances.size();
        long totalResponsibilityActivities = responsibilities.size();
        long totalPartnershipActivities = countPartnershipActivities(teachings);
        long totalActivities = teachings.size()
            + supervisions.size()
            + researches.size()
            + events.size()
            + surveillances.size()
            + responsibilities.size();
        long totalSubmittedActivities = countActivitiesWithStatus(
            ActivityStatus.SOUMISE,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalValidatedActivities = countValidatedActivities(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalRejectedActivities = countActivitiesWithStatus(
            ActivityStatus.REJETEE,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        List<DashboardActivityBreakdownItem> activityBreakdown = buildActivityBreakdown(
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities,
            totalPartnershipActivities
        );
        List<DashboardMonthlyTrendPoint> monthlyTrend = buildMonthlyTrend(
            resolvedPeriodLabel,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        List<DashboardDepartmentBenchmarkItem> departmentBenchmark = buildDepartmentBenchmark(
            users,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities
        );
        long totalActiveUsers = users.stream().filter(User::isActive).count();
        long totalDisabledUsers = users.stream().filter(user -> !user.isActive()).count();
        long totalAdministrationUsers = users.stream().filter(user -> user.getRole() == RoleType.ADMINISTRATION).count();
        long totalDepartmentHeadUsers = users.stream().filter(user -> user.getRole() == RoleType.CHEF_DEPARTEMENT).count();
        long totalSuperAdminUsers = users.stream().filter(user -> user.getRole() == RoleType.SUPER_ADMIN).count();
        long totalRoles = users.stream().map(User::getRole).filter(Objects::nonNull).distinct().count();

        LocalDateTime now = LocalDateTime.now();
        List<AuthSecurityState> securityStates = safeList(authSecurityStateRepository::findAll, "auth-security-states");
        long usersWithFailures = securityStates.stream().filter(state -> state.getFailedLoginAttempts() > 0).count();
        BigDecimal errorRatePercent = percentage(usersWithFailures, users.isEmpty() ? 1 : users.size());
        long totalAdministrativeIncidents = securityStates.stream()
            .filter(state -> state.getFailedLoginAttempts() > 0 || state.isLoginLocked(now))
            .count();

        DashboardPeriodRange periodRange = dashboardPeriodRange(resolvedPeriodLabel);
        long totalConfigurationChanges = administrationSettingRepository.findAll().stream()
            .filter(setting -> isInsidePeriod(setting.getUpdatedAt(), periodRange))
            .count();

        long systemLogsCount = 0;
        boolean systemLogsCountPlaceholder = true;
        long totalLogins = 0;
        boolean totalLoginsPlaceholder = true;
        BigDecimal platformAvailabilityPercent = zero();
        boolean platformAvailabilityPlaceholder = true;
        boolean administrativeIncidentsDerived = true;

        return new GlobalDashboardResponse(
            resolvedPeriodLabel,
            departmentRepository.findAll().size(),
            users.size(),
            totalActiveUsers,
            totalDisabledUsers,
            totalAdministrationUsers,
            totalDepartmentHeadUsers,
            totalSuperAdminUsers,
            totalRoles,
            users.stream().filter(user -> user.getRole() == RoleType.ENSEIGNANT).count(),
            systemLogsCount,
            systemLogsCountPlaceholder,
            errorRatePercent,
            totalLogins,
            totalLoginsPlaceholder,
            totalConfigurationChanges,
            platformAvailabilityPercent,
            platformAvailabilityPlaceholder,
            totalAdministrativeIncidents,
            administrativeIncidentsDerived,
            teachings.size(),
            totalCompletedHours,
            totalTeachingPerformancePoints,
            supervisions.size(),
            supervisions.stream().filter(item -> item != null && isPfeSupervisionType(item.getSupervisionType())).count(),
            researches.size(),
            totalEventActivities,
            totalExamSurveillanceActivities,
            totalResponsibilityActivities,
            totalPartnershipActivities,
            totalActivities,
            totalSubmittedActivities,
            totalValidatedActivities,
            totalRejectedActivities,
            reports.size(),
            activityBreakdown,
            monthlyTrend,
            departmentBenchmark
        );
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
    }

    private Department resolveDepartmentForDashboard(User currentUser, Long departmentId) {
        if (currentUser.getRole() != RoleType.CHEF_DEPARTEMENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces reserve au tableau de bord departemental");
        }

        if (currentUser.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun departement associe a ce chef");
        }

        return currentUser.getDepartment();
    }

    private List<TeachingActivity> getTeachingsForUser(Long userId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? teachingActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(userId, periodLabel)
            : teachingActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<SupervisionActivity> getSupervisionsForUser(Long userId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? supervisionActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(userId, periodLabel)
            : supervisionActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<ResearchActivity> getResearchesForUser(Long userId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? researchActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(userId, periodLabel)
            : researchActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<EventActivity> getEventsForUser(Long userId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? eventActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(userId, periodLabel)
            : eventActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<ExamSurveillanceActivity> getExamSurveillancesForUser(Long userId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? examSurveillanceActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(userId, periodLabel)
            : examSurveillanceActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<ResponsibilityActivity> getResponsibilitiesForUser(Long userId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? responsibilityActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(userId, periodLabel)
            : responsibilityActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<AvailabilityRequestActivity> getAvailabilityRequestsForUser(Long userId, String periodLabel) {
        return availabilityRequestActivityRepository.findByUserIdAndRequestTypeOrderByCreatedAtDesc(
            userId,
            AvailabilityRequestType.CONGE
        ).stream()
            .filter(activity -> !StringUtils.hasText(periodLabel) || Objects.equals(activity.getAcademicYear(), periodLabel))
            .toList();
    }

    private List<TeachingActivity> getTeachingsForDepartment(Long departmentId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? teachingActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(departmentId, periodLabel)
            : teachingActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    private List<SupervisionActivity> getSupervisionsForDepartment(Long departmentId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? supervisionActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(departmentId, periodLabel)
            : supervisionActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    private List<ResearchActivity> getResearchesForDepartment(Long departmentId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? researchActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(departmentId, periodLabel)
            : researchActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    private List<EventActivity> getEventsForDepartment(Long departmentId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? eventActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(departmentId, periodLabel)
            : eventActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    private List<ExamSurveillanceActivity> getExamSurveillancesForDepartment(Long departmentId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? examSurveillanceActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(departmentId, periodLabel)
            : examSurveillanceActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    private List<ResponsibilityActivity> getResponsibilitiesForDepartment(Long departmentId, String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? responsibilityActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(departmentId, periodLabel)
            : responsibilityActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    private List<TeachingActivity> getTeachings(String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? teachingActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel)
            : teachingActivityRepository.findAllByOrderByCreatedAtDesc();
    }

    private List<SupervisionActivity> getSupervisions(String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? supervisionActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel)
            : supervisionActivityRepository.findAllByOrderByCreatedAtDesc();
    }

    private List<ResearchActivity> getResearches(String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? researchActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel)
            : researchActivityRepository.findAllByOrderByCreatedAtDesc();
    }

    private List<EventActivity> getEvents(String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? eventActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel)
            : eventActivityRepository.findAllByOrderByCreatedAtDesc();
    }

    private List<ExamSurveillanceActivity> getExamSurveillances(String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? examSurveillanceActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel)
            : examSurveillanceActivityRepository.findAllByOrderByCreatedAtDesc();
    }

    private List<ResponsibilityActivity> getResponsibilities(String periodLabel) {
        return StringUtils.hasText(periodLabel)
            ? responsibilityActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel)
            : responsibilityActivityRepository.findAllByOrderByCreatedAtDesc();
    }

    private boolean matchesPeriod(String reportPeriod, String requestedPeriod) {
        if (!StringUtils.hasText(requestedPeriod)) {
            return true;
        }
        return requestedPeriod.equals(reportPeriod);
    }

    private List<DashboardActivityBreakdownItem> buildActivityBreakdown(
        List<TeachingActivity> teachings,
        List<SupervisionActivity> supervisions,
        List<ResearchActivity> researches,
        List<EventActivity> events,
        List<ExamSurveillanceActivity> surveillances,
        List<ResponsibilityActivity> responsibilities,
        long totalPartnershipActivities
    ) {
        return List.of(
            new DashboardActivityBreakdownItem("TEACHING", "Enseignement", teachings.size()),
            new DashboardActivityBreakdownItem("SUPERVISION", "Encadrement", supervisions.size()),
            new DashboardActivityBreakdownItem("RESEARCH", "Recherche", researches.size()),
            new DashboardActivityBreakdownItem("EVENT", "Evenement", events.size()),
            new DashboardActivityBreakdownItem("SURVEILLANCE", "Surveillance", surveillances.size()),
            new DashboardActivityBreakdownItem("RESPONSIBILITY", "Responsabilite", responsibilities.size()),
            new DashboardActivityBreakdownItem("PARTNERSHIP", "Partenariat", totalPartnershipActivities)
        );
    }

    @SafeVarargs
    private final List<DashboardMonthlyTrendPoint> buildMonthlyTrend(
        String periodLabel,
        List<? extends Activity>... activityGroups
    ) {
        Map<YearMonth, WorkflowAccumulator> monthlyBuckets = new LinkedHashMap<>();
        for (YearMonth month : academicMonthsForPeriod(periodLabel)) {
            monthlyBuckets.put(month, new WorkflowAccumulator());
        }

        for (List<? extends Activity> activities : activityGroups) {
            for (Activity activity : activities) {
                if (activity == null || activity.getCreatedAt() == null) {
                    continue;
                }

                YearMonth monthKey = YearMonth.from(activity.getCreatedAt());
                monthlyBuckets.computeIfAbsent(monthKey, ignored -> new WorkflowAccumulator()).add(activity.getStatus());
            }
        }

        return monthlyBuckets.entrySet()
            .stream()
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> {
                WorkflowAccumulator bucket = entry.getValue();
                return new DashboardMonthlyTrendPoint(
                    entry.getKey().format(MONTH_LABEL_FORMATTER),
                    bucket.totalActivities,
                    bucket.submittedActivities,
                    bucket.validatedActivities,
                    bucket.rejectedActivities
                );
            })
            .toList();
    }

    private List<DashboardTeacherBenchmarkItem> buildTeacherBenchmark(
        Long departmentId,
        List<TeachingActivity> teachings,
        List<SupervisionActivity> supervisions,
        List<ResearchActivity> researches,
        List<EventActivity> events,
        List<ExamSurveillanceActivity> surveillances,
        List<ResponsibilityActivity> responsibilities,
        Map<Long, AdministrativeEvaluationResponse> evaluationByTeacherId
    ) {
        List<User> teachers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT))
            .stream()
            .filter(user -> isUserInDepartment(user, departmentId))
            .toList();

        return teachers.stream()
            .map(teacher -> {
                Long teacherId = teacher.getId();
                long teachingCount = countActivitiesByUserId(teachings, teacherId);
                long supervisionCount = countActivitiesByUserId(supervisions, teacherId);
                long researchCount = countActivitiesByUserId(researches, teacherId);
                long eventCount = countActivitiesByUserId(events, teacherId);
                long surveillanceCount = countActivitiesByUserId(surveillances, teacherId);
                long responsibilityCount = countActivitiesByUserId(responsibilities, teacherId);
                long partnershipCount = countPartnershipActivitiesByUserId(teachings, teacherId);
                long totalActivities = teachingCount + supervisionCount + researchCount + eventCount + surveillanceCount + responsibilityCount;

                long submitted = countActivitiesWithStatusByUserId(
                    ActivityStatus.SOUMISE,
                    teacherId,
                    teachings,
                    supervisions,
                    researches,
                    events,
                    surveillances,
                    responsibilities
                );
                long validated = countValidatedActivitiesByUserId(
                    teacherId,
                    teachings,
                    supervisions,
                    researches,
                    events,
                    surveillances,
                    responsibilities
                );
                long rejected = countActivitiesWithStatusByUserId(
                    ActivityStatus.REJETEE,
                    teacherId,
                    teachings,
                    supervisions,
                    researches,
                    events,
                    surveillances,
                    responsibilities
                );

                BigDecimal completedHours = sumCompletedHoursByUserId(teachings, teacherId);
                BigDecimal teachingPoints = sumApprovedPointsByUserId(teachings, teacherId);
                BigDecimal validationRatePercent = percentage(validated, submitted + validated + rejected);
                AdministrativeEvaluationResponse evaluation = evaluationByTeacherId.get(teacherId);
                BigDecimal promotionPoints = evaluation != null ? scaled(evaluation.calculatedPromotionPoints()) : zero();
                BigDecimal calculatedPrime = evaluation != null ? scaled(evaluation.calculatedBonus()) : zero();
                BigDecimal calculatedWeight = evaluation != null
                    ? scaledWeight(evaluation.calculatedWeight())
                    : zeroWeight();

                return new DashboardTeacherBenchmarkItem(
                    teacherId,
                    teacher.getFirstName() + " " + teacher.getLastName(),
                    totalActivities,
                    teachingCount,
                    supervisionCount,
                    researchCount,
                    eventCount,
                    surveillanceCount,
                    responsibilityCount,
                    partnershipCount,
                    submitted,
                    validated,
                    rejected,
                    completedHours,
                    teachingPoints,
                    validationRatePercent,
                    promotionPoints,
                    calculatedPrime,
                    calculatedWeight
                );
            })
            .sorted(Comparator
                .comparing(DashboardTeacherBenchmarkItem::validationRatePercent, Comparator.reverseOrder())
                .thenComparing(DashboardTeacherBenchmarkItem::totalActivities, Comparator.reverseOrder())
                .thenComparing(DashboardTeacherBenchmarkItem::totalTeachingPerformancePoints, Comparator.reverseOrder())
                .thenComparing(DashboardTeacherBenchmarkItem::teacherName, String.CASE_INSENSITIVE_ORDER))
            .toList();
    }

    private List<DashboardDepartmentBenchmarkItem> buildDepartmentBenchmark(
        List<User> users,
        List<TeachingActivity> teachings,
        List<SupervisionActivity> supervisions,
        List<ResearchActivity> researches,
        List<EventActivity> events,
        List<ExamSurveillanceActivity> surveillances,
        List<ResponsibilityActivity> responsibilities
    ) {
        return departmentRepository.findAll()
            .stream()
            .map(department -> {
                Long departmentId = department.getId();
                long teachingCount = countActivitiesByDepartmentId(teachings, departmentId);
                long supervisionCount = countActivitiesByDepartmentId(supervisions, departmentId);
                long researchCount = countActivitiesByDepartmentId(researches, departmentId);
                long eventCount = countActivitiesByDepartmentId(events, departmentId);
                long surveillanceCount = countActivitiesByDepartmentId(surveillances, departmentId);
                long responsibilityCount = countActivitiesByDepartmentId(responsibilities, departmentId);
                long totalActivities = teachingCount + supervisionCount + researchCount + eventCount + surveillanceCount + responsibilityCount;

                long submitted = countActivitiesWithStatusByDepartmentId(
                    ActivityStatus.SOUMISE,
                    departmentId,
                    teachings,
                    supervisions,
                    researches,
                    events,
                    surveillances,
                    responsibilities
                );
                long validated = countValidatedActivitiesByDepartmentId(
                    departmentId,
                    teachings,
                    supervisions,
                    researches,
                    events,
                    surveillances,
                    responsibilities
                );
                long rejected = countActivitiesWithStatusByDepartmentId(
                    ActivityStatus.REJETEE,
                    departmentId,
                    teachings,
                    supervisions,
                    researches,
                    events,
                    surveillances,
                    responsibilities
                );

                BigDecimal completedHours = sumCompletedHoursByDepartmentId(teachings, departmentId);
                BigDecimal teachingPoints = sumApprovedPointsByDepartmentId(teachings, departmentId);
                BigDecimal validationRatePercent = percentage(validated, submitted + validated + rejected);
                long totalTeachers = users.stream()
                    .filter(user -> user != null && user.isActive() && user.getRole() == RoleType.ENSEIGNANT)
                    .filter(user -> isUserInDepartment(user, departmentId))
                    .count();

                return new DashboardDepartmentBenchmarkItem(
                    departmentId,
                    department.getName(),
                    totalTeachers,
                    totalActivities,
                    submitted,
                    validated,
                    rejected,
                    completedHours,
                    teachingPoints,
                    validationRatePercent
                );
            })
            .sorted(Comparator
                .comparing(DashboardDepartmentBenchmarkItem::validationRatePercent, Comparator.reverseOrder())
                .thenComparing(DashboardDepartmentBenchmarkItem::totalActivities, Comparator.reverseOrder())
                .thenComparing(DashboardDepartmentBenchmarkItem::totalTeachingPerformancePoints, Comparator.reverseOrder())
                .thenComparing(DashboardDepartmentBenchmarkItem::departmentName, String.CASE_INSENSITIVE_ORDER))
            .toList();
    }

    @SafeVarargs
    private final long countActivitiesWithStatus(ActivityStatus status, List<? extends Activity>... activityGroups) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null && activity.getStatus() == status)
                .count();
        }
        return total;
    }

    @SafeVarargs
    private final long countValidatedActivities(List<? extends Activity>... activityGroups) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null && (activity.getStatus() == ActivityStatus.VALIDEE_DEPARTEMENT
                    || activity.getStatus() == ActivityStatus.VALIDEE_FINALE))
                .count();
        }
        return total;
    }

    @SafeVarargs
    private final long countPendingActivities(List<? extends Activity>... activityGroups) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null && isPendingStatus(activity.getStatus()))
                .count();
        }
        return total;
    }

    @SafeVarargs
    private final BigDecimal averageValidationDelayDays(List<? extends Activity>... activityGroups) {
        long totalValidatedOrRejected = 0;
        BigDecimal totalDays = BigDecimal.ZERO;
        for (List<? extends Activity> activities : activityGroups) {
            for (Activity activity : activities) {
                if (activity == null || !isFinalizedForDelay(activity.getStatus())) {
                    continue;
                }
                if (activity.getCreatedAt() == null || activity.getUpdatedAt() == null) {
                    continue;
                }

                long elapsedHours = ChronoUnit.HOURS.between(activity.getCreatedAt(), activity.getUpdatedAt());
                if (elapsedHours < 0) {
                    continue;
                }

                BigDecimal elapsedDays = BigDecimal.valueOf(elapsedHours)
                    .divide(BigDecimal.valueOf(24), 4, RoundingMode.HALF_UP);
                totalDays = totalDays.add(elapsedDays);
                totalValidatedOrRejected += 1;
            }
        }

        if (totalValidatedOrRejected <= 0) {
            return zero();
        }

        return scaled(totalDays.divide(BigDecimal.valueOf(totalValidatedOrRejected), 2, RoundingMode.HALF_UP));
    }

    private boolean isPfeSupervisionType(SupervisionType supervisionType) {
        if (supervisionType == null) {
            return false;
        }

        return supervisionType.name().startsWith("PFE");
    }

    private boolean isValidatedStatus(ActivityStatus status) {
        return status == ActivityStatus.VALIDEE_DEPARTEMENT || status == ActivityStatus.VALIDEE_FINALE;
    }

    private boolean isPendingStatus(ActivityStatus status) {
        return status == ActivityStatus.SOUMISE || status == ActivityStatus.A_CORRIGER;
    }

    private boolean isFinalizedForDelay(ActivityStatus status) {
        return isValidatedStatus(status) || status == ActivityStatus.REJETEE;
    }

    private SupervisionType normalizeSupervisionType(SupervisionType supervisionType) {
        if (supervisionType == null) {
            return SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
        }

        return switch (supervisionType) {
            case PFE, THESE -> SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
            case MEMOIRE, STAGE -> SupervisionType.PI;
            default -> supervisionType;
        };
    }

    private boolean isAcademicSupervision(SupervisionActivity activity) {
        if (activity == null) {
            return false;
        }

        return normalizeSupervisionType(activity.getSupervisionType()) == SupervisionType.PFE_ENCADREMENT_ACADEMIQUE;
    }

    private boolean isJurySupervision(SupervisionActivity activity) {
        if (activity == null) {
            return false;
        }

        SupervisionType type = normalizeSupervisionType(activity.getSupervisionType());
        return type == SupervisionType.PFE_RAPPORTEUR || type == SupervisionType.PFE_PRESIDENT_JURY;
    }

    private boolean isCourseDeclaration(TeachingActivity activity) {
        return activity != null && activity.getPartnershipDeclarationType() == null;
    }

    private long countPartnershipActivities(List<TeachingActivity> teachings) {
        return teachings.stream()
            .filter(activity -> activity != null && activity.getPartnershipDeclarationType() != null)
            .count();
    }

    private DepartmentRanking calculateDepartmentRankingPosition(User currentUser, String periodLabel, BigDecimal currentPoints) {
        if (currentUser == null || currentUser.getDepartment() == null || currentUser.getDepartment().getId() == null) {
            return new DepartmentRanking(0, 0);
        }

        Long departmentId = currentUser.getDepartment().getId();
        List<User> teachers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT, RoleType.CHEF_DEPARTEMENT))
            .stream()
            .filter(user -> user.getDepartment() != null && Objects.equals(user.getDepartment().getId(), departmentId))
            .toList();
        if (teachers.isEmpty()) {
            return new DepartmentRanking(0, 0);
        }

        List<TeachingActivity> departmentTeachings = safeList(
            () -> getTeachingsForDepartment(departmentId, periodLabel),
            "rank-department-teachings"
        );

        Map<Long, BigDecimal> pointsByTeacher = new LinkedHashMap<>();
        for (User teacher : teachers) {
            pointsByTeacher.put(teacher.getId(), zero());
        }

        for (TeachingActivity activity : departmentTeachings) {
            if (activity == null) {
                continue;
            }
            Long teacherId = resolveActivityUserId(activity);
            if (teacherId == null || !pointsByTeacher.containsKey(teacherId)) {
                continue;
            }
            pointsByTeacher.computeIfPresent(
                teacherId,
                (ignored, value) -> value.add(calculateApprovedPointsSafely(activity))
            );
        }

        List<Map.Entry<Long, BigDecimal>> ranking = pointsByTeacher.entrySet().stream()
            .sorted(Map.Entry.<Long, BigDecimal>comparingByValue(Comparator.reverseOrder()))
            .toList();

        long rank = 0;
        for (int index = 0; index < ranking.size(); index++) {
            if (Objects.equals(ranking.get(index).getKey(), currentUser.getId())) {
                rank = index + 1L;
                break;
            }
        }

        if (rank == 0 && currentPoints != null) {
            long ahead = ranking.stream()
                .filter(entry -> entry.getValue().compareTo(currentPoints) > 0)
                .count();
            rank = ahead + 1;
        }

        return new DepartmentRanking(rank, ranking.size());
    }

    private Map<Long, Integer> buildValidatedAbsenceDaysByTeacher(String periodLabel) {
        Map<Long, Integer> totals = new LinkedHashMap<>();
        List<AvailabilityRequestActivity> requests = safeList(
            availabilityRequestActivityRepository::findAllByOrderByCreatedAtDesc,
            "availability-requests-for-absences"
        );

        for (AvailabilityRequestActivity request : requests) {
            if (request == null || request.getRequestType() != AvailabilityRequestType.CONGE) {
                continue;
            }
            if (!Objects.equals(request.getAcademicYear(), periodLabel)) {
                continue;
            }
            if (!isValidatedStatus(request.getStatus())) {
                continue;
            }
            Long teacherId = request.getUser() != null ? request.getUser().getId() : null;
            if (teacherId == null) {
                continue;
            }

            totals.merge(teacherId, calculateAbsenceDays(request), Integer::sum);
        }

        return totals;
    }

    private int calculateAbsenceDays(AvailabilityRequestActivity request) {
        if (request == null || request.getStartDate() == null || request.getEndDate() == null) {
            return 0;
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (days <= 0) {
            return 0;
        }
        if (days > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }
        return (int) days;
    }

    private DashboardPeriodRange dashboardPeriodRange(String periodLabel) {
        int startYear = periodSortKey(periodLabel);
        if (startYear == Integer.MIN_VALUE) {
            return new DashboardPeriodRange(null, null);
        }
        LocalDateTime start = LocalDate.of(startYear, 8, 1).atStartOfDay();
        LocalDateTime end = start.plusYears(1).minusNanos(1);
        return new DashboardPeriodRange(start, end);
    }

    private boolean isInsidePeriod(LocalDateTime value, DashboardPeriodRange range) {
        if (value == null || range == null || range.start() == null || range.end() == null) {
            return false;
        }
        return !value.isBefore(range.start()) && !value.isAfter(range.end());
    }

    private TeacherType resolveTeacherType(User user) {
        if (user == null) {
            return null;
        }
        try {
            return user.effectiveTeacherType();
        } catch (RuntimeException exception) {
            return null;
        }
    }

    private User resolveActivityUser(Activity activity) {
        if (activity == null) {
            return null;
        }

        try {
            return activity.getUser();
        } catch (RuntimeException exception) {
            return null;
        }
    }

    private Long resolveActivityUserId(Activity activity) {
        User user = resolveActivityUser(activity);
        return user != null ? user.getId() : null;
    }

    private Long resolveActivityDepartmentId(Activity activity) {
        User user = resolveActivityUser(activity);
        if (user == null || user.getDepartment() == null) {
            return null;
        }

        return user.getDepartment().getId();
    }

    private boolean isUserInDepartment(User user, Long departmentId) {
        return user != null
            && user.getDepartment() != null
            && Objects.equals(user.getDepartment().getId(), departmentId);
    }

    private boolean isActivityOwnedByUserId(Activity activity, Long userId) {
        return Objects.equals(resolveActivityUserId(activity), userId);
    }

    private boolean isActivityInDepartment(Activity activity, Long departmentId) {
        return Objects.equals(resolveActivityDepartmentId(activity), departmentId);
    }

    private List<YearMonth> academicMonthsForPeriod(String periodLabel) {
        int startYear = periodSortKey(periodLabel);
        if (startYear == Integer.MIN_VALUE) {
            return List.of();
        }

        YearMonth start = YearMonth.of(startYear, 8);
        List<YearMonth> months = new ArrayList<>(12);
        for (int index = 0; index < 12; index++) {
            months.add(start.plusMonths(index));
        }
        return months;
    }

    private long countActivitiesByUserId(List<? extends Activity> activities, Long userId) {
        return activities.stream()
            .filter(activity -> activity != null && isActivityOwnedByUserId(activity, userId))
            .count();
    }

    private long countActivitiesByDepartmentId(List<? extends Activity> activities, Long departmentId) {
        return activities.stream()
            .filter(activity -> activity != null && isActivityInDepartment(activity, departmentId))
            .count();
    }

    private long countPartnershipActivitiesByUserId(List<TeachingActivity> teachings, Long userId) {
        return teachings.stream()
            .filter(activity -> activity != null
                && activity.getPartnershipDeclarationType() != null
                && isActivityOwnedByUserId(activity, userId))
            .count();
    }

    @SafeVarargs
    private final long countActivitiesWithStatusByUserId(
        ActivityStatus status,
        Long userId,
        List<? extends Activity>... activityGroups
    ) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null
                    && isActivityOwnedByUserId(activity, userId)
                    && activity.getStatus() == status)
                .count();
        }
        return total;
    }

    @SafeVarargs
    private final long countValidatedActivitiesByUserId(
        Long userId,
        List<? extends Activity>... activityGroups
    ) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null
                    && isActivityOwnedByUserId(activity, userId)
                    && (activity.getStatus() == ActivityStatus.VALIDEE_DEPARTEMENT
                    || activity.getStatus() == ActivityStatus.VALIDEE_FINALE))
                .count();
        }
        return total;
    }

    @SafeVarargs
    private final long countActivitiesWithStatusByDepartmentId(
        ActivityStatus status,
        Long departmentId,
        List<? extends Activity>... activityGroups
    ) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null
                    && isActivityInDepartment(activity, departmentId)
                    && activity.getStatus() == status)
                .count();
        }
        return total;
    }

    @SafeVarargs
    private final long countValidatedActivitiesByDepartmentId(
        Long departmentId,
        List<? extends Activity>... activityGroups
    ) {
        long total = 0;
        for (List<? extends Activity> activities : activityGroups) {
            total += activities.stream()
                .filter(activity -> activity != null
                    && isActivityInDepartment(activity, departmentId)
                    && (activity.getStatus() == ActivityStatus.VALIDEE_DEPARTEMENT
                    || activity.getStatus() == ActivityStatus.VALIDEE_FINALE))
                .count();
        }
        return total;
    }

    private BigDecimal sumCompletedHoursByUserId(List<TeachingActivity> teachings, Long userId) {
        return teachings.stream()
            .filter(activity -> activity != null && isActivityOwnedByUserId(activity, userId))
            .map(activity -> nullSafe(activity.getCompletedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumCompletedHoursByDepartmentId(List<TeachingActivity> teachings, Long departmentId) {
        return teachings.stream()
            .filter(activity -> activity != null && isActivityInDepartment(activity, departmentId))
            .map(activity -> nullSafe(activity.getCompletedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumApprovedPointsByUserId(List<TeachingActivity> teachings, Long userId) {
        return teachings.stream()
            .filter(activity -> activity != null && isActivityOwnedByUserId(activity, userId))
            .map(this::calculateApprovedPointsSafely)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumApprovedPointsByDepartmentId(List<TeachingActivity> teachings, Long departmentId) {
        return teachings.stream()
            .filter(activity -> activity != null && isActivityInDepartment(activity, departmentId))
            .map(this::calculateApprovedPointsSafely)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal percentage(long numerator, long denominator) {
        if (denominator <= 0) {
            return zero();
        }

        return BigDecimal.valueOf(numerator)
            .multiply(BigDecimal.valueOf(100))
            .divide(BigDecimal.valueOf(denominator), 2, RoundingMode.HALF_UP);
    }

    private Set<Long> getColleagueTeacherIds(User currentUser) {
        if (currentUser == null) {
            return Set.of();
        }

        if (currentUser.getRole() != RoleType.ENSEIGNANT && currentUser.getRole() != RoleType.CHEF_DEPARTEMENT) {
            return Set.of();
        }

        if (currentUser.getDepartment() == null) {
            return Set.of();
        }

        Long departmentId = currentUser.getDepartment().getId();

        return userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT, RoleType.CHEF_DEPARTEMENT))
            .stream()
            .filter(user -> user.getDepartment() != null && Objects.equals(user.getDepartment().getId(), departmentId))
            .map(User::getId)
            .filter(id -> !Objects.equals(id, currentUser.getId()))
            .collect(Collectors.toSet());
    }

    private long countActivitiesByTeacherIds(List<? extends Activity> activities, Set<Long> teacherIds) {
        if (teacherIds == null || teacherIds.isEmpty()) {
            return 0;
        }

        return activities.stream()
            .map(this::resolveActivityUserId)
            .filter(Objects::nonNull)
            .filter(teacherIds::contains)
            .count();
    }

    private long countPartnershipActivitiesByTeacherIds(List<TeachingActivity> activities, Set<Long> teacherIds) {
        if (teacherIds == null || teacherIds.isEmpty()) {
            return 0;
        }

        return activities.stream()
            .filter(activity -> activity != null
                && activity.getPartnershipDeclarationType() != null
                && teacherIds.contains(resolveActivityUserId(activity)))
            .count();
    }

    private long averageByColleagueCount(long total, int colleagueCount) {
        if (colleagueCount <= 0 || total <= 0) {
            return 0;
        }

        return BigDecimal.valueOf(total)
            .divide(BigDecimal.valueOf(colleagueCount), 0, RoundingMode.HALF_UP)
            .longValue();
    }

    private SemesterCounts calculateTaughtGroupsBySemester(List<TeachingActivity> teachings) {
        Set<String> s1Groups = new LinkedHashSet<>();
        Set<String> s2Groups = new LinkedHashSet<>();

        for (TeachingActivity activity : teachings) {
            if (!isCourseDeclaration(activity) || activity.getSemester() == null) {
                continue;
            }

            String groupKey = normalizeKey(activity.getProgramName()) + "|" + normalizeKey(activity.getClassName());
            if (activity.getSemester() == SemesterType.S1) {
                s1Groups.add(groupKey);
            } else if (activity.getSemester() == SemesterType.S2) {
                s2Groups.add(groupKey);
            } else if (activity.getSemester() == SemesterType.ANNUEL) {
                s1Groups.add(groupKey);
                s2Groups.add(groupKey);
            }
        }

        return new SemesterCounts(s1Groups.size(), s2Groups.size());
    }

    private SemesterCounts calculateSurveillancesBySemester(List<ExamSurveillanceActivity> surveillances) {
        long s1Count = 0;
        long s2Count = 0;

        for (ExamSurveillanceActivity activity : surveillances) {
            if (activity == null || activity.getSemester() == null) {
                continue;
            }

            if (activity.getSemester() == SemesterType.S1) {
                s1Count += 1;
            } else if (activity.getSemester() == SemesterType.S2) {
                s2Count += 1;
            } else if (activity.getSemester() == SemesterType.ANNUEL) {
                s1Count += 1;
                s2Count += 1;
            }
        }

        return new SemesterCounts(s1Count, s2Count);
    }

    private List<AcademicYearPerformanceSnapshot> buildYearlyPerformanceHistory(Long userId, String currentPeriodLabel) {
        List<TeachingActivity> allTeachings = safeList(
            () -> getTeachingsForUser(userId, null),
            "history-teachings-for-user"
        );
        List<SupervisionActivity> allSupervisions = safeList(
            () -> getSupervisionsForUser(userId, null),
            "history-supervisions-for-user"
        );
        List<ResearchActivity> allResearches = safeList(
            () -> getResearchesForUser(userId, null),
            "history-researches-for-user"
        );
        List<EventActivity> allEvents = safeList(
            () -> getEventsForUser(userId, null),
            "history-events-for-user"
        );
        List<ExamSurveillanceActivity> allSurveillances = safeList(
            () -> getExamSurveillancesForUser(userId, null),
            "history-surveillances-for-user"
        );
        List<ResponsibilityActivity> allResponsibilities = safeList(
            () -> getResponsibilitiesForUser(userId, null),
            "history-responsibilities-for-user"
        );

        Set<String> periods = new LinkedHashSet<>();
        appendAcademicYears(periods, allTeachings);
        appendAcademicYears(periods, allSupervisions);
        appendAcademicYears(periods, allResearches);
        appendAcademicYears(periods, allEvents);
        appendAcademicYears(periods, allSurveillances);
        appendAcademicYears(periods, allResponsibilities);

        if (periods.isEmpty() && StringUtils.hasText(currentPeriodLabel)) {
            periods.add(currentPeriodLabel);
        }

        if (StringUtils.hasText(currentPeriodLabel)) {
            periods.add(currentPeriodLabel);
        }

        List<String> orderedPeriods = periods.stream()
            .sorted(Comparator.comparingInt(this::periodSortKey).reversed().thenComparing(Comparator.reverseOrder()))
            .toList();

        List<AcademicYearPerformanceSnapshot> snapshots = new ArrayList<>();

        for (String period : orderedPeriods) {
            List<TeachingActivity> periodTeachings = allTeachings.stream()
                .filter(activity -> matchesActivityPeriod(activity, period))
                .toList();
            List<SupervisionActivity> periodSupervisions = allSupervisions.stream()
                .filter(activity -> matchesActivityPeriod(activity, period))
                .toList();
            List<ResearchActivity> periodResearches = allResearches.stream()
                .filter(activity -> matchesActivityPeriod(activity, period))
                .toList();
            List<EventActivity> periodEvents = allEvents.stream()
                .filter(activity -> matchesActivityPeriod(activity, period))
                .toList();
            List<ExamSurveillanceActivity> periodSurveillances = allSurveillances.stream()
                .filter(activity -> matchesActivityPeriod(activity, period))
                .toList();
            List<ResponsibilityActivity> periodResponsibilities = allResponsibilities.stream()
                .filter(activity -> matchesActivityPeriod(activity, period))
                .toList();

            long partnershipCount = countPartnershipActivities(periodTeachings);
            long teachingCount = periodTeachings.size();
            long supervisionCount = periodSupervisions.size();
            long researchCount = periodResearches.size();
            long eventCount = periodEvents.size();
            long surveillanceCount = periodSurveillances.size();
            long responsibilityCount = periodResponsibilities.size();
            long totalActivities = teachingCount + supervisionCount + researchCount + eventCount + surveillanceCount + responsibilityCount;

            BigDecimal teachingPoints = periodTeachings.stream()
                .map(this::calculateApprovedPointsSafely)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal generalScore = scaled(teachingPoints.add(BigDecimal.valueOf(totalActivities)));

            snapshots.add(new AcademicYearPerformanceSnapshot(
                period,
                totalActivities,
                teachingCount,
                supervisionCount,
                researchCount,
                eventCount,
                surveillanceCount,
                responsibilityCount,
                partnershipCount,
                scaled(teachingPoints),
                generalScore
            ));
        }

        return snapshots;
    }

    private GeneralScoreRange calculateGeneralScoreRange(List<AcademicYearPerformanceSnapshot> snapshots) {
        if (snapshots == null || snapshots.isEmpty()) {
            return new GeneralScoreRange(zero(), zero(), zero());
        }

        List<BigDecimal> scores = snapshots.stream()
            .map(AcademicYearPerformanceSnapshot::generalScore)
            .map(this::scaled)
            .toList();

        BigDecimal max = scores.stream().reduce(BigDecimal.ZERO, BigDecimal::max);
        BigDecimal min = scores.stream().reduce(max, BigDecimal::min);
        BigDecimal sum = scores.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = scaled(sum.divide(BigDecimal.valueOf(scores.size()), 2, RoundingMode.HALF_UP));

        return new GeneralScoreRange(max, average, min);
    }

    private boolean matchesActivityPeriod(Activity activity, String periodLabel) {
        return activity != null && Objects.equals(activity.getAcademicYear(), periodLabel);
    }

    private void appendAcademicYears(Set<String> target, List<? extends Activity> activities) {
        for (Activity activity : activities) {
            if (activity == null) {
                continue;
            }

            if (StringUtils.hasText(activity.getAcademicYear())) {
                target.add(activity.getAcademicYear().trim());
            }
        }
    }

    private int periodSortKey(String periodLabel) {
        if (!StringUtils.hasText(periodLabel)) {
            return Integer.MIN_VALUE;
        }

        String trimmed = periodLabel.trim();
        int separatorIndex = trimmed.indexOf('-');
        String firstToken = separatorIndex > 0 ? trimmed.substring(0, separatorIndex).trim() : trimmed;

        try {
            return Integer.parseInt(firstToken);
        } catch (NumberFormatException exception) {
            return Integer.MIN_VALUE;
        }
    }

    private String normalizeKey(String value) {
        return StringUtils.hasText(value) ? value.trim().toLowerCase() : "";
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

    private TeacherPointsComparisonStats buildTeacherPointsComparison(String periodLabel) {
        List<User> teachers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT))
            .stream()
            .filter(user -> user.effectiveTeacherType() != TeacherType.VACATAIRE)
            .toList();
        if (teachers.isEmpty()) {
            return new TeacherPointsComparisonStats(zero(), zero(), zero(), 0);
        }

        Set<Long> teacherIds = teachers.stream()
            .map(User::getId)
            .collect(Collectors.toSet());

        Map<Long, BigDecimal> totalsByTeacher = new LinkedHashMap<>();
        for (User teacher : teachers) {
            totalsByTeacher.put(teacher.getId(), BigDecimal.ZERO);
        }

        for (TeachingActivity activity : getTeachings(periodLabel)) {
            if (activity == null) {
                continue;
            }

            Long teacherId = resolveActivityUserId(activity);
            if (teacherId == null) {
                continue;
            }

            if (!teacherIds.contains(teacherId)) {
                continue;
            }

            totalsByTeacher.computeIfPresent(
                teacherId,
                (ignored, current) -> current.add(calculateApprovedPointsSafely(activity))
            );
        }

        List<BigDecimal> totals = totalsByTeacher.values().stream()
            .map(this::scaled)
            .toList();

        BigDecimal max = totals.stream().reduce(BigDecimal.ZERO, BigDecimal::max);
        BigDecimal min = totals.stream().reduce(max, BigDecimal::min);
        BigDecimal sum = totals.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = totals.isEmpty()
            ? zero()
            : scaled(sum.divide(BigDecimal.valueOf(totals.size()), 2, RoundingMode.HALF_UP));

        return new TeacherPointsComparisonStats(max, average, min, totals.size());
    }

    private TeacherPointsComparisonStats buildDepartmentTeacherPointsComparison(User currentUser, String periodLabel) {
        if (currentUser == null || currentUser.getDepartment() == null || currentUser.getDepartment().getId() == null) {
            return new TeacherPointsComparisonStats(zero(), zero(), zero(), 0);
        }

        Long departmentId = currentUser.getDepartment().getId();
        List<User> teachers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT, RoleType.CHEF_DEPARTEMENT))
            .stream()
            .filter(user -> user.effectiveTeacherType() != TeacherType.VACATAIRE)
            .filter(user -> user.getDepartment() != null && Objects.equals(user.getDepartment().getId(), departmentId))
            .toList();
        if (teachers.isEmpty()) {
            return new TeacherPointsComparisonStats(zero(), zero(), zero(), 0);
        }

        Set<Long> teacherIds = teachers.stream()
            .map(User::getId)
            .collect(Collectors.toSet());

        Map<Long, BigDecimal> totalsByTeacher = new LinkedHashMap<>();
        for (User teacher : teachers) {
            totalsByTeacher.put(teacher.getId(), BigDecimal.ZERO);
        }

        for (TeachingActivity activity : getTeachings(periodLabel)) {
            if (activity == null) {
                continue;
            }

            Long teacherId = resolveActivityUserId(activity);
            if (teacherId == null || !teacherIds.contains(teacherId)) {
                continue;
            }

            totalsByTeacher.computeIfPresent(
                teacherId,
                (ignored, current) -> current.add(calculateApprovedPointsSafely(activity))
            );
        }

        List<BigDecimal> totals = totalsByTeacher.values().stream()
            .map(this::scaled)
            .toList();

        BigDecimal max = totals.stream().reduce(BigDecimal.ZERO, BigDecimal::max);
        BigDecimal min = totals.stream().reduce(max, BigDecimal::min);
        BigDecimal sum = totals.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = totals.isEmpty()
            ? zero()
            : scaled(sum.divide(BigDecimal.valueOf(totals.size()), 2, RoundingMode.HALF_UP));

        return new TeacherPointsComparisonStats(max, average, min, totals.size());
    }

    private BigDecimal scaled(BigDecimal value) {
        return nullSafe(value).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal scaledWeight(BigDecimal value) {
        return nullSafe(value).setScale(6, RoundingMode.HALF_UP);
    }

    private BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal zeroWeight() {
        return BigDecimal.ZERO.setScale(6, RoundingMode.HALF_UP);
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal calculateApprovedPointsSafely(TeachingActivity activity) {
        try {
            return nullSafe(teachingPerformanceCalculator.calculateApprovedTotalPoints(activity));
        } catch (RuntimeException exception) {
            return zero();
        }
    }

    private <T> List<T> safeList(Supplier<List<T>> supplier, String context) {
        try {
            List<T> value = supplier.get();
            return value == null ? List.of() : value;
        } catch (RuntimeException exception) {
            log.warn("Dashboard fallback activated for {}: {}", context, exception.getMessage());
            return List.of();
        }
    }

    private TeacherPointsComparisonStats safeTeacherPointsComparison(String periodLabel) {
        try {
            return buildTeacherPointsComparison(periodLabel);
        } catch (RuntimeException exception) {
            log.warn("Dashboard fallback activated for teacher-points-comparison: {}", exception.getMessage());
            return new TeacherPointsComparisonStats(zero(), zero(), zero(), 0);
        }
    }

    private TeacherPointsComparisonStats safeDepartmentTeacherPointsComparison(User currentUser, String periodLabel) {
        try {
            return buildDepartmentTeacherPointsComparison(currentUser, periodLabel);
        } catch (RuntimeException exception) {
            log.warn("Dashboard fallback activated for department-teacher-points-comparison: {}", exception.getMessage());
            return new TeacherPointsComparisonStats(zero(), zero(), zero(), 0);
        }
    }

    private static final class WorkflowAccumulator {
        private long totalActivities;
        private long submittedActivities;
        private long validatedActivities;
        private long rejectedActivities;

        private void add(ActivityStatus status) {
            totalActivities += 1;
            if (status == null) {
                return;
            }
            if (status == ActivityStatus.SOUMISE) {
                submittedActivities += 1;
                return;
            }
            if (status == ActivityStatus.REJETEE) {
                rejectedActivities += 1;
                return;
            }
            if (status == ActivityStatus.VALIDEE_DEPARTEMENT || status == ActivityStatus.VALIDEE_FINALE) {
                validatedActivities += 1;
            }
        }
    }

    private record TeacherPointsComparisonStats(
        BigDecimal maxPoints,
        BigDecimal averagePoints,
        BigDecimal minPoints,
        long teacherCount
    ) {
    }

    private record SemesterCounts(long s1Count, long s2Count) {
    }

    private record GeneralScoreRange(
        BigDecimal max,
        BigDecimal average,
        BigDecimal min
    ) {
    }

    private record DepartmentRanking(long position, long population) {
    }

    private record DashboardPeriodRange(LocalDateTime start, LocalDateTime end) {
    }
}

package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.TeachingPointsBreakdownResponse;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.PartnershipDeclarationType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Component;

@Component
public class TeachingPerformanceCalculator {

    private static final BigDecimal BONUS_HOUR_RATE = new BigDecimal("1.50");
    private static final BigDecimal RESTRUCTURING_MAX_POINTS = new BigDecimal("5.00");
    private static final BigDecimal CAR_FILE_POINTS = new BigDecimal("10.00");
    private static final BigDecimal EXAM_POINTS = new BigDecimal("5.00");
    private static final BigDecimal COORDINATION_POINTS = new BigDecimal("5.00");
    private static final BigDecimal PARTNERSHIP_ACADEMIC_POINTS = new BigDecimal("12.00");
    private static final BigDecimal PARTNERSHIP_PROFESSIONAL_POINTS = new BigDecimal("15.00");

    public TeachingPointsBreakdownResponse calculate(TeachingActivity activity) {
        if (activity.getUser() != null && activity.getUser().isTeacherWithoutPoints()) {
            return new TeachingPointsBreakdownResponse(
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                zero(),
                "NOT_REQUESTED"
            );
        }

        BigDecimal plannedHours = nullSafe(activity.getPlannedHours());
        BigDecimal newCourseHours = nullSafe(activity.getNewCourseHours());
        BigDecimal eveningOrSaturdayHours = nullSafe(activity.getEveningOrSaturdayHours());
        int restructuringPercentage = nullSafe(activity.getCourseRestructuringPercentage());
        int syllabusCount = nullSafe(activity.getSyllabusCount());

        BigDecimal coursePoints = scaled(plannedHours);
        BigDecimal newCoursePoints = scaled(newCourseHours.multiply(BONUS_HOUR_RATE));
        BigDecimal declaredRestructuringPoints = scaled(
            RESTRUCTURING_MAX_POINTS
                .multiply(BigDecimal.valueOf(restructuringPercentage))
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
        );
        BigDecimal approvedRestructuringPoints = Boolean.TRUE.equals(activity.getCourseRestructuringApproved())
            ? declaredRestructuringPoints
            : zero();
        BigDecimal syllabusPoints = scaled(BigDecimal.valueOf(syllabusCount));
        BigDecimal carFilePoints = activity.isCarFileElaborated() ? CAR_FILE_POINTS : zero();
        BigDecimal examPoints = activity.isExamElaborated() ? EXAM_POINTS : zero();
        BigDecimal eveningOrSaturdayPoints = scaled(eveningOrSaturdayHours.multiply(BONUS_HOUR_RATE));
        BigDecimal coordinationPoints = activity.isCoordination() ? COORDINATION_POINTS : zero();
        BigDecimal partnershipPoints = calculatePartnershipPoints(activity);

        BigDecimal declaredTotalPoints = zero()
            .add(coursePoints)
            .add(newCoursePoints)
            .add(declaredRestructuringPoints)
            .add(syllabusPoints)
            .add(carFilePoints)
            .add(examPoints)
            .add(eveningOrSaturdayPoints)
            .add(coordinationPoints)
            .add(partnershipPoints);

        BigDecimal approvedBreakdownTotalPoints = zero()
            .add(coursePoints)
            .add(newCoursePoints)
            .add(approvedRestructuringPoints)
            .add(syllabusPoints)
            .add(carFilePoints)
            .add(examPoints)
            .add(eveningOrSaturdayPoints)
            .add(coordinationPoints)
            .add(partnershipPoints);

        BigDecimal approvedTotalPoints = isApprovedForPerformance(activity.getStatus()) ? approvedBreakdownTotalPoints : zero();

        return new TeachingPointsBreakdownResponse(
            coursePoints,
            newCoursePoints,
            declaredRestructuringPoints,
            approvedRestructuringPoints,
            syllabusPoints,
            carFilePoints,
            examPoints,
            eveningOrSaturdayPoints,
            coordinationPoints,
            partnershipPoints,
            scaled(declaredTotalPoints),
            scaled(approvedTotalPoints),
            restructuringStatus(activity)
        );
    }

    public BigDecimal calculateApprovedTotalPoints(TeachingActivity activity) {
        return calculate(activity).approvedTotalPoints();
    }

    public BigDecimal calculateDeclaredTotalPoints(TeachingActivity activity) {
        return calculate(activity).declaredTotalPoints();
    }

    private boolean isApprovedForPerformance(ActivityStatus status) {
        return status == ActivityStatus.VALIDEE_DEPARTEMENT || status == ActivityStatus.VALIDEE_FINALE;
    }

    private String restructuringStatus(TeachingActivity activity) {
        if (activity.getCourseRestructuringPercentage() == null || activity.getCourseRestructuringPercentage() <= 0) {
            return "NOT_REQUESTED";
        }

        if (Boolean.TRUE.equals(activity.getCourseRestructuringApproved())) {
            return "APPROVED";
        }

        if (Boolean.FALSE.equals(activity.getCourseRestructuringApproved())) {
            return "REJECTED";
        }

        return "PENDING";
    }

    private BigDecimal scaled(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculatePartnershipPoints(TeachingActivity activity) {
        PartnershipDeclarationType declarationType = activity.getPartnershipDeclarationType();
        if (declarationType == null) {
            return zero();
        }

        if (declarationType == PartnershipDeclarationType.PROFESSIONNELLE) {
            return PARTNERSHIP_PROFESSIONAL_POINTS;
        }

        return PARTNERSHIP_ACADEMIC_POINTS;
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private int nullSafe(Integer value) {
        return value == null ? 0 : value;
    }
}

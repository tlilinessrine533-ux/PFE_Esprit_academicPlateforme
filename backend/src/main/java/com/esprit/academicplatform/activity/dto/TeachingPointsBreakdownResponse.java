package com.esprit.academicplatform.activity.dto;

import java.math.BigDecimal;

public record TeachingPointsBreakdownResponse(
    BigDecimal coursePoints,
    BigDecimal newCoursePoints,
    BigDecimal declaredRestructuringPoints,
    BigDecimal approvedRestructuringPoints,
    BigDecimal syllabusPoints,
    BigDecimal carFilePoints,
    BigDecimal examPoints,
    BigDecimal eveningOrSaturdayPoints,
    BigDecimal coordinationPoints,
    BigDecimal partnershipPoints,
    BigDecimal declaredTotalPoints,
    BigDecimal approvedTotalPoints,
    String restructuringStatus
) {
}

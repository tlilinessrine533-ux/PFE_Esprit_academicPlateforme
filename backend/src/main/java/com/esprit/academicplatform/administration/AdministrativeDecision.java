package com.esprit.academicplatform.administration;

import com.esprit.academicplatform.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "administrative_decisions")
public class AdministrativeDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "period_label", nullable = false, length = 20)
    private String periodLabel;

    @Column(name = "validated_activities", nullable = false)
    private long validatedActivities;

    @Column(name = "validated_teaching_points", nullable = false, precision = 10, scale = 2)
    private BigDecimal validatedTeachingPoints;

    @Column(name = "absence_days", nullable = false)
    private int absenceDays;

    @Column(name = "activity_type_points", nullable = false, precision = 10, scale = 2)
    private BigDecimal activityTypePoints;

    @Column(name = "calculated_bonus", nullable = false, precision = 12, scale = 2)
    private BigDecimal calculatedBonus;

    @Column(name = "calculated_promotion_points", nullable = false, precision = 12, scale = 2)
    private BigDecimal calculatedPromotionPoints;

    @Column(name = "decision_status", nullable = false, length = 20)
    private String decisionStatus;

    @Column(name = "decision_comment", length = 1000)
    private String decisionComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decided_by_id")
    private User decidedBy;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


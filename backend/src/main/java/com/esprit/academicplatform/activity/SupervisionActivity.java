package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.JuryRole;
import com.esprit.academicplatform.common.enums.StatutEncadrement;
import com.esprit.academicplatform.common.enums.SupervisionType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "supervision_activities")
@PrimaryKeyJoinColumn(name = "activity_id")
@DiscriminatorValue("ENCADREMENT")
public class SupervisionActivity extends Activity {

    @Enumerated(EnumType.STRING)
    @Column(name = "supervision_type", nullable = false, length = 80)
    private SupervisionType supervisionType;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_program", nullable = false, length = 150)
    private String studentProgram;

    @Column(name = "subject_title", nullable = false, length = 255)
    private String subjectTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "supervision_status", nullable = false, length = 20)
    private StatutEncadrement supervisionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_in_jury", nullable = false, length = 30)
    private JuryRole roleInJury;

    @Column(name = "quantity_value", nullable = false, precision = 8, scale = 2)
    private BigDecimal quantityValue;

    @Column(name = "activity_points", nullable = false, precision = 8, scale = 2)
    private BigDecimal activityPoints;
}

package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.TeachingMode;
import com.esprit.academicplatform.common.enums.PartnershipDeclarationType;
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
@Table(name = "teaching_activities")
@PrimaryKeyJoinColumn(name = "activity_id")
@DiscriminatorValue("ENSEIGNEMENT")
public class TeachingActivity extends Activity {

    @Column(name = "program_name", nullable = false, length = 150)
    private String programName;

    @Column(name = "class_name", nullable = false, length = 100)
    private String className;

    @Column(name = "module_name", nullable = false, length = 150)
    private String moduleName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SemesterType semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "teaching_mode", nullable = false, length = 20)
    private TeachingMode teachingMode;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(name = "planned_hours", nullable = false, precision = 6, scale = 2)
    private BigDecimal plannedHours;

    @Column(name = "completed_hours", nullable = false, precision = 6, scale = 2)
    private BigDecimal completedHours;

    @Column(name = "new_course_hours", nullable = false, precision = 6, scale = 2)
    private BigDecimal newCourseHours = BigDecimal.ZERO;

    @Column(name = "course_restructuring_percentage", nullable = false)
    private Integer courseRestructuringPercentage = 0;

    @Column(name = "course_restructuring_approved")
    private Boolean courseRestructuringApproved;

    @Column(name = "syllabus_count", nullable = false)
    private Integer syllabusCount = 0;

    @Column(name = "car_file_elaborated", nullable = false)
    private boolean carFileElaborated;

    @Column(name = "exam_elaborated", nullable = false)
    private boolean examElaborated;

    @Column(name = "evening_or_saturday_hours", nullable = false, precision = 6, scale = 2)
    private BigDecimal eveningOrSaturdayHours = BigDecimal.ZERO;

    @Column(name = "coordination", nullable = false)
    private boolean coordination;

    @Enumerated(EnumType.STRING)
    @Column(name = "partnership_declaration_type", length = 20)
    private PartnershipDeclarationType partnershipDeclarationType;

    @Column(name = "syllabus_path", length = 255)
    private String syllabusPath;
}

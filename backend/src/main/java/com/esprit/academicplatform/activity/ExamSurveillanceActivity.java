package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.SurveillanceSessionDay;
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
@Table(name = "exam_surveillance_activities")
@PrimaryKeyJoinColumn(name = "activity_id")
@DiscriminatorValue("SURVEILLANCE")
public class ExamSurveillanceActivity extends Activity {

    @Column(name = "session_name", nullable = false, length = 100)
    private String sessionName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SemesterType semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_day", nullable = false, length = 12)
    private SurveillanceSessionDay sessionDay;

    @Column(name = "session_points", nullable = false, precision = 4, scale = 2)
    private BigDecimal sessionPoints;

    @Column(name = "hours_count", nullable = false, precision = 6, scale = 2)
    private BigDecimal hoursCount;
}

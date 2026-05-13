package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.ResponsibilityType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "responsibility_activities")
@PrimaryKeyJoinColumn(name = "activity_id")
@DiscriminatorValue("RESPONSABILITE")
public class ResponsibilityActivity extends Activity {

    @Enumerated(EnumType.STRING)
    @Column(name = "responsibility_type", nullable = false, length = 30)
    private ResponsibilityType responsibilityType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}

package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import com.esprit.academicplatform.common.enums.LeaveType;
import com.esprit.academicplatform.common.enums.MissionKind;
import com.esprit.academicplatform.department.Department;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "availability_request_activities")
@PrimaryKeyJoinColumn(name = "activity_id")
@DiscriminatorValue("DISPONIBILITE")
public class AvailabilityRequestActivity extends Activity {

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 20)
    private AvailabilityRequestType requestType;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", length = 30)
    private LeaveType leaveType;

    @Column(name = "title", length = 180)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "mission_kind", length = 30)
    private MissionKind missionKind;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "pedagogical_unit", length = 180)
    private String pedagogicalUnit;

    @Column(name = "department_name", length = 100)
    private String departmentName;

    @Column(name = "medical_certificate_image_data_url", columnDefinition = "LONGTEXT")
    private String medicalCertificateImageDataUrl;
}

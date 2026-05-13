package com.esprit.academicplatform.reporting;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findAllByOrderByGeneratedAtDesc();

    List<Report> findByGeneratedByIdOrTargetUserIdOrderByGeneratedAtDesc(Long generatedById, Long targetUserId);

    List<Report> findByGeneratedByIdOrTargetUserIdOrDepartmentIdOrderByGeneratedAtDesc(
        Long generatedById,
        Long targetUserId,
        Long departmentId
    );
}
